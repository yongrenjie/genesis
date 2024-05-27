import { Kupce2017ACIE } from "../citation.js";
import NOAHModule from "../noahModule.js";
let shortDescription = `; 1H echo-antiecho COSY
;     [use -DES for pre-acquisition excitation sculpting]`;
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
const mod = new NOAHModule("h1", "C", [Kupce2017ACIE], "noah_cosy", shortDescription, preamble, pulprog, 1, false);
export default mod;
// vim: syntax=bruker:
