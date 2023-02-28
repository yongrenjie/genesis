import NOAHModule from "../noahModule.js";
let shortDescription = `; 1H magnitude-mode 2D J spectrum
;     [set TD1 and SW(Hz) as cnst37 and cnst38 respectively]`;
let preamble = `
"p2   = p1*2"
"d17  = 3u"                         ; JRES t1
"in17 = (1/cnst38)/2"               ; JRES increment
`;
let pulprog = `
  ; 2D J spectrum, magnitude mode

  (p1 ph0):f1
  d17
  (p2 ph14):f1
  d17
  goscnp ph26
`;
const mod = new NOAHModule("H_JRES", "h1", "Jqf", [], "noah_jres QF", shortDescription, [], preamble, pulprog, 1, false);
export default mod;
// vim: syntax=bruker:
