// vim: filetype=bruker:

export const H_N = {};

H_N.shortDescription = `; 1H phase-sensitive NOESY
;     [use processing parameter "noah_noesy States"]`

H_N.preamble = `
"d10     = 3u"                         ; NOESY t1
"in10    = 2*dw"                       ; NOESY increment
define delay DH_N1
"DH_N1   = d8-p32-p16-d16-30u"
`


H_N.module = `
  ; NOESY

  (p1 ph13):f1
  d10
  (p1 ph1):f1
  10u gron13
  (p32:sp29 ph1):f1
  20u groff
  p16:gp12
  d16 pl1:f1
  4u
  DH_N1
  (p1 ph1):f1

  go=2 ph30     ; acquire H-H NOESY
`

H_N.ea_inc = `
  1m ip13
`


H_N.t1_inc = `
  1m id10
  1m rp13
`


H_N.phases = `
ph13=0 2
ph30=0 2
`

H_N.gradients = `
;gpz12: 14%
;gpz13: 11%
`
