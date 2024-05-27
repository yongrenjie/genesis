import { Gyongyosi2021AC } from "../citation.js";
import NOAHModule from "../noahModule.js";
let shortDescription = `; 13C TS HSQC-CLIP-COSY + HSQC`;
let preamble = `
"p2      = p1*2"                       ; 1H hard 180
"d2      = 0.5s/cnst2"                 ; JCOMP
"d4      = 0.25s/cnst2"                ; 13C INEPT
"d12     = 0.25s/cnst12"               ; perfect echo mixing (< 1/4J(HH))
"d3      = 3u"                         ; 13C HSQC-COSY t1
"in3     = inf1/2"                     ; 13C HSQC-COSY increment
"D[ID]a  = d4-larger(p2,p14)/2"
"D[ID]b  = p16+d16+p2+d3*2-4u"
"D[ID]c  = d12-d4-p14/2"
"D[ID]d  = d4-p14/2"
"D[ID]e  = d2-p2/2"
"D[ID]f  = d2-p2/2-p16-d16"
"D[ID]g  = d2-p14/2"
"D[ID]h  = d2-p14/2-p16-d16"
"cnst43  = sfo2/sfo1"                  ; gradient ratio
define list<gradient> G[ID]={cnst43}
`;
let pulprog = `
  ; 13C-1H HSQC-CLIP-COSY (IPAP mode for separation of direct & indirect peaks)

  ; forward INEPT
  (p1 ph0):f1
  D[ID]a
  4u
  (center (p2 ph0):f1 (p14:sp3 ph0):f2 )
  4u
  D[ID]a pl2:f2
  4u
  (p1 ph1):f1 (p3 ph18):f2

  ; t1 evolution
  d3
  (p2 ph7):f1
  d3
  p16:gp4
  d16
  (p24:sp7 ph0):f2
  4u
  D[ID]b pl2:f2

  (p3 ph7):f2
  p16:gp11*0.5  ; purge gradient
  d16
  (p1 ph1):f1

  ;CLIP COSY starts here
  ;in-phase transfer block, planar mixing

  d12
  (p2 ph17):f1
  D[ID]c
  (p14:sp3 ph0):f2
  D[ID]d pl2:f2
  (p1 ph17):f1
  d12
  (p2 ph3):f1
  d12

  ;z-filter block
  (p1 ph0):f1
  4u gron12
  (p32:sp29 ph2):f1
  40u groff
  p16:gp11
  d16 pl1:f1

  (p1 ph0):f1
  (p3 ph12):f2
if "l1 % 2 == 0"
{
  D[ID]e
  4u
  (p2 ph1):f1
  D[ID]f pl12:f2
  4u
}
else
{
  D[ID]g
  4u
  (center (p2 ph1):f1 (p14:sp3 ph0):f2)
  D[ID]h pl12:f2
  4u
}
  p16:gp4*EA_TS*G[ID]
  d16
  goscnp ph24 cpd2:f2
  50u do:f2
`;
const mod = new NOAHModule("C_HSQCC_CIA", "c13", "Scc S", [Gyongyosi2021AC], "noah_hsqc noah_TS", shortDescription, [], preamble, pulprog, 1, true);
export default mod;
// vim: syntax=bruker:
