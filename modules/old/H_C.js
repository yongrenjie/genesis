// vim: filetype=bruker:

export const H_C = {};

H_C.shortDescription = "; 1H phase-sensitive COSY"

H_C.preamble = `
"d10     = 3u"                         ; COSY t1
"in10    = 2*dw"                       ; COSY increment
`


H_C.module = `
  ; COSY

  (p1 ph11):f1
  4u
  p16:gp11*EA
  d16
  d10
  (p1 ph1):f1
  4u
  p16:gp11
  d16
  4u
  go=2 ph30
`


H_C.t1_inc = `
  1m id10
  1m ip11*2
  1m ip30*2
`


H_C.phases = `
ph11=0 2
ph30=0 2
`

H_C.gradients = `
;gpz11: 10%
`
