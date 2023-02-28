import { AF_NOZQS, AF_ES } from "../acquFlag.js";
import NOAHModule from "../noahModule.js";
let shortDescription = `; 1H phase-sensitive TOCSY`;
let preamble = `
"l11  = (d9/(p6*115.112))/2"        ; half the number of TOCSY loops
"l12  = l11*2"                      ; number of TOCSY loops
"d10  = 3u"                         ; TOCSY t1
"in10 = 2*dw"                       ; TOCSY increment
`;
let pulprog = `
  ; 1H-1H TOCSY

  (p1 ph6):f1
  d10
  (p1 ph0):f1
#ifdef NOZQS
  p16:gp11*0.65
#else
  10u gron12
  (p32:sp29 ph0):f1
  20u groff
#endif  /* NOZQS */
  d16 pl10:f1

  |DIPSI|

  p16:gp11
  d16 pl1:f1
#ifdef NOZQS
#else
  10u gron12*1.333
  (p32*0.75:sp29 ph0):f1
  20u groff
  d16 pl1:f1
#endif  /* NOZQS */
  (p1 ph0):f1
  |SOLVSUPP|

  goscnp ph26
`;
const mod = new NOAHModule("H_TOCSY", "h1", "T", [], "noah_tocsy States", shortDescription, [AF_NOZQS, AF_ES], preamble, pulprog, 1, false);
export default mod;
// vim: syntax=bruker:
