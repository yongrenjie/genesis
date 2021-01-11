// vim: filetype=bruker:

const H_DQF_COSY_EA = {};
export default H_DQF_COSY_EA;

H_DQF_COSY_EA.shortDescription = "; 1H DQF-COSY (echo-antiecho)";

H_DQF_COSY_EA.shortCode = `D`;
H_DQF_COSY_EA.nuclei = `H`;

H_DQF_COSY_EA.auprog = `noah_noesy`;

H_DQF_COSY_EA.preamble = `
"d10     = 3u"                         ; DQF-COSY t1
"in10    = 2*dw"                       ; DQF-COSY increment
define delay DH_DQF_COSY_EA1
define delay DH_DQF_COSY_EA2
"DH_DQF_COSY_EA1   = p16+d16+d10"
"DH_DQF_COSY_EA2   = p16+d16+8u"
`

H_DQF_COSY_EA.module = `
  ; DQF-COSY (echo-antiecho)

  (p1 ph5):f1
  DH_DQF_COSY_EA1
  (p2 ph0):f1
  d10
  p16:gp5*EA
  d16
  (p1 ph0):f1
  DH_DQF_COSY_EA2
  (p2 ph0):f1
  8u
  p16:gp5*0.3
  d16
  (p1 ph0):f1
  DH_DQF_COSY_EA2
  (p2 ph0):f1
  4u
  p16:gp5*1.6
  d16
  
  goscnp ph31
`
