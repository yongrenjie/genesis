import { AF_PRESAT_NOE, AF_NOZQS, AF_ES } from "../acquFlag.js";
import NOAHModule from "../noahModule.js";
let shortDescription = `; 1H phase-sensitive NOESY`;
let preamble = `
"d10    = 3u"                         ; NOESY t1
"in10   = 2*dw"                       ; NOESY increment
"D[ID]a = d8-p32-p16-d16-38u"
"D[ID]b = d8-p16-d16-8u"
`;
let pulprog = `
  ; 1H-1H NOESY

  (p1 ph6):f1
  d10
  (p1 ph0):f1
#ifdef NOZQS
# ifdef PRESAT
  p16:gp11
  d16 pl9:f1
  D[ID]b cw:f1
  4u do:f1
# else  /* PRESAT not defined */
  p16:gp11
  d16
  D[ID]b
  4u
# endif  /* PRESAT */
#else   /* NOZQS not defined, i.e. run ZQS */
  10u gron12
  (p32:sp29 ph0):f1
  20u groff
  p16:gp11
# ifdef PRESAT
  d16 pl9:f1
  D[ID]a cw:f1
  4u do:f1
# else   /* PRESAT not defined */
  d16 pl1:f1
  D[ID]a
  4u
# endif  /* PRESAT */
#endif  /* NOZQS */
  4u pl1:f1
  (p1 ph0):f1
  |SOLVSUPP|

  goscnp ph26
`;
const mod = new NOAHModule("H_NOESY", "h1", "N", [], "noah_noesy States", "NOESY (States)", shortDescription, [AF_PRESAT_NOE, AF_NOZQS, AF_ES], preamble, pulprog, 1, false);
export default mod;
// vim: syntax=bruker:
