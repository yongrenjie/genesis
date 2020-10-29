// vim: filetype=bruker:

export const H_Cqf = {};

H_Cqf.shortDescription = `; 1H magnitude-mode COSY
;     [use processing parameter "noah_cosy QF"]`

H_Cqf.preamble = `
"d10     = 3u"                         ; COSY t1
"in10    = 2*dw"                       ; COSY increment
`

H_Cqf.module = `
  ; COSY, magnitude mode

  (p1 ph11):f1
  4u
  p16:gp11
  d16
  d10
  (p1 ph1):f1
  4u
  p16:gp11
  d16
  4u
  go=2 ph30
`

H_Cqf.ea_inc = `
  1m id10
`

H_Cqf.phases = `
ph11=0 2
ph30=0 2
`

H_Cqf.gradients = `
;gpz11: 10%
`
