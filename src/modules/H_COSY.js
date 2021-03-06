// vim: filetype=bruker:

const H_COSY = {};
export default H_COSY;

H_COSY.nuclei = `H`;

H_COSY.shortCode = `C`;

H_COSY.shortDescription = `; 1H phase-sensitive COSY`;

H_COSY.auprog = `noah_cosy`;

H_COSY.preamble = `
"d10     = 3u"                         ; COSY t1
"in10    = 2*dw"                       ; COSY increment
`

H_COSY.module = `
  ; COSY

  (p1 ph5):f1
  4u
  p16:gp5*EA
  d16
  d10
  (p1 ph0):f1
  4u
  p16:gp5
  d16
  4u
  goscnp ph31
`
