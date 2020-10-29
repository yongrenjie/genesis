// vim: filetype=bruker:

export const H_Rad = {};

H_Rad.shortDescription = `; 1H ROESY with adiabatic spin lock
;     [use processing parameter "noah_roesy States"]`

H_Rad.preamble = `
"d10     = 3u"                         ; ROESY t1
"in10    = 2*dw"                       ; ROESY increment
`


H_Rad.module = `
  ; ROESY with adiabatic spin lock

  (p1 ph13):f1
  d10
  (p1 ph1):f1
  10u
  (p50:sp49 ph1):f1
  (p50:sp50 ph1):f1
  10u 
  p16:gp12
  d16 pl1:f1
  (p1 ph1):f1
  go=2 ph30
`

H_Rad.ea_inc = `
  1m ip13
`

H_Rad.t1_inc = `
  1m rp13
  1m id10
`

H_Rad.phases = `
ph13=0 2
ph30=0 2
`

H_Rad.gradients = `
;gpz12: 14%
`

H_Rad.wavemaker = `
;sp49:wvm:wu180H1SL: wurstAM(p50, 9.5 ppm; B1max = 5.0 kHz)
;sp50:wvm:wu180H1SL2: wurstAM(p50, -0.5 ppm; B1max = 5.0 kHz)
`
