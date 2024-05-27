import { Kupce2017ACIE } from "../citation.js";
import { AF_ES } from "../acquFlag.js";
import NOAHModule from "../noahModule.js";
let shortDescription = `; 1H ROESY with 180(x),180(-x) spin lock`;
let preamble = `
"d10  = 3u"                         ; ROESY t1
"in10 = 2*dw"                       ; ROESY increment
"l7   = p15/(p25*2)"                ; ROESY spin lock loop counter
`;
let pulprog = `
  ; 1H-1H ROESY

  (p1 ph6):f1
  d10
  4u pl27:f1
7 (p25 ph7):f1
  (p25 ph8):f1
  lo to 7 times l7
  |SOLVSUPP|

  goscnp ph26
`;
const mod = new NOAHModule("h1", "R", [Kupce2017ACIE], "noah_roesy States", shortDescription, [AF_ES], preamble, pulprog, 1, false);
export default mod;
// vim: syntax=bruker:
