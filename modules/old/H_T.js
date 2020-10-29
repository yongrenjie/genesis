// vim: filetype=bruker:

export const H_T = {};

H_T.shortDescription = `; 1H phase-sensitive TOCSY
;     [use processing parameter "noah_tocsy States"]`

H_T.preamble = `
"l11     = (d9/(p6*115.112))/2"        ; half the number of TOCSY loops
"l12     = l11*2"                      ; number of TOCSY loops
"d10     = 3u"                         ; TOCSY t1
"in10    = 2*dw"                       ; TOCSY increment
`


H_T.module = `
  ; 1H-1H TOCSY

  (p1 ph13):f1
  d10
  (p1 ph1):f1
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

  go=2 ph30
`

H_T.ea_inc = `
  1m ip13
`

H_T.t1_inc = `
  1m rp13
  1m id10
`

H_T.phases = `
ph13=0 2
ph16=1
ph18=3
ph30=0 2
`

H_T.gradients = `
;gpz12: 20%
;gpz13: 14%
`
