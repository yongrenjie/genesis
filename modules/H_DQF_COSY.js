// vim: filetype=bruker:

const H_DQF_COSY = {};
export default H_DQF_COSY;

H_DQF_COSY.shortDescription = "; 1H DQF-COSY";

H_DQF_COSY.shortCode = `D`;
H_DQF_COSY.nuclei = `H`;

H_DQF_COSY.auprog = `noah_noesy`;

H_DQF_COSY.preamble = `
"d10     = 3u"                         ; DQF-COSY t1
"in10    = 2*dw"                       ; DQF-COSY increment
define delay DH_DQF_COSY1
define delay DH_DQF_COSY2
"DH_DQF_COSY1   = p16+d16+d10"
"DH_DQF_COSY2   = p16+d16+8u"
`

H_DQF_COSY.module = `
  ; DQF-COSY

  (p1 ph5):f1
  DH_DQF_COSY1
  (p2 ph0):f1
  d10
  p16:gp5*EA
  d16
  (p1 ph0):f1
  DH_DQF_COSY2
  (p2 ph0):f1
  8u
  p16:gp5*0.3
  d16
  (p1 ph0):f1
  DH_DQF_COSY2
  (p2 ph0):f1
  4u
  p16:gp5*1.6
  d16
  
  goscnp ph31
`
