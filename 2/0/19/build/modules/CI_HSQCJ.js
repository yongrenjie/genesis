import { Kupce2017ACIE, Yong2021JMR, Enthart2008JMR } from "../citation.js";
import { AF_EDIT1 } from "../acquFlag.js";
import NOAHModule from "../noahModule.js";
let shortDescription = `; 13C HSQC (F2-coupled) with variable INEPT excitation
;     [specify fraction of 1J(CH) magnetisation to use with cnst32]`;
let preamble = `
"p2     = p1*2"                       ; 1H hard 180
"d2     = 0.5s/cnst2"                 ; JCOMP
"d4     = 0.25s/cnst2"                ; 13C INEPT
"d0     = 3u"                         ; 13C HSQC t1
"in0    = inf1/2"                     ; 13C HSQC increment
define delay D[ID]a
define delay D[ID]b
define delay D[ID]c
define delay D[ID]d
define delay D[ID]e
define delay D[ID]f
define delay D[ID]g
"D[ID]a = (asin(cnst32)/(2*PI*cnst2))-p14/2000000"
"D[ID]b = (asin(cnst32)/(2*PI*cnst2))+p14/2000000"
"D[ID]c = p16+d16+p2/2+d0-p3*2/PI+4u"
"D[ID]d = d2+p3+p2/2"
"D[ID]e = D[ID]c+p3-p2/2"
"D[ID]f = d4-p14/2"
"D[ID]g = d4+p14/2-p16-d16-p3-de+p1*2/PI-8u"
"cnst41 = 2*sfo2/sfo1"                ; gradient ratio
define list<gradient> G[ID]={cnst41}
`;
let pulprog = `
  ; 13C-1H HSQC (F2-coupled) with variable INEPT excitation

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
  (p1 ph0):f1
  D[ID]f
  (p14:sp3 ph0):f2
  (p2 ph1):f1
  4u
  p16:gp3*G[ID]*EA
  d16 pl2:f2
  D[ID]g
  (p3 ph0):f2
  4u
  goscnp ph30
  50u
`;
const mod = new NOAHModule("c13", "Sj", [Kupce2017ACIE, Yong2021JMR, Enthart2008JMR], "noah_hsqc", shortDescription, [AF_EDIT1], preamble, pulprog, 1, false);
export default mod;
// vim: syntax=bruker:
