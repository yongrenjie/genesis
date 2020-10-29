// vim: filetype=bruker:

const H_NOESY = {};
export default H_NOESY;

H_NOESY.shortCode = `N`;

H_NOESY.nuclei = `H`;

H_NOESY.shortDescription = `; 1H phase-sensitive NOESY`;

H_NOESY.auprog = `noah_noesy States`;

H_NOESY.preamble = `
"d10     = 3u"                         ; NOESY t1
"in10    = 2*dw"                       ; NOESY increment
define delay DH_NOESY1
"DH_NOESY1   = d8-p32-p16-d16-30u"
`

H_NOESY.module = `
  ; 1H-1H NOESY

  (p1 ph6):f1
  d10
  (p1 ph0):f1
  10u gron12
  (p32:sp29 ph0):f1
  20u groff
  p16:gp11
  d16 pl1:f1
  4u
  DH_NOESY1
  (p1 ph0):f1

  goscnp ph26
`
