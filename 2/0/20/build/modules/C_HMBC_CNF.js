import { Kupce2017ACIE, Kupce2019JMR } from "../citation.js";
import { AF_LP3 } from "../acquFlag.js";
import NOAHModule from "../noahModule.js";
let shortDescription = `; 13C HMBC`;
let preamble = `
"p2     = p1*2"                       ; 1H hard 180
"p22    = p21*2"                      ; 15N hard 180
"d2     = 0.5s/cnst2"                 ; JCOMP
"d4     = 0.25s/cnst2"                ; 13C INEPT
"d0     = 3u"                         ; 13C t1
"in0    = inf1/2"                     ; 13C increment
"D[ID]a = d4-p31/2"
"D[ID]b = d4+p31/2"
"D[ID]c = (0.5s/cnst13)-p16-d16-4u"
"D[ID]d = p16+d16+p2/2+d0-p3*2/PI+4u"
"cnst41 = 2*sfo2/sfo1"                ; gradient ratio
define list<gradient> G[ID]={cnst41}
`;
let pulprog = `
  ; 13C-1H HMBC
  
  ; 15N and 13C zz-filter
  (p1 ph0):f1
  D[ID]a
  (p31:sp18 ph11):f2 
  (center (p2 ph0):f1 (p22 ph0):f3)
  D[ID]b
  (p1 ph0):f1
  D[ID]a
  (p31:sp18 ph11):f2 
  (center (p2 ph0):f1 (p22 ph0):f3)
  D[ID]b pl2:f2

  ; excitation and low-pass J-filter
  (lalign (p1 ph0):f1 (p3 ph7):f2 )
  |LPJF|

  ; nJ(CH) evolution
  D[ID]c
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
const mod = new NOAHModule("hmbc", "B", [Kupce2017ACIE, Kupce2019JMR], "noah_hmbc", shortDescription, [AF_LP3], preamble, pulprog, 1, false);
export default mod;
// vim: syntax=bruker:
