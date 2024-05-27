import { Kupce2017ACIE } from "../citation.js";
import NOAHModule from "../noahModule.js";
let shortDescription = `; 13C interleaved HSQC-COSY / HSQC`;
let preamble = `
"p2      = p1*2"                       ; 1H hard 180
"d2      = 0.5s/cnst2"                 ; JCOMP
"d4      = 0.25s/cnst2"                ; 13C INEPT
"d12     = 0.25s/cnst12"               ; COSY mixing (< 1/4J(HH))
"d3      = 3u"                         ; 13C interleaved t1
"in3     = inf1/2"                     ; 13C interleaved increment
define delay DC_HSQCC_IA1
define delay DC_HSQCC_IA2
define delay DC_HSQCC_IA3
define delay DC_HSQCC_IA4
define delay DC_HSQCC_IA5
define delay DC_HSQCC_IA6
define delay DC_HSQCC_IA7
define delay DC_HSQCC_IA8
define delay DC_HSQCC_I9
define delay DC_HSQCC_A9
define delay DC_HSQCC_IA10
"DC_HSQCC_IA1   = d4-p14/2"
"DC_HSQCC_IA2   = d4+p14/2"
"DC_HSQCC_IA3   = p16+d16+p2/2+d3-p3*2/PI+4u"
"DC_HSQCC_IA4   = d2+p3+p2/2"
"DC_HSQCC_IA5   = DC_HSQCC_IA3+p3-p2/2"
"DC_HSQCC_IA6   = d4-p14/2"
"DC_HSQCC_IA7   = d4+p14/2"
"DC_HSQCC_IA8   = d12-d2-p14/2"
"DC_HSQCC_I9    = d2+p14/2"
"DC_HSQCC_A9    = d2-p14/2"
"DC_HSQCC_IA10  = d2+p14/2-p16-d16-de"
"cnst41  = 2*sfo2/sfo1"                ; gradient ratio
define list<gradient> GC_HSQC_COSY={cnst41}
`;
let pulprog = `
  ; 13C-1H HSQC

  ; INEPT
  (p1 ph0):f1
  DC_HSQCC_IA1
  (p14:sp3 ph0):f2
  (p2 ph0):f1
  DC_HSQCC_IA2 pl2:f2
  (p1 ph1):f1
  (p3 ph18):f2
  DC_HSQCC_IA3

  ; t1 period
  (p14:sp3 ph0):f2
  4u
  p16:gp4
  d16
  d3
  (p2 ph11):f1
  d3
  4u
  p16:gp4
  d16
  (p14:sp3 ph0):f2
  DC_HSQCC_IA3 pl2:f2

  ; reverse INEPT
  (p3 ph7):f2
  (p1 ph0):f1
  DC_HSQCC_IA6
  (p14:sp3 ph0):f2
  (p2 ph0):f1
  DC_HSQCC_IA7 pl2:f2

  ; coherence transfer
  (p1 ph0):f1
if "l2 % 2 == 1"   ; relayed COSY peak suppression
{
  d12
}
else
{
  DC_HSQCC_IA8  ; d12-d2-p14/2
  (p14:sp3 ph0):f2
  DC_HSQCC_A9  ; d2-p14/2
}
  (p2 ph0):f1
  d12
  (p1 ph2):f1

if "l1 % 2 == 0"
{
  DC_HSQCC_I9  ; d2+p14/2
  (p2 ph0):f1
}
else
{
  DC_HSQCC_A9  ; d2-p14/2
  (p14:sp3 ph0):f2
  (p2 ph0):f1
}
  DC_HSQCC_IA10  ; d2+p14/2-p16-d16-de
  p16:gp4*GC_HSQC_COSY*EA_TS
  d16 pl12:f2
  goscnp ph25 cpd2:f2
  50u do:f2
`;
const mod = new NOAHModule("c13", "Qia", [Kupce2017ACIE], "noah_hsqc noah_TS", shortDescription, preamble, pulprog);
export default mod;
// vim: syntax=bruker:
