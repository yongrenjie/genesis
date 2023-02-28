import { AF_EDIT } from "../acquFlag.js";
import NOAHModule from "../noahModule.js";
let shortDescription = `; 13C HSQC (double NS, half TD1)`;
let preamble = `
"p2      = p1*2"                       ; 1H hard 180
"d2      = 0.5s/cnst2"                 ; JCOMP
"d4      = 0.25s/cnst2"                ; 13C INEPT
"d3      = 3u"                         ; 13C HSQC t1
"in3     = inf1/2"                     ; 13C HSQC increment
"D[ID]a   = d4-p14/2"
"D[ID]b   = d4+p14/2"
"D[ID]c   = p16+d16+p2/2+d3-p3*2/PI+4u"
"D[ID]d   = d2+p3+p2/2"
"D[ID]e   = D[ID]c+p3-p2/2"
"D[ID]f   = D[ID]b-p16-d16-p3-de+p1*2/PI-8u"
"cnst41  = 2*sfo2/sfo1"                ; gradient ratio
define list<gradient> G[ID]={cnst41}
`;
let pulprog = `
  ; 13C-1H HSQC

  ; INEPT
  (p1 ph0):f1
  D[ID]a
  (p14:sp3 ph0):f2
  (p2 ph0):f1
  D[ID]b pl2:f2
  (p1 ph1):f1
  (p3 ph18):f2
  D[ID]c

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
  D[ID]d
  (p31:sp18 ph0):f2
  D[ID]e
  (p2 ph1):f1
  d2 pl2:f2
#else
  (p14:sp3 ph0):f2
  D[ID]c pl2:f2
#endif /* EDIT */

  ; reverse INEPT
  (p3 ph7):f2
  (p1 ph0):f1
  D[ID]a
  (p14:sp3 ph0):f2
  (p2 ph1):f1
  4u
  p16:gp4*EA_TS*G[ID]
  d16 pl2:f2
  D[ID]f
  (p3 ph0):f2
  4u pl12:f2
  goscnp ph24 cpd2:f2
  50u do:f2
`;
const mod = new NOAHModule("C_HSQC_K", "c13", "Sk", [], "noah_hsqc noah_add", shortDescription, [AF_EDIT], preamble, pulprog, 1, false);
export default mod;
// vim: syntax=bruker:
