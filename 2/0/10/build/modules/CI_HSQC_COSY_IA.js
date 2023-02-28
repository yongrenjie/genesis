import { Kupce2017ACIE } from "../citation.js";
import NOAHModule from "../noahModule.js";
let shortDescription = `; 13C interleaved HSQC-COSY / HSQC with variable INEPT excitation
;     [specify fraction of 1J(CH) magnetisation to use with cnst32]`;
let preamble = `
"p2      = p1*2"                       ; 1H hard 180
"d2      = 0.5s/cnst2"                 ; JCOMP
"d4      = 0.25s/cnst2"                ; 13C INEPT
"d12     = 0.25s/cnst12"               ; COSY mixing (< 1/4J(HH))
"d3      = 3u"                         ; 13C interleaved t1
"in3     = inf1/2"                     ; 13C interleaved increment
define delay DCI_HSQCC_IA1
define delay DCI_HSQCC_IA2
define delay DCI_HSQCC_IA3
define delay DCI_HSQCC_IA4
define delay DCI_HSQCC_IA5
define delay DCI_HSQCC_IA6
define delay DCI_HSQCC_IA7
define delay DCI_HSQCC_IA8
define delay DCI_HSQCC_IA9
define delay DCI_HSQCC_IA10
define delay DCI_HSQCC_A11
define delay DCI_HSQCC_I11
define delay DCI_HSQCC_IA12
"DCI_HSQCC_IA1   = (asin(cnst32)/(2*PI*cnst2))-p14/2000000"
"DCI_HSQCC_IA2   = (asin(cnst32)/(2*PI*cnst2))+p14/2000000"
"DCI_HSQCC_IA3   = ((PI-asin(cnst32))/(2*PI*cnst2))-p14/2000000"
"DCI_HSQCC_IA4   = ((PI-asin(cnst32))/(2*PI*cnst2))+p14/2000000"
"DCI_HSQCC_IA5   = p16+d16+p2/2+d3-p3*2/PI+4u"
"DCI_HSQCC_IA6   = d2+p3+p2/2"
"DCI_HSQCC_IA7   = DCI_HSQCC_IA5+p3-p2/2"
"DCI_HSQCC_IA8   = d4-p14/2"
"DCI_HSQCC_IA9   = d4+p14/2"
"DCI_HSQCC_IA10  = d12-d2-p14/2"
"DCI_HSQCC_A11   = d2-p14/2"
"DCI_HSQCC_I11   = d2+p14/2"
"DCI_HSQCC_IA12  = d2+p14/2-p16-d16-de"
"cnst41  = 2*sfo2/sfo1"                ; gradient ratio
define list<gradient> GCI_HSQCC_IA={cnst41}
`;
let pulprog = `
  ; 13C-1H HSQC-COSY

  ; INEPT with variable excitation
  (p1 ph0):f1
if "l2 % 2 == 1"
{
  DCI_HSQCC_IA1
  (p14:sp3 ph0):f2
  (p2 ph0):f1
  DCI_HSQCC_IA2 pl2:f2
}
else
{
  DCI_HSQCC_IA3
  (p14:sp3 ph0):f2
  (p2 ph0):f1
  DCI_HSQCC_IA4 pl2:f2
}

  (p1 ph1):f1
  (p3 ph18):f2
  DCI_HSQCC_IA5

  ; t1 period
  (p14:sp3 ph0):f2
  4u
  p16:gp3
  d16
  d3
  (p2 ph11):f1
  d3
  4u
  p16:gp3
  d16
  (p14:sp3 ph0):f2
  DCI_HSQCC_IA5 pl2:f2

  ; reverse INEPT
  (p3 ph7):f2
  (p1 ph0):f1
  DCI_HSQCC_IA8
  (p14:sp3 ph0):f2
  (p2 ph0):f1
  DCI_HSQCC_IA9 pl2:f2

  ; coherence transfer
  (p1 ph0):f1
if "l2 % 2 == 1"   ; relayed COSY peak suppression
{
  d12
}
else
{
  DCI_HSQCC_IA10  ; d12-d2-p14/2
  (p14:sp3 ph0):f2
  DCI_HSQCC_A11  ; d2-p14/2
}
  (p2 ph0):f1
  d12
  (p1 ph2):f1

  ; spin echo for HSQC vs COSY peak editing
if "l1 % 2 == 0"
{
  DCI_HSQCC_I11  ; d2+p14/2
  (p2 ph0):f1
}
else
{
  DCI_HSQCC_A11  ; d2-p14/2
  (p14:sp3 ph0):f2
  (p2 ph0):f1
}
  DCI_HSQCC_IA12  ; d2+p14/2-p16-d16-de
  p16:gp3*GCI_HSQCC_IA*EA_TS
  d16 pl12:f2
  goscnp ph23 cpd2:f2
  50u do:f2
`;
const mod = new NOAHModule("c13", "Qia", [Kupce2017ACIE], "noah_hsqc noah_TS", shortDescription, preamble, pulprog);
export default mod;
// vim: syntax=bruker:
