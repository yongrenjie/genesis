import { AF_ES, AF_NOZQS, AcquFlag } from "../acquFlag.js";
import NOAHModule from "../noahModule.js";

let shortDescription = `; 1H COSY + TOCSY (States F1), double solvent suppression (DO NOT USE)`

let preamble = `
"d10  = 3u"                         ; COSY/TOCSY t1
"in10 = 2*dw"                       ; COSY/TOCSY increment
`

let pulprog = `
  ; 1H-1H COSY + TOCSY (States)

  ; COSY
  (p1 ph6):f1
  d10
  (p1 ph0):f1
  |SOLVSUPP|
  goscnp ph26  ; acquire H-H COSY
  1m st

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
`

const mod = new NOAHModule(
    "H_COTO_STDS",
    "h1",
    "CTstds",
    [],
    "noah_cosy States:noah_tocsy States",
    shortDescription,
    [AF_NOZQS, AF_ES],
    preamble,
    pulprog,
    2,
    false
);
export default mod;

// vim: syntax=bruker:
