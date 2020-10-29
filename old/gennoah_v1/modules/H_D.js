// vim: filetype=bruker:

export const H_D = {};

H_D.shortDescription = "; 1H DQF-COSY"

H_D.preamble = `
"d10     = 3u"                         ; DQF-COSY t1
"in10    = 2*dw"                       ; DQF-COSY increment
define delay DH_D1
define delay DH_D2
"DH_D1   = p16+d16+d10"
"DH_D2   = p16+d16+8u"
`


H_D.module = `
  ; DQF-COSY

  (p1 ph11):f1
  DH_D1
  (p2 ph1):f1
  d10
  p16:gp14*EA
  d16
  (p1 ph1):f1
  DH_D2
  (p2 ph1):f1
  8u
  p16:gp15
  d16
  (p1 ph1):f1
  DH_D2
  (p2 ph1):f1
  4u
  p16:gp16
  d16
  
  go=2 ph30
`


H_D.t1_inc = `
  1m id10
  1m ip11*2
  1m ip30*2
`


H_D.phases = `
ph11=0 2
ph30=0 2
`

H_D.gradients = `
;gpz14: 15%
;gpz15: 5%
;gpz16: 25%
`
