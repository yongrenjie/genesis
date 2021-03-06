// vim: filetype=bruker:

const H_DQF_COSY = {};
export default H_DQF_COSY;

H_DQF_COSY.shortDescription = "; 1H DQF-COSY (States)";

H_DQF_COSY.shortCode = `D`;
H_DQF_COSY.nuclei = `H`;

H_DQF_COSY.auprog = `noah_clipcosy States`;

H_DQF_COSY.preamble = `
"d10     = 3u"                         ; DQF-COSY t1
"in10    = 2*dw"                       ; DQF-COSY increment
define delay DH_DQF_COSY1
"DH_DQF_COSY1   = p16+d16+4u"
`

H_DQF_COSY.module = `
  ; DQF-COSY

  (p1 ph16):f1
  d10
  (p1 ph0):f1

  DH_DQF_COSY1
  (p2 ph0):f1
  4u
  p16:gp19
  d16
  (p1 ph1):f1
  DH_DQF_COSY1
  (p2 ph0):f1
  4u
  p16:gp19*2
  d16
  4u

  goscnp ph26
`
