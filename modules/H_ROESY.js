// vim: filetype=bruker:

const H_ROESY = {};
export default H_ROESY;

H_ROESY.shortDescription = `; 1H ROESY with 180(x),180(-x) spin lock`;

H_ROESY.shortCode = `R`;
H_ROESY.nuclei = `H`;

H_ROESY.auprog = `noah_roesy States`;

H_ROESY.preamble = `
"d10     = 3u"                         ; ROESY t1
"in10    = 2*dw"                       ; ROESY increment
"l7      = p15/(p25*2)"                ; ROESY spin lock loop counter
`

H_ROESY.module = `
  ; 1H-1H ROESY

  (p1 ph6):f1
  d10
  4u pl27:f1
7 (p25 ph7):f1
  (p25 ph8):f1
  lo to 7 times l7

  goscnp ph26
`
