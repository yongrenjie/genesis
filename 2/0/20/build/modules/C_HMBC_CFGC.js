import { Kupce2017ACIE, Cicero2001JMR } from "../citation.js";
import { AF_LP3 } from "../acquFlag.js";
import NOAHModule from "../noahModule.js";
let shortDescription = `; 13C HMBC (asymmetric gradients 3, 2 grads, zz-filter phases changed)`;
let preamble = `
"p2     = p1*2"                       ; 1H hard 180
"d2     = 0.5s/cnst2"                 ; JCOMP
"d4     = 0.25s/cnst2"                ; 13C INEPT
"d0     = 3u"                         ; 13C t1
"in0    = inf1/2"                     ; 13C increment
define delay DC_ZZFa
define delay DC_ZZFb
"DC_ZZFa = d4-p14/2"
"DC_ZZFb = d4+p14/2"
"D[ID]a = (0.5s/cnst13)-p16-d16-4u"
"D[ID]b = p2+d0*2"
"cnst47 = (1-sfo2/sfo1)/(1+sfo2/sfo1)"
define list<gradient> EA1 = { 1.000 -cnst47 }
define list<gradient> EA2 = { -cnst47 1.000 }
`;
// DO NOT USE |ZZF| here
let pulprog = `
  ; 13C-1H HMBC

  ; zz-filter
#ifdef NOZZF
  ; enable -DNOZZF acquisition flag to remove zz-filter
  ; only do this if you are sure about what you are doing!
  (p1 ph0):f1
#else
  ; zz-filter
  (p1 ph0):f1
  DC_ZZFa
  (p14:sp3 ph0):f2
  (p2 ph0):f1
  DC_ZZFb
  (p1 ph0):f1
  DC_ZZFa
  (p14:sp3 ph0):f2
  (p2 ph0):f1
  DC_ZZFb pl2:f2
  (lalign (p1 ph2):f1 (p3 ph7):f2 )
#endif

  ; low-pass J-filter
  |LPJF|

  ; nJ(CH) evolution
  D[ID]a
  ; coherence transfer to 13C and t1
  (p3 ph5):f2
  d0
  (p2 ph11):f1
  d0
  p16:gp1*EA1
  d16
  (p24:sp7 ph0):f2
  D[ID]b
  p16:gp1*EA2
  d16 pl2:f2
  (p3 ph0):f2
  4u
  goscnp ph31
`;
const mod = new NOAHModule("hmbc", "Bgc", [Kupce2017ACIE, Cicero2001JMR], "noah_hmbc", shortDescription, [AF_LP3], preamble, pulprog, 1, false);
export default mod;
// vim: syntax=bruker:
