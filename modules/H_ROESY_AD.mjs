// vim: filetype=bruker:

const H_ROESY_AD = {};
export default H_ROESY_AD;

H_ROESY_AD.shortDescription = `; 1H ROESY with adiabatic spin lock
;     [use "wvm -a" to generate spin lock pulses before running]`;
H_ROESY_AD.shortCode = `Rad`;
H_ROESY_AD.nuclei = `H`;
H_ROESY_AD.auprog = `noah_roesy States`;

H_ROESY_AD.preamble = `
"d10     = 3u"                         ; ROESY t1
"in10    = 2*dw"                       ; ROESY increment
`

H_ROESY_AD.module = `
  ; ROESY with adiabatic spin lock

  (p1 ph6):f1
  d10
  (p1 ph0):f1
  10u
  (p50:sp49 ph0):f1
  (p50:sp50 ph0):f1
  10u 
  p16:gp11
  d16 pl1:f1
  (p1 ph0):f1
  goscnp ph26
`
