import { Kupce2017ACIE } from "../citation.js";
import NOAHModule from "../noahModule.js";
let shortDescription = `; 13C HSQC (F2-coupled) (half resolution)
;     [use -DEDIT for multiplicity editing]`;
let preamble = `
"p2      = p1*2"                       ; 1H hard 180
"d2      = 0.5s/cnst2"                 ; JCOMP
"d4      = 0.25s/cnst2"                ; 13C INEPT
"d3      = 3u"                         ; 13C HSQC t1
"in3     = inf1/2"                     ; 13C HSQC increment
define delay DC_HSQC_F2JK1
define delay DC_HSQC_F2JK2
define delay DC_HSQC_F2JK3
define delay DC_HSQC_F2JK4
define delay DC_HSQC_F2JK5
define delay DC_HSQC_F2JK6
"DC_HSQC_F2JK1   = d4-p14/2"
"DC_HSQC_F2JK2   = d4+p14/2"
"DC_HSQC_F2JK3   = p16+d16+p2/2+d3-p3*2/PI+4u"
"DC_HSQC_F2JK4   = d2+p3+p2/2"
"DC_HSQC_F2JK5   = DC_HSQC_F2JK3+p3-p2/2"
"DC_HSQC_F2JK6   = DC_HSQC_F2JK2-p16-d16-p3-de+p1*2/PI-8u"
"cnst41  = 2*sfo2/sfo1"                ; gradient ratio
define list<gradient> GC_HSQC_F2JK={cnst41}
`;
let pulprog = `
  ; 13C-1H HSQC (F2-coupled)

  ; INEPT
  (p1 ph0):f1
  DC_HSQC_F2JK1
  (p14:sp3 ph0):f2
  (p2 ph0):f1
  DC_HSQC_F2JK2 pl2:f2
  (p1 ph1):f1
  (p3 ph18):f2
  DC_HSQC_F2JK3

  ; t1 period
#ifdef EDIT
  (p31:sp18 ph0):f2
#else
  (p14:sp3 ph0):f2
#endif /* EDIT */
  4u
  p16:gp4
  d16
  d3
  (p2 ph11):f1
  d3
  4u
  p16:gp4
  d16

  ; multiplicity editing
#ifdef EDIT
  DC_HSQC_F2JK4
  (p31:sp18 ph0):f2
  DC_HSQC_F2JK5
  (p2 ph1):f1
  d2 pl2:f2
#else
  (p14:sp3 ph0):f2
  DC_HSQC_F2JK3 pl2:f2
#endif /* EDIT */

  ; reverse INEPT
  (p3 ph7):f2
  (p1 ph0):f1
  DC_HSQC_F2JK1
  (p14:sp3 ph0):f2
  (p2 ph1):f1
  4u
  p16:gp4*EA_TS*GC_HSQC_F2JK
  d16 pl2:f2
  DC_HSQC_F2JK6
  (p3 ph0):f2
  4u
  goscnp ph24
  50u
`;
const mod = new NOAHModule("c13", "Sjk", [Kupce2017ACIE], "noah_hsqc noah_add", shortDescription, preamble, pulprog);
export default mod;
// vim: syntax=bruker:
