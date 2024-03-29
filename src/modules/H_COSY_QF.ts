import { AF_ES } from "../acquFlag.js";
import NOAHModule from "../noahModule.js";

let shortDescription = `; 1H magnitude-mode COSY`

let preamble = `
"d11  = 3u"                         ; COSY t1
"in11 = 2*dw"                       ; COSY increment
`

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
`

const mod = new NOAHModule(
    "H_COSY_QF",
    "h1",
    "Cqf",
    [],
    "noah_cosy QF",
    "COSY (QF)",
    shortDescription,
    [AF_ES],
    preamble,
    pulprog,
    1,
    false
);
export default mod;

// vim: syntax=bruker:
