// vim: filetype=bruker:

export const C_B = {};

C_B.shortDescription = `; 13C HMBC`

C_B.preamble = `
"p2      = p1*2"                       ; 1H hard 180
"p4      = p3*2"                       ; 13C hard 180
"d2      = 0.5s/cnst2"                 ; JCOMP
"d4      = 0.25s/cnst2"                ; 13C INEPT
"d7      = 0.5s/cnst13"                ; 13C LR coupling evolution
"d0      = 3u"                         ; 13C t1
"in0     = inf1/2"                     ; 13C increment
define delay DC_B1
define delay DC_B2
define delay DC_B3
define delay DC_B4
define delay DC_B5
define delay DC_B6
"DC_B1   = d4-p14/2"
"DC_B2   = d4+p14/2"
"DC_B3   = 1s/(2*cnst6)-p16-d16"
"DC_B4   = 1s/(2*cnst7)-p16-d16"
"DC_B5   = d7-p16-d16-4u"
"DC_B6   = p16+d16+p2/2+d0-p3*2/PI+4u"
`

C_B.module = `
  ; 13C-1H HMBC

  ; zz-filter
  (p1 ph1):f1
  DC_B1
  (p14:sp3 ph1):f2
  (p2 ph1):f1
  DC_B2
  (p1 ph1):f1
  DC_B1
  (p14:sp3 ph1):f2
  (p2 ph1):f1
  DC_B2 pl2:f2

  ; second-order low-pass J-filter
  (p1 ph1):f1
  DC_B3
  p16:gp7*-3
  d16
  (p3 ph3):f2
  DC_B4
  p16:gp7*2
  d16
  (p3 ph3):f2
  4u
  p16:gp7
  d16
  DC_B5  ; nJ(CH) evolution

  ; coherence transfer to 13C and t1
  (p3 ph5):f2
  DC_B6
  (p14:sp3 ph1):f2
  4u
  p16:gp5*EA
  d16
  d0
  (p2 ph4):f1
  d0
  4u
  p16:gp5*EA
  d16
  (p14:sp3 ph1):f2
  DC_B6 pl2:f2
  (p3 ph3):f2
  (p2 ph1):f1
  4u
  p16:gp6
  d16
  4u
  goscnp ph27
  50u
`

C_B.t1_inc = `
  1m id0
  1m ip3*2
  1m ip27*2
`

C_B.phases = `
ph3=0 2
ph4=0 0 0 0 2 2 2 2
ph5=0 0 2 2
ph27=0 2 2 0
`

C_B.gradients = `
;gpz5: 56%
;gpz6: 28.14%
;gpz7: -5%
`

C_B.wavemaker = `
;sp3:wvm:wu180C13: cawurst-20(60 kHz, 0.5 ms; L2H)
`
