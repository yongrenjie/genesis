import { Kupce2017ACIE } from "../citation.js";
import NOAHModule from "../noahModule.js";
let shortDescription = `; 13C HMQC`;
let preamble = `
"p2      = p1*2"                       ; 1H hard 180
"d2      = 0.5s/cnst2"                 ; JCOMP
"d4      = 0.25s/cnst2"                ; 13C INEPT
"d0      = 3u"                         ; 13C HSQC t1
"in0     = inf1/2"                     ; 13C HSQC increment
define delay D[ID]a
define delay D[ID]b
define delay D[ID]c
define delay D[ID]d
"D[ID]a  = d4-p14/2"
"D[ID]b  = d4+p14/2"
"D[ID]c  = p16+d16+p2/2+d0+4u-p3*2/PI"
"D[ID]d  = D[ID]b-p16-d16-de+p1*2/PI-8u"
"cnst41  = 2*sfo2/sfo1"                ; gradient ratio
define list<gradient> G[ID]={cnst41}
`;
let pulprog = `
  ; 13C-1H HMQC

  (p1 ph2):f1
  D[ID]a
  (p14:sp3 ph0):f2
  (p2 ph0):f1
  D[ID]b pl2:f2
  (p1 ph2):f1
  (p3 ph5):f2

  D[ID]c
  (p14:sp3 ph0):f2
  4u pl2:f2
  p16:gp4
  d16

  d0
  (p2 ph11):f1
  d0

  4u
  p16:gp4
  d16
  (p14:sp3 ph0):f2
  D[ID]c pl2:f2

  (p3 ph7):f2
  D[ID]a
  (p14:sp3 ph0):f2
  (p2 ph1):f1
  4u pl2:f2
  p16:gp4*EA*G[ID]
  d16 pl12:f2
  D[ID]d
  goscnp ph30 cpd2:f2
  50u do:f2
`;
const mod = new NOAHModule("c13", "M", [Kupce2017ACIE], "noah_hsqc", shortDescription, preamble, pulprog, 1, false);
export default mod;
// vim: syntax=bruker:
