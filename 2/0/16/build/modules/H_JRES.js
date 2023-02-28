import { Kupce2017ACIE } from "../citation.js";
import NOAHModule from "../noahModule.js";
let shortDescription = `; 1H magnitude-mode 2D J spectrum
;     [set TD1 and SW(Hz) as cnst37 and cnst38 respectively]`;
let preamble = `
"p2   = p1*2"
"d11  = 3u"                         ; JRES t1
"in11 = (1/cnst38)/2"               ; JRES increment
`;
let pulprog = `
  ; 2D J spectrum, magnitude mode

  (p1 ph0):f1
  d11
  (p2 ph14):f1
  d11
  goscnp ph26
`;
const mod = new NOAHModule("h1", "Jqf", [Kupce2017ACIE], "noah_jres QF", shortDescription, preamble, pulprog, 1, false);
export default mod;
// vim: syntax=bruker:
