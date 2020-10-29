// vim: filetype=bruker:

export const H_Cclip = {};

H_Cclip.shortDescription = `; 1H CLIP-COSY
;     [use processing parameter "noah_clipcosy States"]`

H_Cclip.preamble = `
"d10     = 3u"                         ; CLIP-COSY t1
"d12     = 0.25s/cnst12"               ; CLIP-COSY mixing (< 1/4J(HH))
"in10    = 2*dw"                       ; CLIP-COSY increment
`

H_Cclip.module = `
  ; 1H-1H CLIP-COSY

  (p1 ph13):f1
  d10
  (p1 ph1):f1
  10u gron13 pl0:f1
  (p32:sp29 ph1):f1
  20u groff
  d16 pl1:f1
  (p1 ph1):f1

  ; in-phase transfer via perfect echo
  d12
  (p2 ph2):f1
  d12
  (p1 ph2):f1
  d12
  (p2 ph18):f1
  d12

  (p1 ph1):f1
  10u gron13*1.333 pl0:f1 
  (p32*0.75:sp29 ph17):f1
  20u groff
  p16:gp12
  d16 pl1:f1 
  4u
  (p1 ph1):f1

  go=2 ph30
`

H_Cclip.ea_inc = `
  1m ip13
`

H_Cclip.t1_inc = `
  1m rp13
  1m id10
`


H_Cclip.phases = `
ph13=0 2
ph17=2
ph18=3
ph30=0 2
`

H_Cclip.gradients = `
;gpz12: 15%
;gpz13: 11%
`
