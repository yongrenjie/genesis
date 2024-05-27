// vim: syntax=bruker:
import NOAHModule from "../noahModule.js";
let shortDescription = "; 1H DQF-COSY (States)";
let preamble = `
"d10     = 3u"                         ; DQF-COSY t1
"in10    = 2*dw"                       ; DQF-COSY increment
define delay DH_DQF_COSY1
"DH_DQF_COSY1   = p16+d16+4u"
`;
let pulprog = `
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
`;
const mod = new NOAHModule("h1", "D", "noah_clipcosy States", shortDescription, preamble, pulprog);
export default mod;
