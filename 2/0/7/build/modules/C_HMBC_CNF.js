import { Kupce2017ACIE, Kupce2019JMR } from "../citation.js";
import NOAHModule from "../noahModule.js";
let shortDescription = `; 13C HMBC`;
let preamble = `
"p2      = p1*2"                       ; 1H hard 180
"p22     = p21*2"                      ; 15N hard 180
"d2      = 0.5s/cnst2"                 ; JCOMP
"d4      = 0.25s/cnst2"                ; 13C INEPT
"d7      = 0.5s/cnst13"                ; 13C LR coupling evolution
"d0      = 3u"                         ; 13C t1
"in0     = inf1/2"                     ; 13C increment
define delay DC_HMBC_CNF1
define delay DC_HMBC_CNF2
define delay DC_HMBC_CNF3
define delay DC_HMBC_CNF4
define delay DC_HMBC_CNF5
define delay DC_HMBC_CNF6
"DC_HMBC_CNF1   = d4-p31/2"
"DC_HMBC_CNF2   = d4+p31/2"
"DC_HMBC_CNF3   = 1s/(2*cnst6)-p16-d16"
"DC_HMBC_CNF4   = 1s/(2*cnst7)-p16-d16"
"DC_HMBC_CNF5   = d7-p16-d16-4u"
"DC_HMBC_CNF6   = p16+d16+p2/2+d0-p3*2/PI+4u"
"cnst41  = 2*sfo2/sfo1"                ; gradient ratio
define list<gradient> GC_HMBC_CNF={cnst41}
`;
let pulprog = `
  ; 13C-1H HMBC
  
  ; 15N and 13C zz-filter
  (p1 ph0):f1
  DC_HMBC_CNF1
  (p31:sp18 ph11):f2 
  (center (p2 ph0):f1 (p22 ph0):f3)
  DC_HMBC_CNF2
  (p1 ph0):f1
  DC_HMBC_CNF1
  (p31:sp18 ph11):f2 
  (center (p2 ph0):f1 (p22 ph0):f3)
  DC_HMBC_CNF2 pl2:f2

  ; second-order low-pass J-filter
  (p1 ph0):f1
  DC_HMBC_CNF3
  p16:gp10*-3
  d16
  (p3 ph7):f2
  DC_HMBC_CNF4
  p16:gp10*2
  d16
  (p3 ph7):f2
  4u
  p16:gp10
  d16
  DC_HMBC_CNF5  ; nJ(CH) evolution

  ; coherence transfer to 13C and t1
  (p3 ph7):f2
  DC_HMBC_CNF6
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
  DC_HMBC_CNF6 pl2:f2
  (p3 ph5):f2
  (p2 ph0):f1
  4u
  p16:gp1*EA*GC_HMBC_CNF
  d16
  4u
  goscnp ph30
`;
const mod = new NOAHModule("hmbc", "B", [Kupce2017ACIE, Kupce2019JMR], "noah_hmbc", shortDescription, preamble, pulprog);
export default mod;
// vim: syntax=bruker:
