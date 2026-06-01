#!/usr/bin/env python3
"""Compress & tidy Lottie JSON for the dansch.ca sketchbook.

Works on exports from After Effects (Bodymovin) and Cavalry — same schema,
same treatment. Render-preserving by default; the big win is just stripping
the exporter's pretty-print whitespace.

What it does:
  - minify            strip pretty-print whitespace (the dominant saving)
  - round floats      to --dp decimals (default 3; exporters emit float noise)
  - drop metadata     editor-only keys: layer/shape names (nm, mn), the meta
                      generator block, empty top-level props/markers
  - normalise colour  set every solid fill/stroke to black. The sketchbook page
                      recolours to the theme (--fg) at runtime, so the stored
                      colour is cosmetic; black keeps the source files uniform
                      and visible if JS is off. Skip with --keep-colour.

Safety: if a file contains baked expressions (a "x":"..." property), names are
*kept* for that file (expressions can reference them) and a note is printed.

Usage:
  tools/clean-lottie.py sketchbook/*.json           # tidy in place, report savings
  tools/clean-lottie.py --dry-run sketchbook/*.json # report only, write nothing
  tools/clean-lottie.py --dp 6 sketchbook/009.json  # gentler rounding for a delicate one
  tools/clean-lottie.py --keep-colour logo.json     # leave fills/strokes as authored
"""
import argparse, json, os, sys

NAME_KEYS = {"nm", "mn"}          # exporter names — unused at render (unless expressions)


def transform(o, dp, keep_colour, drop_names):
    if isinstance(o, float):
        r = round(o, dp)
        return int(r) if r == int(r) else r
    if isinstance(o, list):
        return [transform(x, dp, keep_colour, drop_names) for x in o]
    if isinstance(o, dict):
        out = {}
        for k, v in o.items():
            if drop_names and k in NAME_KEYS:
                continue
            # a static solid colour: c.k is a numeric [r,g,b(,a)] array
            if (not keep_colour and k == "c" and isinstance(v, dict)
                    and isinstance(v.get("k"), list) and v["k"]
                    and isinstance(v["k"][0], (int, float))):
                a = v["k"][3] if len(v["k"]) > 3 else 1
                kept = {kk: transform(vv, dp, keep_colour, drop_names)
                        for kk, vv in v.items() if kk != "k"}
                out[k] = {**kept, "k": [0, 0, 0, a]}
                continue
            out[k] = transform(v, dp, keep_colour, drop_names)
        return out
    return o


def process(path, args):
    before = os.path.getsize(path)
    raw = open(path, encoding="utf-8").read()
    doc = json.loads(raw)

    has_expr = '"x":"' in raw          # baked expressions may reference nm/mn
    drop_names = not has_expr
    doc = transform(doc, args.dp, args.keep_colour, drop_names)

    doc.pop("meta", None)              # exporter/author block — not needed to render
    doc.pop("props", None)
    if not doc.get("markers"):
        doc.pop("markers", None)

    blob = json.dumps(doc, separators=(",", ":"), ensure_ascii=False)
    after = len(blob.encode("utf-8"))
    if not args.dry_run:
        open(path, "w", encoding="utf-8").write(blob)

    pct = 100 * (before - after) // before if before else 0
    note = "  [kept names: has expressions]" if has_expr else ""
    print(f"{os.path.basename(path):<16} {before:>7} -> {after:>6} bytes  (-{pct}%){note}")
    return before, after


def main():
    ap = argparse.ArgumentParser(description=__doc__,
                                 formatter_class=argparse.RawDescriptionHelpFormatter)
    ap.add_argument("files", nargs="+", help="Lottie .json files (in place)")
    ap.add_argument("--dp", type=int, default=3, help="float decimal places (default: 3)")
    ap.add_argument("--keep-colour", action="store_true",
                    help="don't normalise fills/strokes to black")
    ap.add_argument("--dry-run", action="store_true", help="report savings, write nothing")
    args = ap.parse_args()

    tb = ta = 0
    for path in args.files:
        try:
            b, a = process(path, args)
            tb += b
            ta += a
        except Exception as e:                       # malformed JSON, missing file, ...
            print(f"{path}: SKIPPED ({e})", file=sys.stderr)

    if len(args.files) > 1 and tb:
        print("-" * 52)
        print(f"{'total':<16} {tb:>7} -> {ta:>6} bytes  (-{100*(tb-ta)//tb}%)")
    if args.dry_run:
        print("(dry run — nothing written)")


if __name__ == "__main__":
    main()
