"""
noah_nus2.py
-----------
Script to set up NUS for NOAH experiments. To turn on NUS, run `noah_nus2` from
the TopSpin command line. To disable NUS on a dataset where it was previously
enabled, run `noah_nus2 off`.

You may wish to save this script as noah_nus.py, overwriting the old version.
In practice, there is no good reason to retain the old version as long as you
make sure to only use pulse programmes obtained from the GENESIS website:
https://nmr-genesis.co.uk

v: 2.1.6
Jonathan Yong & Tim Claridge, University of Oxford
Eriks Kupce, Bruker UK
modified from original Python script by Maksim Mayzel, Bruker BioSpin AG
14 March 2022
"""

from __future__ import division, with_statement

import os, sys
import java.lang.System as System
import random
from de.bruker.nmr.mfw.root.UtilPath import getTopspinHome
from de.bruker.nmr.prsc.dbxml.ParfileLocator import getParfileDirs


NUS_ALREADY_ON = ("NUS has already been enabled for this dataset.\n"
                  "Please disable NUS first with '{} off' before"
                  " reconfiguring NUS.")
NUS_ALREADY_OFF = ("NUS has not been enabled for this dataset yet.\n"
                   "You can enable it using the command '{} on'.")
MODULE_UNSUPPORTED = ("One or more modules in this supersequence (likely\nQF"
                      " COSY, 2D J, or PSYCHE) are not compatible with NUS.")
GENESIS_URL = "https://nmr-genesis.co.uk"
PP_NOT_GENESIS = ("This pulse programme is not suitable for use\n"
                  " with this NUS script. You may be able to use\n"
                  " the old 'noah_nus.py' script; or you can download\n"
                  " a new version of this pulse programme from the\n"
                  " GENESIS website ({}).").format(GENESIS_URL)


def enable_nus():
    # Check if NUS is already enabled. If so, disable it.
    zgoptns, vclist = GETPAR("ZGOPTNS"), GETPAR("VCLIST")
    if "-DNUS" in zgoptns and "noah" in vclist:
        disable_nus(show_message=False)

    # Check if the pulse programme supports -DNUS flag
    pulprog = GETPAR("PULPROG")
    for directory in getParfileDirs(0):  # gets pulprog directories
        found_pulprog = False
        if pulprog in os.listdir(directory):
            pulprog_fname = os.path.join(directory, pulprog)
            if os.path.isfile(pulprog_fname):
                found_pulprog = True
                if not found_in_file(pulprog_fname, GENESIS_URL):
                    err_exit(PP_NOT_GENESIS)
                if not found_in_file(pulprog_fname, "#ifdef NUS"):
                    err_exit(MODULE_UNSUPPORTED)
                break
    # Exit if pulse programme was not found
    if not found_pulprog:
        err_exit("Pulse programme '{}' was not found.".format(pulprog))

    # Reset FnTYPE.
    PUTPAR("FnTYPE", "traditional(planes)")

    # Reset cnst39 (15N k-scaling factor) back to 1.
    PUTPAR("CNST 39", "1")

    # The NUS sampling amount is preferentially read from sys.argv, but if not
    # given is taken from the NusAMOUNT parameter.
    if len(sys.argv) > 2:
        try:
            nus_amount = float(sys.argv[2])
        except ValueError:
            usage_err_exit()
    else:
        nus_amount = float(GETPAR("NusAMOUNT"))

    # Check that it isn't wacky
    if nus_amount >= 100 or nus_amount <= 0:
        err_exit('NUS percentage must be between 0 and 100')

    PUTPAR("NusAMOUNT", str(nus_amount))

    # Calculate appropriate TD1 and replace it
    td1 = int(GETPAR("1 TD"))
    nbl = int(GETPAR("NBL"))
    t1_incrs_full = int(td1 / (nbl * 2))  # this is "l0" in the pulprog
    t1_incrs_nus = int((t1_incrs_full * nus_amount / 100) + 0.5)
    PUTPAR("1 TD", str(t1_incrs_nus * 2 * nbl))

    # Generate the NUS list. This is delegated to the nussampler executable.
    # Path to TopSpin installation.
    tshome = getTopspinHome()
    # Path to the executable which generates the NUS sampling schedule.
    nussampler_path = os.path.join(tshome, "prog", "bin", "nussampler")
    if "Windows" in System.getProperty("os.name"):
        nussampler_path += ".exe"
    # vclist file that we're writing to.
    nus_list_path = os.path.join(tshome, "exp", "stan", "nmr",
                                 "lists", "vc", "noah")

    nusstr = ('{} -p "file={}" "NDIM=2" "SPARSE=y" "SEED={}" '
              '"sptype norepeatshuffle" "f180 nn" "CT_SP nn" "CEXP nn" '
              '"phase 0 0" "Jsp 0 0" "T2 {} 1" "FIRST_POINT_ZERO 1" '
              '"nholes -1" "SW={} 1" "NIMAX={} 1" "NIMIN=0 0" "NI={} 1"'
              ).format(nussampler_path,
                       nus_list_path,
                       random.randint(0, 1000),
                       GETPAR("1 NusT2"),
                       GETPAR("1 SWH"),
                       t1_incrs_full,
                       t1_incrs_nus
                       )
    exitcode = os.system(nusstr)
    # Check for errors.
    if exitcode != 0:
        err_exit("nussampler exited with code {}".format(exitcode))

    # Put the newly generated 'noah' list as the VCLIST parameter.
    PUTPAR("VCLIST", "noah")
    # Append -DNUS to zgoptns.
    zgoptns = zgoptns.strip() + " -DNUS"
    PUTPAR("ZGOPTNS", zgoptns)
    # Change FnTYPE back to the default, just in case the user changed it.
    PUTPAR("FnTYPE", "traditional(planes)")
    # Show a message
    info_message("NUS percentage successfully set to {}%.\n"
                 "Full TD1 per module without NUS = {}\n"
                 "TD1 per module with NUS (now active) = {}".format(
                     nus_amount, t1_incrs_full * 2, t1_incrs_nus * 2))


def disable_nus(show_message=True):
    # Check if NUS is already enabled.
    zgoptns, vclist = GETPAR("ZGOPTNS"), GETPAR("VCLIST")
    if not ("-DNUS" in zgoptns and "noah" in vclist):
        info_message(NUS_ALREADY_OFF.format(this_script_name()))
        return

    # To undo NUS is easier, since we don't need to generate the list.
    # Back-calculate TD1.
    nus_td1 = int(GETPAR("1 TD"))
    nus_amount = float(GETPAR("NusAMOUNT"))
    full_td1 = int(nus_td1 * 100 / nus_amount)
    PUTPAR("1 TD", str(full_td1))

    # Unset the zgoptns flag.
    # In TopSpin there is some very odd behaviour where if you PUTPAR(par, "")
    # it doesn't clear out the field, but rather fills it with "0", as if one
    # did PUTPAR(par, "0"). In order to get around this we have to put a single
    # space (which TopSpin then trims by itself).
    zgoptns = zgoptns.replace("-DNUS", "").strip()
    zgoptns = zgoptns if zgoptns != "" else " "
    PUTPAR("ZGOPTNS", zgoptns)

    # Remove vclist. See note above about using " " instead of "".
    PUTPAR("VCLIST", " ")
    # Show a message if desired
    if show_message:
        info_message("NUS successfully disabled")


def err_exit(message):
    # Show an error message and exit
    this_script = this_script_name()
    prefixed_message = "{}.py: {}".format(this_script, message)
    ERRMSG(prefixed_message, title="{}.py".format(this_script))
    EXIT()


def usage_err_exit():
    # Show usage guidance and exit
    this_script = this_script_name()
    err_exit("Unrecognised arguments. Usage:\n\n"
             "'{} on' - switches NUS on according to NusAMOUNT parameter\n"
             "'{} on <percentage>' - use a specified NUS percentage\n"
             "'{} off' - disable NUS".format(this_script,
                                             this_script,
                                             this_script))


def info_message(message):
    # Displays an info message without forcing the user to click OK. See
    # MSG_nonmodal() in nmrpoise/poise.py
    this_script = this_script_name()
    prefixed_message = "{}.py: {}".format(this_script, message)
    dialog = mfw.BInfo()
    dialog.setMessage(prefixed_message)
    dialog.setTitle("{}.py".format(this_script))
    dialog.setBlocking(0)  # in ordinary MSG() this is 1
    dialog.show()


def found_in_file(fname, needle):
    with open(fname, "r") as file:
        for line in file:
            if needle in line:
                return True
    return False


def this_script_name():
    # Jython doesn't let us use __file__
    return os.path.splitext(os.path.basename(sys.argv[0]))[0]


if __name__ == "__main__":
    # Make sure that this is really a NOAH experiment.
    if "noah" not in GETPAR("PULPROG").lower():
        err_exit("Only intended for use with NOAH datasets")
    # If it didn't fail this check but NBL < 2, then it's not the original
    # dataset and this script won't have any effect.
    if int(GETPAR("NBL")) < 2:
        err_exit("This is a processed dataset; please run this script on the"
                 " original dataset used for acquisition.")

    if len(sys.argv) < 2:
        enable_nus()
    elif sys.argv[1] in ["on", "enable"]:
        enable_nus()
    elif sys.argv[1] in ["off", "disable", "undo"]:
        disable_nus()
    else:
        usage_err_exit()
