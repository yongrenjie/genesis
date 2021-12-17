import { Kupce2017ACIE, Cicero2001JMR } from "../citation.js";
import { AF_LP3 } from "../acquFlag.js";
import NOAHModule from "../noahModule.js";

let shortDescription = `; 13C HMBC (asymmetric gradients 1, 3 grads, 180 before third grad)`;

let preamble = `
"p2     = p1*2"                       ; 1H hard 180
"d2     = 0.5s/cnst2"                 ; JCOMP
"d4     = 0.25s/cnst2"                ; 13C INEPT
"d0     = 3u"                         ; 13C t1
"in0    = inf1/2"                     ; 13C increment
"D[ID]a = d4-p14/2"
"D[ID]b = d4+p14/2"
"D[ID]c = (0.5s/cnst13)-p16-d16-4u"
"D[ID]d = p2+d0*2"
"cnst52 = 0.5" ; HMBC gradient alpha
"cnst53 = -cnst52*(sfo1-sfo2)/(sfo1+sfo2)"
"cnst54 = (1-cnst52)*(sfo1-sfo2)/sfo1"
define list<gradient> EA1 = { 1.000 cnst53 }
define list<gradient> EA2 = { cnst53 1.000 }
`

let pulprog = `
  ; 13C-1H HMBC

  ; zz-filter
  (p1 ph0):f1
  D[ID]a
  (p14:sp3 ph0):f2
  (p2 ph0):f1
  D[ID]b
  (p1 ph0):f1
  D[ID]a
  (p14:sp3 ph0):f2
  (p2 ph0):f1
  D[ID]b pl2:f2

  ; excitation and low-pass J-filter
  (lalign (p1 ph0):f1 (p3 ph7):f2 )
  |LPJF|

  ; nJ(CH) evolution
  D[ID]c
  ; coherence transfer to 13C and t1
  (p3 ph7):f2
  d0
  (p2 ph11):f1
  d0
  p16:gp1*EA1
  d16
  (p24:sp7 ph0):f2
  D[ID]d
  p16:gp1*EA2
  d16 pl2:f2
  (p3 ph0):f2
  (p2 ph0):f1
  p16:gp1*cnst54
  d16
  4u
  goscnp ph31
`

const mod = new NOAHModule(
    "hmbc",
    "Bga",
    [Kupce2017ACIE, Cicero2001JMR],
    "noah_hmbc",
    shortDescription,
    [AF_LP3],
    preamble,
    pulprog,
    1,
    false
);
export default mod;

// vim: syntax=bruker:
