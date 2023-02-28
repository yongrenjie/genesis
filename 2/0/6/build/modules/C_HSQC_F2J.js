import NOAHModule from "../noahModule.js";
let shortDescription = `; 13C HSQC (F2-coupled)
;     [use -DEDIT for multiplicity editing]`;
let preamble = `
"p2      = p1*2"                       ; 1H hard 180
"d2      = 0.5s/cnst2"                 ; JCOMP
"d4      = 0.25s/cnst2"                ; 13C INEPT
"d0      = 3u"                         ; 13C HSQC t1
"in0     = inf1/2"                     ; 13C HSQC increment
define delay DC_HSQC_F2J1
define delay DC_HSQC_F2J2
define delay DC_HSQC_F2J3
define delay DC_HSQC_F2J4
define delay DC_HSQC_F2J5
define delay DC_HSQC_F2J6
"DC_HSQC_F2J1   = d4-p14/2"
"DC_HSQC_F2J2   = d4+p14/2"
"DC_HSQC_F2J3   = p16+d16+p2/2+d0-p3*2/PI+4u"
"DC_HSQC_F2J4   = d2+p3+p2/2"
"DC_HSQC_F2J5   = DC_HSQC_F2J3+p3-p2/2"
"DC_HSQC_F2J6   = DC_HSQC_F2J2-p16-d16-p3-de+p1*2/PI-8u"
"cnst41  = 2*sfo2/sfo1"                ; gradient ratio
define list<gradient> GC_HSQC_F2J={cnst41}
`;
let pulprog = `
  ; 13C-1H HSQC (F2-coupled)

  ; INEPT
  (p1 ph0):f1
  DC_HSQC_F2J1
  (p14:sp3 ph0):f2
  (p2 ph0):f1
  DC_HSQC_F2J2 pl2:f2
  (p1 ph1):f1
  (p3 ph5):f2
  DC_HSQC_F2J3

  ; t1 period
#ifdef EDIT
  (p31:sp18 ph0):f2
#else
  (p14:sp3 ph0):f2
#endif /* EDIT */
  4u
  p16:gp4
  d16
  d0
  (p2 ph11):f1
  d0
  4u
  p16:gp4
  d16

  ; multiplicity editing
#ifdef EDIT
  DC_HSQC_F2J4
  (p31:sp18 ph0):f2
  DC_HSQC_F2J5
  (p2 ph1):f1
  d2 pl2:f2
#else
  (p14:sp3 ph0):f2
  DC_HSQC_F2J3 pl2:f2
#endif /* EDIT */

  ; reverse INEPT
  (p3 ph7):f2
  (p1 ph0):f1
  DC_HSQC_F2J1
  (p14:sp3 ph0):f2
  (p2 ph1):f1
  4u
  p16:gp4*EA*GC_HSQC_F2J
  d16 pl2:f2
  DC_HSQC_F2J6
  (p3 ph0):f2
  4u
  goscnp ph30
  50u
`;
const mod = new NOAHModule("c13", "Sj", "noah_hsqc", shortDescription, preamble, pulprog);
export default mod;
// vim: syntax=bruker:
