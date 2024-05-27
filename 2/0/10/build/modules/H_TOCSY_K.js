import { Kupce2017ACIE } from "../citation.js";
import NOAHModule from "../noahModule.js";
let shortDescription = `; 1H phase-sensitive TOCSY`;
let preamble = `
"l11     = (d9/(p6*115.112))/2"        ; half the number of TOCSY loops
"l12     = l11*2"                      ; number of TOCSY loops
"d13     = 3u"                         ; TOCSY t1
"in13    = 2*dw"                       ; TOCSY increment
`;
let pulprog = `
  ; 1H-1H TOCSY

  (p1 ph20):f1
  d13
  (p1 ph0):f1
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

  goscnp ph26
`;
const mod = new NOAHModule("h1", "Tk", [Kupce2017ACIE], "noah_tocsy States noah_add", shortDescription, preamble, pulprog);
export default mod;
// vim: syntax=bruker:
