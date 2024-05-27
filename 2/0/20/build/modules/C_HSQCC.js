import { Kupce2017ACIE } from "../citation.js";
import { AF_EDIT } from "../acquFlag.js";
import NOAHModule from "../noahModule.js";
let shortDescription = `; 13C HSQC-COSY (TSE version)`;
let preamble = `
"p2      = p1*2"                       ; 1H hard 180
"d2      = 0.5s/cnst2"                 ; JCOMP
"d4      = 0.25s/cnst2"                ; 13C INEPT
"d12     = 0.25s/cnst12"               ; COSY mixing (< 1/4J(HH))
"d0      = 3u"                         ; 13C HSQC-COSY t1
"in0     = inf1/2"                     ; 13C HSQC-COSY increment
"D[ID]a  = d4-p14/2"
"D[ID]b  = d4+p14/2"
"D[ID]c  = p16+d16+p2/2+d0-p3*2/PI+4u"
"D[ID]d  = d2+p3+p2/2"
"D[ID]e  = D[ID]c+p3-p2/2"
"D[ID]f  = d4-p14/2"
"D[ID]g  = d4+p14/2"
"D[ID]h  = d12-d2-p14/2"
"D[ID]i  = d2-p14/2"
"D[ID]j  = d2+p14/2-p16-d16-de"
"cnst41  = 2*sfo2/sfo1"                ; gradient ratio
define list<gradient> G[ID]={cnst41}
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
  (p3 ph5):f2
  D[ID]c

  ; t1 period
#ifdef EDIT
  (p31:sp18 ph0):f2
#else
  (p14:sp3 ph0):f2
#endif /* EDIT */
  4u
  p16:gp4
  d16
  d0
  (p2 ph11):f1
  d0
  4u
  p16:gp4
  d16

  ; multiplicity editing (not recommended)
#ifdef EDIT
  D[ID]d
  (p31:sp18 ph0):f2
  D[ID]e
  (p2 ph1):f1
  d2 pl2:f2
#else
  (p14:sp3 ph0):f2
  D[ID]c pl2:f2
#endif /* EDIT */

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
  D[ID]i  ; d2-p14/2
}
  (p2 ph0):f1
  d12
  (p1 ph2):f1

  ; spin echo for HSQC vs COSY peak editing
  D[ID]i  ; d2-p14/2
  (p14:sp3 ph0):f2
  (p2 ph0):f1
  D[ID]j  ; d2+p14/2-p16-d16-de
  p16:gp4*G[ID]*EA
  d16 pl12:f2
  goscnp ph25 cpd2:f2
  50u do:f2
`;
const mod = new NOAHModule("c13", "Sc", [Kupce2017ACIE], "noah_hsqc", shortDescription, [AF_EDIT], preamble, pulprog, 1, false);
export default mod;
// vim: syntax=bruker:
