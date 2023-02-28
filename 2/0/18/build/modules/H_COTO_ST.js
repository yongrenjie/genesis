import { Kupce2017ACIE } from "../citation.js";
import NOAHModule from "../noahModule.js";
let shortDescription = `; 1H COSY + TOCSY (States F1)
;     [use -DNOZQS to skip zero-quantum suppression]
;     [use -DES for pre-acquisition excitation sculpting in TOCSY]`;
let preamble = `
"d10  = 3u"                         ; COSY/TOCSY t1
"in10 = 2*dw"                       ; COSY/TOCSY increment
`;
let pulprog = `
  ; 1H-1H COSY + TOCSY (States)

  ; COSY
  (p1 ph6):f1
  d10
  (p1 ph0):f1
  goscnp ph26  ; acquire H-H COSY
  10u st

  ; TOCSY
#ifdef NOZQS
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

  goscnp ph26  ; acquire H-H TOCSY
`;
const mod = new NOAHModule("h1", "CTst", [Kupce2017ACIE], "noah_cosy States:noah_tocsy States", shortDescription, preamble, pulprog, 2, false);
export default mod;
// vim: syntax=bruker:
