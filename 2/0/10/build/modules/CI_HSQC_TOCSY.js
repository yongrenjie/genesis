import { Kupce2017ACIE, Yong2021JMR } from "../citation.js";
import NOAHModule from "../noahModule.js";
let shortDescription = `; 13C HSQC-TOCSY with variable INEPT excitation
;     [specify fraction of 1J(CH) magnetisation to use with cnst32]
;     [use -DINVERT1 for inversion of TOCSY peaks]`;
let preamble = `
"p2      = p1*2"                       ; 1H hard 180
"d4      = 0.25s/cnst2"                ; 13C INEPT
"d0      = 3u"                         ; 13C t1
"in0     = inf1/2"                     ; 13C increment
define delay DCI_HSQC_TOCSY1
define delay DCI_HSQC_TOCSY2
define delay DCI_HSQC_TOCSY3
define delay DCI_HSQC_TOCSY4
define delay DCI_HSQC_TOCSY5
define delay DCI_HSQC_TOCSY6
define delay DCI_HSQC_TOCSY7
define delay DCI_HSQC_TOCSY8
"DCI_HSQC_TOCSY1   = (asin(cnst32)/(2*PI*cnst2))-p14/2000000"
"DCI_HSQC_TOCSY2   = (asin(cnst32)/(2*PI*cnst2))+p14/2000000"
"DCI_HSQC_TOCSY3   = p16+d16+p2/2+d0-p3*2/PI+4u"
"DCI_HSQC_TOCSY4   = d4-p14/2"
"DCI_HSQC_TOCSY5   = d4+p14/2-p16-d16"
"DCI_HSQC_TOCSY6   = d2-p14/2-p16-d16-4u"
"DCI_HSQC_TOCSY7   = d2+p14/2-p16-d16-de"
"DCI_HSQC_TOCSY8   = de+4u"
"cnst41  = 2*sfo2/sfo1"                ; gradient ratio
define list<gradient> GCI_HSQC_TOCSY={cnst41}
`;
let pulprog = `
  ; 13C-1H HSQC-TOCSY with variable INEPT excitation

  ; INEPT
  (p1 ph0):f1
  DCI_HSQC_TOCSY1
  (p14:sp3 ph0):f2
  (p2 ph0):f1
  DCI_HSQC_TOCSY2 pl2:f2
  (p1 ph1):f1
  (p3 ph5):f2
  DCI_HSQC_TOCSY3

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
  DCI_HSQC_TOCSY3 pl2:f2

  ; reverse INEPT
  (p3 ph7):f2
  (p1 ph2):f1
  DCI_HSQC_TOCSY4
  (p14:sp3 ph0):f2
  (p2 ph1):f1

  p16:gp13
  d16
  DCI_HSQC_TOCSY5 pl10:f1

  |DIPSI|

  4u
  p16:gp13*-1
  d16 pl1:f1

#ifdef INVERT1
  DCI_HSQC_TOCSY6
  (p14:sp3 ph0):f2
  (p2 ph1):f1
  p16:gp3*GCI_HSQC_TOCSY*EA
  d16 pl12:f2
  DCI_HSQC_TOCSY7
#else
  DCI_HSQC_TOCSY8
  (p2 ph1):f1
  4u
  p16:gp3*GCI_HSQC_TOCSY*EA
  d16 pl12:f2
  4u
#endif /* INVERT1 */
  goscnp ph30 cpd2:f2   ; acquire 13C HSQC-TOCSY
  50u do:f2
`;
const mod = new NOAHModule("c13", "St", [Kupce2017ACIE, Yong2021JMR], "noah_hsqc", shortDescription, preamble, pulprog);
export default mod;
// vim: syntax=bruker:
