import re
import sys
from pathlib import Path
from itertools import chain


# helper function to sort
def split_prm(prm):
    prml = prm.rstrip("1234567890")   # "cnst"
    if prml == prm:                   # "td"
        return (prml, 0)
    else:
        prmr = int(prm[len(prml):])   # 2
        return (prml, prmr)


def get_param_definitions(pulprog):
    """
    Searches the string pulprog for things that need to be defined.
    Fetches the definitions from templates/paramdefns, concatenates them with
    newlines, then returns the full string.
    """
    regexes = [r"(?<![A-Za-z])p\d{1,2}",      # pulses
               r"(?<![A-Za-z])d\d{1,2}",      # delays
               r"(?<![A-Za-z])l\d{1,2}",      # loop counters
               r"(?<![A-Za-z])cnst\d{1,2}",   # constants
               r"(?<![A-Za-z])sp\d{1,2}",     # shaped pulse
               r"(?<![A-Za-z])pcpd\d{1,2}",   # decoupling power
               r"(?<![A-Za-z])pl\d{1,2}",     # ordinary power
               r"(?<![A-Za-z])cpd\d{1,2}",    # decoupling program 
               ]
    regexes = [re.compile(r) for r in regexes]

    prms = set(chain.from_iterable(re.findall(r, pulprog) for r in regexes))
    prms = list(sorted(prms, key=split_prm))

    # go through the list and change stuff as needed.
    for i in range(len(prms)):
        # sp -> spnam
        if split_prm(prms[i])[0] == "sp":
            prms[i] = prms[i].replace("sp", "spnam")
        # cpd -> cpdprg
        if split_prm(prms[i])[0] == "cpd":
            prms[i] = prms[i].replace("cpd", "cpdprg")

    # now make the list of definitions
    definitions = ""
    defn_file = "templates/definitions"
    for prm in prms:
        with open(defn_file) as file:
            for line in file:
                if line.startswith(f";{prm}:"):
                    definitions += line
    return definitions


def stderr_input(text):
    """
    input() but it prints to stderr instead of stdout.
    """
    old_stdout = sys.stdout
    sys.stdout = sys.stderr
    result = input(text)
    sys.stdout = old_stdout
    return result


def get_module_text(fnames, segment):
    """
    Usage: get_module_text([fname, fname2], "preamble")
    Reads the given files and returns the text between the comments
    /* begin segment */ and /* end segment */.
    Prunes duplicates to make sure that we don't (e.g.) increment a pulse
    phase twice.
    """
    lines = []
    short_lines = []
    record = False

    for fname in fnames:
        with open(fname) as file:
            for line in file:
                # start marker
                if line.strip() == f"/* begin {segment} */":
                    record = True
                    continue
                # end marker
                if line.strip() == f"/* end {segment} */":
                    record = False
                    break

                # if it's the pulprog, don't cut anything!!!
                if record and segment == "module":
                    lines.append(line)
                    continue

                # otherwise, do some processing
                if record and line.split("=")[0].strip() not in short_lines:
                    lines.append(line)
                    if line.split("=")[0].strip() != "":
                        short_lines.append(line.split("=")[0].strip()) # e.g. ph2=1
    return "".join(lines)


def prettify_preamble(combined_preambles):
    """Arranges the preamble text in a much nicer way."""
    lines = combined_preambles.split("\n")
    # define *** lines can just be sorted alphabetically
    definelines = [l for l in lines if l.startswith("define")]
    definelines.sort()
    # otherwise we need to sort by the variable
    notdefinelines = [l for l in lines if not l.startswith("define")]
    def sort_preamble(line):
        prm_name = line.split("=")[0].lstrip('"').strip()
        return split_prm(prm_name)
    notdefinelines.sort(key=sort_preamble)
    # the manually defined delays need to go after the other params,
    # because they depend on definitions of other params
    DElines = [l for l in notdefinelines if l.startswith('"D')]
    paramlines = [l for l in notdefinelines if not l.startswith('"D')]
    # join them back together
    lines = definelines + paramlines + DElines
    return "\n".join(lines)


def prettify_gradients(gradient_strengths):
    """
    Arranges gradients and adds gpnam = SMSQ10.100 to all of them.
    """
    gpzlines = gradient_strengths.split("\n")
    # Sort the gpzX lines in ascending order.
    def sort_gradients(line):
        prm_name = line.split(":")[0].lstrip(';').strip()
        return split_prm(prm_name)
    gpzlines.sort(key=sort_gradients)
    # Add gpnam lines.
    gpnamlines = []
    for _, n in (sort_gradients(l) for l in gpzlines):
        gpnamlines.append(f";gpnam{n}: SMSQ10.100")
    gplines = gpzlines + gpnamlines
    return "\n".join(gplines)


def get_module(nuc):
    """
    Usage: get_module("15N"), get_module("13C"), get_module("1H")
    """
    modules = [i.name.replace(f"{nuc}_", "")
               for i in Path("modules").iterdir()
               if i.name.startswith(f"{nuc}_")]
    if len(modules) > 0:
        pps = ", ".join([f"{i} for {pp}" for i, pp in enumerate(modules, start=1)])
        try:
            y = stderr_input(f"\nChoose {nuc} module ({pps})\n>>> ")
        except (EOFError, KeyboardInterrupt):
            print("", file=sys.stderr)
            sys.exit()
        try:
            y = int(y.strip())
            return modules[y - 1]
        except (ValueError, IndexError):
            print("Invalid selection.", file=sys.stderr)
            sys.exit()
    else:
        print(f"No modules for nucleus {nuc} found.", file=sys.stderr)
        sys.exit()


def main():
    # choose template and get nuclei
    if sys.argv[1] == "NCH":
        modules = 3
        nuclei = ("15N", "13C", "1H")
    elif sys.argv[1] == "CH":
        modules = 2
        nuclei = ("13C", "1H")
    else:
        sys.exit()

    template_file = f"templates/{sys.argv[1]}"
    module_names = sys.argv[2:2+modules]
    module_files = [f"modules/{nuc}_{name}" for (nuc, name) in zip(nuclei, module_names)]

    all_lines = ""
    count = 0
    real_modules = modules + 1 if module_names[-1] in ["CN", "CT"] else modules
    with open(template_file) as ft:
        for line in ft:
            # pulse programme name
            if line.strip() == "/* insert pulprog name here */":
                modules_concat = "".join(module_names)
                all_lines += f"; jy-noah{real_modules}_{modules_concat}\n"
                continue

            # preambles
            if line.strip() == "/* insert preamble here */":
                all_lines += prettify_preamble(get_module_text(module_files,
                                                               "preamble"))
                continue

            # module pulse programme itself
            if line.strip() == "/* insert module here */":
                all_lines += get_module_text([module_files[count]], "module")
                count += 1
                continue

            # EA incrementation
            if line.strip() == "/* increment params with EA here */":
                all_lines += "  1m igrad EA\n"
                all_lines += get_module_text(module_files, "EA increment")
                continue

            # t1 incrementation
            if line.strip() == "/* increment params with t1 here */":
                all_lines += get_module_text(module_files, "t1 increment")
                continue

            # 15N t1 incrementation
            if line.strip() == "/* increment params with 15N t1 here */":
                all_lines += get_module_text(module_files, "15N t1 increment")
                continue

            # Pulse phases
            if line.strip() == "/* insert pulse phases here */":
                all_lines += "ph1=0\n"
                all_lines += "ph2=1\n"
                all_lines += get_module_text(module_files, "pulse phases")
                continue

            # Gradients
            if line.strip() == "/* insert gradients here */":
                all_lines += prettify_gradients(get_module_text(module_files,
                                                                "gradients"))
                continue

            # WaveMaker definitions
            if line.strip() == "/* insert WaveMaker definitions here */":
                all_lines += get_module_text(module_files, "wavemaker")
                continue

            # parameter definitions
            if line.strip() == "/* insert parameter definitions here */":
                all_lines += get_param_definitions(all_lines)
                continue

            # everything else
            all_lines += line

    print(all_lines)


if __name__ == "__main__":
    main()
