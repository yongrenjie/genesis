import { Koos2016ACIE } from "../citation.js";
import NOAHModule from "../noahModule.js";
let shortDescription = `; 1H interleaved CLIP-COSY + TOCSY`;
let preamble = `
"p2   = p1*2"                       ; 1H hard 180
"d13  = 3u"                         ; 1H t1
"d12  = 0.25s/cnst12"               ; CLIP-COSY mixing (< 1/4J(HH))
"in13 = 2*dw"                       ; 1H t1 increment
"l11  = (d9/(p6*115.112))/2"        ; half the number of TOCSY loops
"l12  = l11*2"                      ; number of TOCSY loops
`;
let pulprog = `
  (p1 ph20):f1
  d13
  (p1 ph0):f1
  10u gron12
  (p32:sp29 ph0):f1
  20u groff

if "l1 % 2 == 0" {
  ; 1H-1H CLIP-COSY
  d16 pl1:f1
  (p1 ph0):f1

  ; in-phase transfer via perfect echo
  d12
  (p2 ph1):f1
  d12
  (p1 ph1):f1
  d12
  (p2 ph3):f1
  d12

  (p1 ph0):f1
  10u gron12*1.333
  (p32*0.75:sp29 ph2):f1
  20u groff
  p16:gp11
  d16 pl1:f1 
}
else
{
  ; 1H-1H TOCSY
  d16 pl10:f1

  |DIPSI|

  p16:gp11
  d16
  10u gron12*1.333
  (p32*0.75:sp29 ph0):f1
  20u groff
  d16 pl1:f1
}

  4u
  (p1 ph0):f1

  goscnp ph26
`;
const mod = new NOAHModule("H_CC_T", "h1", "Cc T", [Koos2016ACIE], "noah_clipcosy States noah_tocsy States", shortDescription, [], preamble, pulprog, 1, true);
export default mod;
// vim: syntax=bruker:
