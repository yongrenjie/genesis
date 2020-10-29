// vim: filetype=bruker:

export const H_R = {};

H_R.shortDescription = `; 1H ROESY with 180(x),180(-x) spin lock
;     [use processing parameter "noah_roesy States"]`

H_R.preamble = `
"d10     = 3u"                         ; ROESY t1
"in10    = 2*dw"                       ; ROESY increment
"l4      = p15/(p25*2)"                ; ROESY spin lock loop counter
`


H_R.module = `
  ; ROESY

  (p1 ph13):f1
  d10
  4u pl27:f1
7 (p25 ph14):f1
  (p25 ph15):f1
  lo to 7 times l4

  go=2 ph30
`

H_R.ea_inc = `
  1m ip13
`

H_R.t1_inc = `
  1m rp13
  1m id10
`

H_R.phases = `
ph13=0 2
ph14=0 0 2 2
ph15=2 2 0 0
ph30=0 2
`
