import { Kupce2017ACIE } from "../citation.js";
import NOAHModule from "../noahModule.js";
let shortDescription = `; 13C HSQC-COSY with variable INEPT excitation
;     [specify fraction of 1J(CH) magnetisation to use with cnst32]
;     [use -DEDIT1 for multiplicity editing (not recommended)]`;
let preamble = `
"p2      = p1*2"                       ; 1H hard 180
"d2      = 0.5s/cnst2"                 ; JCOMP
"d4      = 0.25s/cnst2"                ; 13C INEPT
"d12     = 0.25s/cnst12"               ; COSY mixing (< 1/4J(HH))
"d0      = 3u"                         ; 13C HSQC t1
"in0     = inf1/2"                     ; 13C HSQC increment
define delay DCI_HSQC_COSY1
define delay DCI_HSQC_COSY2
define delay DCI_HSQC_COSY3
define delay DCI_HSQC_COSY4
define delay DCI_HSQC_COSY5
define delay DCI_HSQC_COSY6
define delay DCI_HSQC_COSY7
define delay DCI_HSQC_COSY8
define delay DCI_HSQC_COSY9
define delay DCI_HSQC_COSY10
define delay DCI_HSQC_COSY11
define delay DCI_HSQC_COSY12
"DCI_HSQC_COSY1   = (asin(cnst32)/(2*PI*cnst2))-p14/2000000"
"DCI_HSQC_COSY2   = (asin(cnst32)/(2*PI*cnst2))+p14/2000000"
"DCI_HSQC_COSY3   = ((PI-asin(cnst32))/(2*PI*cnst2))-p14/2000000"
"DCI_HSQC_COSY4   = ((PI-asin(cnst32))/(2*PI*cnst2))+p14/2000000"
"DCI_HSQC_COSY5   = p16+d16+p2/2+d0-p3*2/PI+4u"
"DCI_HSQC_COSY6   = d2+p3+p2/2"
"DCI_HSQC_COSY7   = DCI_HSQC_COSY5+p3-p2/2"
"DCI_HSQC_COSY8   = d4-p14/2"
"DCI_HSQC_COSY9   = d4+p14/2"
"DCI_HSQC_COSY10  = d12-d2-p14/2"
"DCI_HSQC_COSY11  = d2-p14/2"
"DCI_HSQC_COSY12  = d2+p14/2-p16-d16-de"
"cnst41  = 2*sfo2/sfo1"                ; gradient ratio
define list<gradient> GCI_HSQC_COSY={cnst41}
`;
let pulprog = `
  ; 13C-1H HSQC-COSY

  ; INEPT with variable excitation
  (p1 ph0):f1
#ifdef EDIT1
if "l3 % 2 == 1"
{
  DCI_HSQC_COSY3
  (p14:sp3 ph0):f2
  (p2 ph0):f1
  DCI_HSQC_COSY4 pl2:f2
}
else
{
  DCI_HSQC_COSY1
  (p14:sp3 ph0):f2
  (p2 ph0):f1
  DCI_HSQC_COSY2 pl2:f2
}
#else
if "l3 % 2 == 1"
{
  DCI_HSQC_COSY1
  (p14:sp3 ph0):f2
  (p2 ph0):f1
  DCI_HSQC_COSY2 pl2:f2
}
else
{
  DCI_HSQC_COSY3
  (p14:sp3 ph0):f2
  (p2 ph0):f1
  DCI_HSQC_COSY4 pl2:f2
}
#endif /* EDIT1 */

  (p1 ph1):f1
  (p3 ph5):f2
  DCI_HSQC_COSY5

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

  ; multiplicity editing. As it stands this would break the 1JCH magnetisation.
#ifdef EDIT1
  DCI_HSQC_COSY6
  (p31:sp18 ph0):f2
  DCI_HSQC_COSY7
  (p2 ph1):f1
  d2 pl2:f2
#else
  (p14:sp3 ph0):f2
  DCI_HSQC_COSY5 pl2:f2
#endif /* EDIT1 */

  ; reverse INEPT
  (p3 ph7):f2
  (p1 ph0):f1
  DCI_HSQC_COSY8
  (p14:sp3 ph0):f2
  (p2 ph0):f1
  DCI_HSQC_COSY9 pl2:f2

  ; coherence transfer
  (p1 ph0):f1
if "l3 % 2 == 1"   ; relayed COSY peak suppression
{
  d12
}
else
{
  DCI_HSQC_COSY10  ; d12-d2-p14/2
  (p14:sp3 ph0):f2
  DCI_HSQC_COSY11  ; d2-p14/2
}
  (p2 ph0):f1
  d12
  (p1 ph2):f1

  ; spin echo for HSQC vs COSY peak editing
  DCI_HSQC_COSY11  ; d2-p14/2
  (p14:sp3 ph0):f2
  (p2 ph0):f1
  DCI_HSQC_COSY12  ; d2+p14/2-p16-d16-de
  p16:gp3*GCI_HSQC_COSY*EA
  d16 pl12:f2
  goscnp ph25 cpd2:f2
  50u do:f2
`;
const mod = new NOAHModule("c13", "Q", [Kupce2017ACIE], "noah_hsqc", shortDescription, preamble, pulprog);
export default mod;
// vim: syntax=bruker:
