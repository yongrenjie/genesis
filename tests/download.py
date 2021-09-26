"""
download.py
-----------

Python script which downloads a series of pulse programmes whose modules are
listed in a file. Prerequisites are Python 3.6+ and the `requests` library.

Usage:

1. Generate the file modules.txt. Each line of this should contain a
   comma-separated list of module identifiers, optionally with the string
   "; module identifiers:" preceding it. This allows you to create the file by
   running something like:
     
    grep "module identifier" > modules.txt
     
   inside a folder containing a series of NOAH pulse programmes.

2. Run the script

    python download.py -f modules.txt

   The pulse programmes should then appear in the current working directory.

More functionality to be added later.

In order to generate the regression tests, launch the local version using `npm
test`, cd to the `tests` directory containing this script, and run

    python download.py -a 127.0.0.1:5555 -f regression_tests.txt -o ./pp_latest
"""

import argparse
import os
import sys
from pathlib import Path

import requests


def main(args):
    with open(args.file, 'r') as file:
        for line in file:
            line = line.replace("; module identifiers: ", "")
            modules = line.split()
            url = f"{args.address}/download?modules={'+'.join(modules)}"
            if not url.startswith("http"):
                url = f"http://{url}"   # can't assume https
            r = requests.get(url)

            if r.status_code >= 400:
                print((f"modules {' '.join(modules)} gave error code"
                       f" {r.status_code}"), file=sys.stderr)
            else:
                dirname = (Path(args.output)
                           if args.output is not None
                           else Path.cwd())
                fname = r.text.splitlines()[0][1:].strip()
                with open(dirname / fname, 'w') as outfile:
                    print(r.text, file=outfile)


if __name__ == "__main__":
    parser = argparse.ArgumentParser()
    parser.add_argument("-f", "--file", help="File containing module lists", type=str)
    parser.add_argument("-o", "--output", help="Output directory", type=str)
    parser.add_argument("-a", "--address",
                        help=("Domain name (e.g. 'nmr-genesis.co.uk' or IP (e.g."
                              " '127.0.0.1:5555') to download from"),
                        type=str, default="https://nmr-genesis.co.uk")
    main(parser.parse_args())
