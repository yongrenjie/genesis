// vim: filetype=bruker:

const H_COSY_TOCSY = {};
export default H_COSY_TOCSY;

H_COSY_TOCSY.shortDescription = `; 1H COSY + TOCSY (shared t1)`;
H_COSY_TOCSY.shortCode = `CT`;
H_COSY_TOCSY.nuclei = `H`;
H_COSY_TOCSY.auprog = `noah_cosy:noah_tocsy`;

H_COSY_TOCSY.preamble = `
"l11     = (d9/(p6*115.112))/2"        ; half the number of TOCSY loops
"l12     = l11*2"                      ; number of TOCSY loops
"d10     = 3u"                         ; COSY/TOCSY t1
"in10    = 2*dw"                       ; COSY/TOCSY increment
define delay DH_COSY_TOCSY1
define delay DH_COSY_TOCSY2
"DH_COSY_TOCSY1  = p16+d16+4u-d10"
"DH_COSY_TOCSY2  = p16+d16"
`

H_COSY_TOCSY.module = `
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
  10u gron12 pl0:f1
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
  10u gron12*1.333 pl0:f1 
  (p32*0.75:sp29 ph0):f1
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
