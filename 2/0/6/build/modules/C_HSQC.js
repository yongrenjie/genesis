import NOAHModule from "../noahModule.js";
let shortDescription = `; 13C HSQC
;     [use -DEDIT for multiplicity editing]`;
let preamble = `
"p2      = p1*2"                       ; 1H hard 180
"d2      = 0.5s/cnst2"                 ; JCOMP
"d4      = 0.25s/cnst2"                ; 13C INEPT
"d0      = 3u"                         ; 13C HSQC t1
"in0     = inf1/2"                     ; 13C HSQC increment
define delay DC_HSQC1
define delay DC_HSQC2
define delay DC_HSQC3
define delay DC_HSQC4
define delay DC_HSQC5
define delay DC_HSQC6
"DC_HSQC1   = d4-p14/2"
"DC_HSQC2   = d4+p14/2"
"DC_HSQC3   = p16+d16+p2/2+d0-p3*2/PI+4u"
"DC_HSQC4   = d2+p3+p2/2"
"DC_HSQC5   = DC_HSQC3+p3-p2/2"
"DC_HSQC6   = DC_HSQC2-p16-d16-p3-de+p1*2/PI-8u"
"cnst41  = 2*sfo2/sfo1"                ; gradient ratio
define list<gradient> GC_HSQC={cnst41}
`;
let pulprog = `
  ; 13C-1H HSQC

  ; INEPT
  (p1 ph0):f1
  DC_HSQC1
  (p14:sp3 ph0):f2
  (p2 ph0):f1
  DC_HSQC2 pl2:f2
  (p1 ph1):f1
  (p3 ph5):f2
  DC_HSQC3

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
  DC_HSQC4
  (p31:sp18 ph0):f2
  DC_HSQC5
  (p2 ph1):f1
  d2 pl2:f2
#else
  (p14:sp3 ph0):f2
  DC_HSQC3 pl2:f2
#endif /* EDIT */

  ; reverse INEPT
  (p3 ph7):f2
  (p1 ph0):f1
  DC_HSQC1
  (p14:sp3 ph0):f2
  (p2 ph1):f1
  4u
  p16:gp4*EA*GC_HSQC
  d16 pl2:f2
  DC_HSQC6
  (p3 ph0):f2
  4u pl12:f2
  goscnp ph30 cpd2:f2
  50u do:f2
`;
const mod = new NOAHModule("c13", "S", "noah_hsqc", shortDescription, preamble, pulprog);
export default mod;
// vim: syntax=bruker:
