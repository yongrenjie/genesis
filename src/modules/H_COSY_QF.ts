// vim: syntax=bruker:

import NOAHModule from "../moduleSpec.js";

let shortDescription = `; 1H magnitude-mode COSY`;

let preamble = `
"d11     = 3u"                         ; COSY t1
"in11    = 2*dw"                       ; COSY increment
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
  4u
  goscnp ph26
`

const mod = new NOAHModule(
    "H",
    "Cqf",
    "noah_cosy QF",
    shortDescription,
    preamble,
    pulprog
);
export default mod;
