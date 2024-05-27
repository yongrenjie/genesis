import { Kupce2017ACIE, Koos2016ACIE } from "../citation.js";
import NOAHModule from "../noahModule.js";
let shortDescription = `; 1H CLIP-COSY (States)`;
let preamble = `
"d10  = 3u"                         ; CLIP-COSY t1
"d12  = 0.25s/cnst12"               ; CLIP-COSY mixing (< 1/4J(HH))
"in10 = 2*dw"                       ; CLIP-COSY increment
`;
let pulprog = `
  ; 1H-1H CLIP-COSY

  (p1 ph6):f1
  d10
  (p1 ph0):f1
  10u gron12
  (p32:sp29 ph0):f1
  20u groff
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
  4u
  (p1 ph0):f1

  goscnp ph26
`;
const mod = new NOAHModule("h1", "Cc", [Kupce2017ACIE, Koos2016ACIE], "noah_clipcosy States", shortDescription, preamble, pulprog);
export default mod;
// vim: syntax=bruker:
