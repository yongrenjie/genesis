import { Kupce2017ACIE } from "../citation.js";
import NOAHModule from "../noahModule.js";
let shortDescription = "; 1H DQF-COSY (echo-antiecho)";
let preamble = `
"d10     = 3u"                         ; DQF-COSY t1
"in10    = 2*dw"                       ; DQF-COSY increment
define delay DH_DQF_COSY_EA1
define delay DH_DQF_COSY_EA2
"DH_DQF_COSY_EA1   = p16+d16+d10"
"DH_DQF_COSY_EA2   = p16+d16+8u"
`;
let pulprog = `
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
`;
const mod = new NOAHModule("h1", "Dea", [Kupce2017ACIE], "noah_noesy", shortDescription, preamble, pulprog);
export default mod;
// vim: syntax=bruker:
