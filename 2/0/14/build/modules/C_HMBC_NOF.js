import { Kupce2017ACIE } from "../citation.js";
import NOAHModule from "../noahModule.js";
let shortDescription = `; 13C HMBC`;
let preamble = `
"p2      = p1*2"                       ; 1H hard 180
"d2      = 0.5s/cnst2"                 ; JCOMP
"d0      = 3u"                         ; 13C t1
"in0     = inf1/2"                     ; 13C increment
define delay D[ID]a
define delay D[ID]b
define delay D[ID]c
define delay D[ID]d
"D[ID]a = 1s/(2*cnst6)-p16-d16"
"D[ID]b = 1s/(2*cnst7)-p16-d16"
"D[ID]c = (0.5s/cnst13)-p16-d16-4u"
"D[ID]d = p16+d16+p2/2+d0-p3*2/PI+4u"
"cnst41 = 2*sfo2/sfo1"                ; gradient ratio
define list<gradient> G[ID]={cnst41}
`;
let pulprog = `
  ; 13C-1H HMBC

  ; second-order low-pass J-filter
  (p1 ph0):f1
  D[ID]a
  p16:gp10*-3
  d16
  (p3 ph7):f2
  D[ID]b
  p16:gp10*2
  d16
  (p3 ph7):f2
  4u
  p16:gp10
  d16
  D[ID]c  ; nJ(CH) evolution

  ; coherence transfer to 13C and t1
  (p3 ph7):f2
  D[ID]d
  (p14:sp3 ph0):f2
  4u
  p16:gp1
  d16
  d0
  (p2 ph11):f1
  d0
  4u
  p16:gp1
  d16
  (p14:sp3 ph0):f2
  D[ID]d pl2:f2
  (p3 ph5):f2
  (p2 ph0):f1
  4u
  p16:gp1*EA*G[ID]
  d16
  4u
  goscnp ph30
`;
const mod = new NOAHModule("hmbc", "B", [Kupce2017ACIE], "noah_hmbc", shortDescription, preamble, pulprog, 1, false);
export default mod;
// vim: syntax=bruker:
