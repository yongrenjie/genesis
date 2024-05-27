import NOAHModule from "../noahModule.js";
let shortDescription = "; 1H DQF-COSY (States)";
let preamble = `
"p2     = p1*2"                       ; 1H hard 180
"d10    = 3u"                         ; DQF-COSY t1
"in10   = 2*dw"                       ; DQF-COSY increment
"D[ID]a = p16+d16+4u"
`;
let pulprog = `
  ; DQF-COSY

  (p1 ph16):f1
  d10
  (p1 ph0):f1

  D[ID]a
  (p2 ph0):f1
  4u
  p16:gp19
  d16
  (p1 ph1):f1
  D[ID]a
  (p2 ph0):f1
  4u
  p16:gp19*2
  d16
  4u

  goscnp ph26
`;
const mod = new NOAHModule("H_DQFCOSY", "h1", "D", [], "noah_clipcosy States", "DQF-COSY (States)", shortDescription, [], preamble, pulprog, 1, false);
export default mod;
// vim: syntax=bruker:
