import { Kupce2017ACIE } from "../citation.js";
import NOAHModule from "../noahModule.js";
let shortDescription = `; 1H magnitude-mode COSY
;     [use -DES for pre-acquisition excitation sculpting]`;
let preamble = `
"d11  = 3u"                         ; COSY t1
"in11 = 2*dw"                       ; COSY increment
`;
let pulprog = `
  ; 1H-1H COSY, magnitude mode

  (p1 ph12):f1
  4u
  p16:gp5
  d16
  d11
  (p1 ph0):f1
  4u
  p16:gp5
  d16
  |SOLVSUPP|
  goscnp ph26
`;
const mod = new NOAHModule("h1", "Cqf", [Kupce2017ACIE], "noah_cosy QF", shortDescription, preamble, pulprog, 1, false);
export default mod;
// vim: syntax=bruker:
