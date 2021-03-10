// vim: syntax=bruker:

import NOAHModule from "../noahModule.js";

let shortDescription = `; 1H COSY + TOCSY (echo/antiecho F1)`;

let preamble = `
"l11     = (d9/(p6*115.112))/2"        ; half the number of TOCSY loops
"l12     = l11*2"                      ; number of TOCSY loops
"d10     = 3u"                         ; COSY/TOCSY t1
"in10    = 2*dw"                       ; COSY/TOCSY increment
define delay DH_COSY_TOCSY1
define delay DH_COSY_TOCSY2
"DH_COSY_TOCSY1  = p16+d16+4u-d10"
"DH_COSY_TOCSY2  = p16+d16"
`

let pulprog = `
  ; 1H-1H COSY + TOCSY

  ; COSY
  (p1 ph5):f1
  DH_COSY_TOCSY1
  (p2 ph0):f1
  4u
  p16:gp5
  d16
  d10
  (p1 ph0):f1
  4u
  p16:gp5*EA
  d16
  goscnp ph31    ; acquire H-H COSY
  2m st

  ; TOCSY
  10u gron12
  (p32:sp29 ph0):f1  ; ZQ suppression
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
  (p32*0.75:sp29 ph0):f1  ; ZQ suppression
  20u groff
  d16 pl1:f1
  4u

  (p1 ph0):f1
  DH_COSY_TOCSY2
  de
  4u
  (p2 ph7):f1
  4u
  p16:gp5*EA
  d16

  goscnp ph31
`

const mod = new NOAHModule(
    "h1",
    "CT",
    "noah_cosy:noah_tocsy",
    shortDescription,
    preamble,
    pulprog
);
export default mod;
