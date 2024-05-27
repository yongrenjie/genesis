import { Yong2021JMR } from "../citation.js";
import { AF_INVERT1 } from "../acquFlag.js";
import NOAHModule from "../noahModule.js";
let shortDescription = `; 13C HSQC-TOCSY with variable INEPT excitation
;     [specify fraction of 1J(CH) magnetisation to use with cnst32]`;
let preamble = `
"p2     = p1*2"                       ; 1H hard 180
"d4     = 0.25s/cnst2"                ; 13C INEPT
"d0     = 3u"                         ; 13C t1
"in0    = inf1/2"                     ; 13C increment
"D[ID]a = (asin(cnst32)/(2*PI*cnst2))-p14/2000000"
"D[ID]b = (asin(cnst32)/(2*PI*cnst2))+p14/2000000"
"D[ID]c = p16+d16+p2/2+d0-p3*2/PI+4u"
"D[ID]d = d4-p14/2"
"D[ID]e = d4+p14/2-p16-d16"
"D[ID]f = d2-p14/2-p16-d16-4u"
"D[ID]g = d2+p14/2-p16-d16-de"
"D[ID]h = de+4u"
"cnst41 = 2*sfo2/sfo1"                ; gradient ratio
define list<gradient> G[ID]={cnst41}
`;
let pulprog = `
  ; 13C-1H HSQC-TOCSY with variable INEPT excitation

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
  (p14:sp3 ph0):f2
  4u
  p16:gp3
  d16
  d0
  (p2 ph11):f1
  d0
  4u
  p16:gp3
  d16
  (p14:sp3 ph0):f2
  D[ID]c pl2:f2

  ; reverse INEPT
  (p3 ph7):f2
  (p1 ph2):f1
  D[ID]d
  (p14:sp3 ph0):f2
  (p2 ph1):f1

  p16:gp13
  d16
  D[ID]e pl10:f1

  |DIPSI|

  4u
  p16:gp13*-1
  d16 pl1:f1

#ifdef INVERT1
  D[ID]f
  (p14:sp3 ph0):f2
  (p2 ph1):f1
  p16:gp3*G[ID]*EA
  d16 pl12:f2
  D[ID]g
#else
  D[ID]h
  (p2 ph1):f1
  4u
  p16:gp3*G[ID]*EA
  d16 pl12:f2
  4u
#endif /* INVERT1 */
  goscnp ph30 cpd2:f2   ; acquire 13C HSQC-TOCSY
  50u do:f2
`;
const mod = new NOAHModule("CI_HSQCT", "c13", "St", [Yong2021JMR], "noah_hsqc", "13C HSQC-TOCSY", shortDescription, [AF_INVERT1], preamble, pulprog, 1, false);
export default mod;
// vim: syntax=bruker:
