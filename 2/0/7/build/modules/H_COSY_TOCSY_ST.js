import { Kupce2017ACIE } from "../citation.js";
import NOAHModule from "../noahModule.js";
let shortDescription = `; 1H COSY + TOCSY (States F1)`;
let preamble = `
"d10     = 3u"                         ; COSY/TOCSY t1
"in10    = 2*dw"                       ; COSY/TOCSY increment
`;
let pulprog = `
  ; 1H-1H COSY + TOCSY (States)

  ; COSY
  (p1 ph6):f1
  d10
  (p1 ph0):f1
  4u
  goscnp ph26  ; acquire H-H COSY
  2m st

  ; TOCSY
  10u gron12
  (p32:sp29 ph0):f1
  20u groff
  d16 pl10:f1

  |DIPSI|

  p16:gp11
  d16
  10u gron12*1.333
  (p32*0.75:sp29 ph0):f1
  20u groff
  d16 pl1:f1
  4u
  (p1 ph0):f1

  goscnp ph26  ; acquire H-H TOCSY
`;
const mod = new NOAHModule("h1", "CTst", [Kupce2017ACIE], "noah_cosy States:noah_tocsy States", shortDescription, preamble, pulprog);
export default mod;
// vim: syntax=bruker:
