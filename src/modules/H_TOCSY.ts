import { Kupce2017ACIE } from "../citation.js";
import NOAHModule from "../noahModule.js";

let shortDescription = `; 1H phase-sensitive TOCSY
;     [use -DZQS for zero-quantum suppression]
;     [use -DES for pre-acquisition excitation sculpting]`;

let preamble = `
"l11  = (d9/(p6*115.112))/2"        ; half the number of TOCSY loops
"l12  = l11*2"                      ; number of TOCSY loops
"d10  = 3u"                         ; TOCSY t1
"in10 = 2*dw"                       ; TOCSY increment
`

let pulprog = `
  ; 1H-1H TOCSY

  (p1 ph6):f1
  d10
  (p1 ph0):f1
#ifdef ZQS
  10u gron12
  (p32:sp29 ph0):f1
  20u groff
#else
  p16:gp11*0.65
#endif  /* ZQS */
  d16 pl10:f1

  |DIPSI|

  p16:gp11
  d16 pl1:f1
#ifdef ZQS
  10u gron12*1.333
  (p32*0.75:sp29 ph0):f1
  20u groff
  d16 pl1:f1
#else
#endif  /* ZQS */
  |SOLVSUPP|

  goscnp ph26
`

const mod = new NOAHModule(
    "h1",
    "T",
    [Kupce2017ACIE],
    "noah_tocsy States",
    shortDescription,
    preamble,
    pulprog,
    1,
    false
);
export default mod;

// vim: syntax=bruker:
