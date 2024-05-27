"""
noah_nus2.py
-----------
Script to set up NUS for NOAH experiments. To turn on NUS, run `noah_nus2` from
the TopSpin command line. To disable NUS on a dataset where it was previously
enabled, run `noah_nus2 off`.

v: 2.0.18
Jonathan Yong & Tim Claridge, University of Oxford
Eriks Kupce, Bruker UK
modified from original Python script by Maksim Mayzel, Bruker BioSpin AG
23 November 2021
"""

from __future__ import division, with_statement

import os, sys
import java.lang.System as System
import random
from de.bruker.nmr.mfw.root.UtilPath import getTopspinHome
from de.bruker.nmr.prsc.dbxml.ParfileLocator import getParfileDirs


NUS_ALREADY_ON = ("NUS has already been enabled for this dataset.\n"
                  "Please disable NUS first with 'noah_nus2 off' before"
                  " reconfiguring NUS.")
NUS_ALREADY_OFF = ("NUS has not been enabled for this dataset yet.\n"
                   "You can enable it using the command 'noah_nus2 on'.")
MODULE_UNSUPPORTED = ("One or more modules in this supersequence (likely\nQF"
                      " COSY, 2D J, or PSYCHE) are not compatible with NUS.")
GENESIS_URL = "https://nmr-genesis.co.uk"
PP_NOT_GENESIS = ("This pulse programme is not suitable for use\n"
                  " with this NUS script. You may be able to use\n"
                  " the old 'noah_nus.py' script; or you can download\n"
                  " a new version of this pulse programme from the\n"
                  " GENESIS website ({}).").format(GENESIS_URL)


def enable_nus():
    # Check if NUS is already enabled.
    zgoptns, vclist = GETPAR("ZGOPTNS"), GETPAR("VCLIST")
    if "-DNUS" in zgoptns and "noah" in vclist:
        err_exit(NUS_ALREADY_ON)

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

    # Figure out how long the NUS list should be, based on NusAMOUNT and other
    # parameters.
    td1 = int(GETPAR("1 TD"))
    nbl = int(GETPAR("NBL"))
    t1_incrs_full = int(td1 / (nbl * 2))  # this is "l0" in the pulprog
    t1_incrs_nus = int(t1_incrs_full * float(GETPAR("NusAMOUNT")) / 100)
    # Replace TD1 with the lower number to reflect the usage of NUS.
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
    EXIT()


def disable_nus():
    # Check if NUS is already enabled.
    zgoptns, vclist = GETPAR("ZGOPTNS"), GETPAR("VCLIST")
    if not ("-DNUS" in zgoptns and "noah" in vclist):
        err_exit(NUS_ALREADY_OFF)
    # To undo NUS is easier, since we don't need to generate the list.
    # Back-calculate TD1.
    nus_td1 = int(GETPAR("1 TD"))
    nusamount = float(GETPAR("NusAMOUNT"))
    full_td1 = int(nus_td1 * 100 / nusamount)
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
    EXIT()


def err_exit(message):
    ERRMSG(message, title="noah_nus2.py")
    EXIT()


def found_in_file(fname, needle):
    with open(fname, "r") as file:
        for line in file:
            if needle in line:
                return True
    return False


if __name__ == "__main__":
    # Make sure that this is really a NOAH experiment.
    if "noah" not in GETPAR("PULPROG").lower():
        ERRMSG("noah_nus2.py: only intended for use with NOAH datasets")
        EXIT()
    # If it didn't fail this check but NBL < 2, then it's not the original
    # dataset and noah_nus2 won't have any effect.
    if int(GETPAR("NBL")) < 2:
        ERRMSG("noah_nus2.py: this is a processed dataset; please run this"
               " script on the original dataset used for acquisition.")
        EXIT()

    if len(sys.argv) < 2:
        enable_nus()
    elif sys.argv[1] in ["on", "enable"]:
        enable_nus()
    elif sys.argv[1] in ["off", "disable", "undo"]:
        disable_nus()
    else:
        ERRMSG("noah_nus2.py: unrecognised arguments.\n"
               "Usage: 'noah_nus2 [on/off]'")
        EXIT()
