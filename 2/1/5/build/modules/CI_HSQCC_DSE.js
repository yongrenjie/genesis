import { AF_EDIT1 } from "../acquFlag.js";
import NOAHModule from "../noahModule.js";
let shortDescription = `; 13C HSQC-COSY (2 spin echoes)
;     [DOES NOT PRESERVE UNUSED 1JCH MAGNETISATION - ONLY FOR INTERNAL USE]`;
let preamble = `
"p2     = p1*2"                       ; 1H hard 180
"d2     = 0.5s/cnst2"                 ; JCOMP
"d4     = 0.25s/cnst2"                ; 13C INEPT
"d12    = 0.25s/cnst12"               ; COSY mixing (< 1/4J(HH))
"d0     = 3u"                         ; 13C HSQC t1
"in0    = inf1/2"                     ; 13C HSQC increment
"D[ID]a = (asin(cnst32)/(2*PI*cnst2))-p14/2000000"
"D[ID]b = (asin(cnst32)/(2*PI*cnst2))+p14/2000000"
"D[ID]c = p16+d16+p2/2+d0-p3*2/PI+4u"
"D[ID]d = d2+p3+p2/2"
"D[ID]e = D[ID]c+p3-p2/2"
"D[ID]f = d4-p14/2"
"D[ID]g = d12-d4-p14/2"
"D[ID]h = d2-p31/2"
"D[ID]i = d2+p31/2-p16-d16-p3-4u-de"
"cnst41 = 2*sfo2/sfo1"                ; gradient ratio
define list<gradient> G[ID]={cnst41}
`;
let pulprog = `
  ; 13C-1H HSQC-COSY

  ; INEPT
  (p1 ph0):f1
  D[ID]a
  (p14:sp3 ph0):f2
  (p2 ph0):f1
  D[ID]b pl2:f2
  (p1 ph1):f1
  (p3 ph5):f2
  D[ID]c

  ; t1 period
#ifdef EDIT1
  (p31:sp18 ph0):f2
#else
  (p14:sp3 ph0):f2
#endif /* EDIT1 */
  4u
  p16:gp3
  d16
  d0
  (p2 ph11):f1
  d0
  4u
  p16:gp3
  d16

  ; multiplicity editing
#ifdef EDIT1
  D[ID]d
  (p31:sp18 ph0):f2
  D[ID]e
  (p2 ph1):f1
  d2 pl2:f2
#else
  (p14:sp3 ph0):f2
  D[ID]c pl2:f2
#endif /* EDIT1 */

  ; reverse INEPT
  (p3 ph7):f2
  (p1 ph1):f1
  D[ID]f  ; d4-p14/2
  (p14:sp3 ph0):f2
  D[ID]g  ; d12-d4-p14/2
  (p2 ph1):f1
  d12
  (p1 ph1):f1
  D[ID]h ; d2-p31/2
  (p31:sp18 ph0):f2
  (p2 ph1):f1
  D[ID]i pl2:f2 ; d2+p31/2-(...)
  p16:gp3*G[ID]*EA
  d16
  (p3 ph0):f2
  4u pl12:f2
  goscnp ph30 cpd2:f2   ; acquire 13C HSQC-COSY
  50u do:f2
`;
const mod = new NOAHModule("CI_HSQCC_DSE", "c13", "Sc", [], "noah_hsqc", shortDescription, [AF_EDIT1], preamble, pulprog, 1, false);
export default mod;
// vim: syntax=bruker:
