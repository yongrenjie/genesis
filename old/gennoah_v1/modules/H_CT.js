// vim: filetype=bruker:

export const H_CT = {};

H_CT.shortDescription = `; 1H COSY + TOCSY (shared t1)`

H_CT.preamble = `
"l11     = (d9/(p6*115.112))/2"        ; half the number of TOCSY loops
"l12     = l11*2"                      ; number of TOCSY loops
"d10     = 3u"                         ; COSY/TOCSY t1
"in10    = 2*dw"                       ; COSY/TOCSY increment
define delay DH_CT1
define delay DH_CT2
"DH_CT1  = p16+d16+4u-d10"
"DH_CT2  = p16+d16"
`

H_CT.module = `
  ; 1H-1H COSY + TOCSY

  ; COSY
  (p1 ph11):f1
  DH_CT1
  (p2 ph1):f1
  4u
  p16:gp11
  d16
  d10
  (p1 ph1):f1
  4u
  p16:gp11*EA
  d16
  goscnp ph30    ; acquire H-H COSY
  2m st

  ; TOCSY
  10u gron13 pl0:f1
  (p32:sp29 ph1):f1
  20u groff
  d16 pl10:f1

						;begin DIPSI2
8 p6*3.556 ph18
  p6*4.556 ph16
  p6*3.222 ph18
  p6*3.167 ph16
  p6*0.333 ph18
  p6*2.722 ph16
  p6*4.167 ph18
  p6*2.944 ph16
  p6*4.111 ph18
  
  p6*3.556 ph16
  p6*4.556 ph18
  p6*3.222 ph16
  p6*3.167 ph18
  p6*0.333 ph16
  p6*2.722 ph18
  p6*4.167 ph16
  p6*2.944 ph18
  p6*4.111 ph16

  p6*3.556 ph16
  p6*4.556 ph18
  p6*3.222 ph16
  p6*3.167 ph18
  p6*0.333 ph16
  p6*2.722 ph18
  p6*4.167 ph16
  p6*2.944 ph18
  p6*4.111 ph16

  p6*3.556 ph18
  p6*4.556 ph16
  p6*3.222 ph18
  p6*3.167 ph16
  p6*0.333 ph18
  p6*2.722 ph16
  p6*4.167 ph18
  p6*2.944 ph16
  p6*4.111 ph18
  lo to 8 times l12
						;end DIPSI2
  p16:gp12
  d16
  10u gron13*1.333 pl0:f1 
  (p32*0.75:sp29 ph1):f1
  20u groff
  d16 pl1:f1
  4u

  (p1 ph1):f1
  DH_CT2
  de
  4u
  (p2 ph12):f1
  4u
  p16:gp11*EA
  d16

  go=2 ph31
`


H_CT.t1_inc = `
  1m id10
  1m ip11*2
  1m ip30*2
  1m ip31*2
`

H_CT.phases = `
ph11=0 2
ph12=0 0 2 2
ph18=3
ph16=1
ph30=0 2
ph31=0 2
`

H_CT.gradients = `
;gpz11: 10%
;gpz12: 20%
;gpz13: 14%
`
