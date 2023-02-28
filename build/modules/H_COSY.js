import { AF_ES } from "../acquFlag.js";
import NOAHModule from "../noahModule.js";
let shortDescription = `; 1H echo-antiecho COSY`;
let preamble = `
"d10  = 3u"                         ; COSY t1
"in10 = 2*dw"                       ; COSY increment
`;
let pulprog = `
  ; 1H-1H COSY (EA)

  (p1 ph5):f1
  4u
  p16:gp5*EA
  d16
  d10
  (p1 ph0):f1
  4u
  p16:gp5
  d16
  |SOLVSUPP|
  goscnp ph31
`;
const mod = new NOAHModule("H_COSY", "h1", "C", [], "noah_cosy", "COSY", shortDescription, [AF_ES], preamble, pulprog, 1, false);
export default mod;
// vim: syntax=bruker:
