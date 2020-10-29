// vim: filetype=bruker:

/* 1H COSY + NOESY */

export const H_CN = {};

H_CN.shortDescription = "; 1H COSY and NOESY (shared t1)"

H_CN.preamble = `
"d10     = 3u"                         ; COSY/NOESY t1
"in10    = 2*dw"                       ; COSY/NOESY increment
define delay DH_CN1
define delay DH_CN2
define delay DH_CN3
"DH_CN1  = p16+d16+4u-d10"
"DH_CN2  = d8-p16-d16-de-aq-3m-p3-p16-58u"     ; NOE mixing time
"DH_CN3  = p16+d16"
`

H_CN.module = `
  ; 1H-1H COSY + NOESY

  ; COSY
  (p1 ph11)
  DH_CN1
  (p2 ph1)
  4u
  p16:gp11
  d16
  d10
  (p1 ph1)
  4u
  p16:gp11*EA
  d16
  goscnp ph30    ; acquire H-H COSY

  ; NOESY
  4u
  (p3 ph1):f2    ; extra 13C cleanup pulse
  50u
  p16:gp12
  DH_CN2 st      ; noe mixing time
  (p1 ph12):f1
  DH_CN3
  de
  4u
  (p2 ph12):f1
  4u
  p16:gp11*EA
  d16
  go=2 ph31    ; acquire phase sensitive H-H NOESY
`


H_CN.t1_inc = `
  1m id10
  1m ip11*2
  1m ip30*2
  1m ip31*2
`


H_CN.phases = `
ph11=0 2
ph12=0 0 2 2
ph30=0 2
ph31=0 2 2 0
`

H_CN.gradients = `
;gpz11: 10%
;gpz12: 33%
`
