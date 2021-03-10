// vim: syntax=bruker:

import NOAHModule from "../noahModule.js";

let shortDescription = `; 1H phase-sensitive TOCSY`;

let preamble = `
"l11     = (d9/(p6*115.112))/2"        ; half the number of TOCSY loops
"l12     = l11*2"                      ; number of TOCSY loops
"d10     = 3u"                         ; TOCSY t1
"in10    = 2*dw"                       ; TOCSY increment
`

let pulprog = `
  ; 1H-1H TOCSY

  (p1 ph6):f1
  d10
  (p1 ph0):f1
  10u gron12
  (p32:sp29 ph0):f1
  20u groff
  d16 pl10:f1

						;begin DIPSI2
8 p6*3.556 ph3
  p6*4.556 ph1
  p6*3.222 ph3
  p6*3.167 ph1
  p6*0.333 ph3
  p6*2.722 ph1
  p6*4.167 ph3
  p6*2.944 ph1
  p6*4.111 ph3
  
  p6*3.556 ph1
  p6*4.556 ph3
  p6*3.222 ph1
  p6*3.167 ph3
  p6*0.333 ph1
  p6*2.722 ph3
  p6*4.167 ph1
  p6*2.944 ph3
  p6*4.111 ph1

  p6*3.556 ph1
  p6*4.556 ph3
  p6*3.222 ph1
  p6*3.167 ph3
  p6*0.333 ph1
  p6*2.722 ph3
  p6*4.167 ph1
  p6*2.944 ph3
  p6*4.111 ph1

  p6*3.556 ph3
  p6*4.556 ph1
  p6*3.222 ph3
  p6*3.167 ph1
  p6*0.333 ph3
  p6*2.722 ph1
  p6*4.167 ph3
  p6*2.944 ph1
  p6*4.111 ph3
  lo to 8 times l12
						;end DIPSI2
  p16:gp11
  d16
  10u gron12*1.333
  (p32*0.75:sp29 ph0):f1
  20u groff
  d16 pl1:f1
  4u
  (p1 ph0):f1

  goscnp ph26
`

const mod = new NOAHModule(
    "h1",
    "T",
    "noah_tocsy States",
    shortDescription,
    preamble,
    pulprog
);
export default mod;
