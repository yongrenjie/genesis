import { Kupce2017ACIE } from "../citation.js";
import NOAHModule from "../noahModule.js";
let shortDescription = `; 13C TS HSQC-COSY (TSE version) / HSQC`;
let preamble = `
"p2      = p1*2"                       ; 1H hard 180
"d2      = 0.5s/cnst2"                 ; JCOMP
"d4      = 0.25s/cnst2"                ; 13C INEPT
"d12     = 0.25s/cnst12"               ; COSY mixing (< 1/4J(HH))
"d3      = 3u"                         ; 13C interleaved t1
"in3     = inf1/2"                     ; 13C interleaved increment
"D[ID]a  = d4-p14/2"
"D[ID]b  = d4+p14/2"
"D[ID]c  = p16+d16+p2/2+d3-p3*2/PI+4u"
"D[ID]d  = d2+p3+p2/2"
"D[ID]e  = D[ID]c+p3-p2/2"
"D[ID]f  = d4-p14/2"
"D[ID]g  = d4+p14/2"
"D[ID]h  = d12-d2-p14/2"
"D[ID]i  = d2+p14/2"
"D[ID]j  = d2-p14/2"
"D[ID]k  = d2+p14/2-p16-d16-de"
"cnst41  = 2*sfo2/sfo1"                ; gradient ratio
define list<gradient> GC_HSQC_COSY={cnst41}
`;
let pulprog = `
  ; 13C-1H HSQC

  ; INEPT
  (p1 ph0):f1
  D[ID]a
  (p14:sp3 ph0):f2
  (p2 ph0):f1
  D[ID]b pl2:f2
  (p1 ph1):f1
  (p3 ph18):f2
  D[ID]c

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
  D[ID]c pl2:f2

  ; reverse INEPT
  (p3 ph7):f2
  (p1 ph0):f1
  D[ID]f
  (p14:sp3 ph0):f2
  (p2 ph0):f1
  D[ID]g pl2:f2

  ; coherence transfer
  (p1 ph0):f1
if "l2 % 2 == 1"   ; relayed COSY peak suppression
{
  d12
}
else
{
  D[ID]h  ; d12-d2-p14/2
  (p14:sp3 ph0):f2
  D[ID]j  ; d2-p14/2
}
  (p2 ph0):f1
  d12
  (p1 ph2):f1

if "l1 % 2 == 0"
{
  D[ID]i  ; d2+p14/2
  (p2 ph0):f1
}
else
{
  D[ID]j  ; d2-p14/2
  (p14:sp3 ph0):f2
  (p2 ph0):f1
}
  D[ID]k  ; d2+p14/2-p16-d16-de
  p16:gp4*GC_HSQC_COSY*EA_TS
  d16 pl12:f2
  goscnp ph25 cpd2:f2
  50u do:f2
`;
const mod = new NOAHModule("c13", "Sc S", [Kupce2017ACIE], "noah_hsqc noah_TS", shortDescription, [], preamble, pulprog, 1, true);
export default mod;
// vim: syntax=bruker:
