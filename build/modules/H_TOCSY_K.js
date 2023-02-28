import NOAHModule from "../noahModule.js";
let shortDescription = `; 1H phase-sensitive TOCSY (double NS, half TD1)`;
let preamble = `
"l11  = (d9/(p6*115.112))/2"        ; half the number of TOCSY loops
"l12  = l11*2"                      ; number of TOCSY loops
"d13  = 3u"                         ; TOCSY t1
"in13 = 2*dw"                       ; TOCSY increment
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
const mod = new NOAHModule("H_TOCSY_K", "h1", "Tk", [], "noah_tocsy States noah_add", "TOCSY (States)", shortDescription, [], preamble, pulprog, 1, false);
export default mod;
// vim: syntax=bruker:
