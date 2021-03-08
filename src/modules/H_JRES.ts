// vim: syntax=bruker:

import NOAHModule from "../moduleSpec.js";

let shortDescription = `; 1H magnitude-mode 2D J spectrum
;     [set TD1 and SW(Hz) as cnst37 and cnst38 respectively]`;

let preamble = `
"p2      = p1*2"
"d11     = 3u"                         ; JRES t1
"in11    = (1/cnst38)/2"               ; JRES increment
`

let module = `
  ; 2D J spectrum, magnitude mode

  (p1 ph0):f1
  d11
  (p2 ph14):f1
  d11
  goscnp ph26
`

const mod = new NOAHModule(
    "H",
    "Jqf",
    "noah_jres QF",
    shortDescription,
    preamble,
    module
);
export default mod;
