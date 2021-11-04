import { Kupce2017ACIE } from "../citation.js";
import NOAHModule from "../noahModule.js";

let shortDescription = `; 1H COSY and NOESY (States F1)
;     [use -DPRESAT for presaturation during NOE mixing time (and d1)]`;

let preamble = `
"d10    = 3u"                         ; COSY/NOESY t1
"in10   = 2*dw"                       ; COSY/NOESY increment
define delay D[ID]a
"D[ID]a = d8-de-aq-p16-d16-p32-60u"     ; NOE mixing time
`

let pulprog = `
  ; 1H-1H COSY + NOESY (States)

  ; COSY
  (p1 ph6):f1
  d10
  (p1 ph0):f1
  4u
  goscnp ph26  ; acquire H-H COSY

  ; NOESY
  4u
  10u gron12
  (p32:sp29 ph0):f1
  20u groff
  p16:gp11
  d16 pl1:f1
#ifdef PRESAT
  4u pl9:f1
  D[ID]a cw:f1   ; NOE mixing time with presat
  4u do:f1
  4u pl1:f1
  10u st
#else
  D[ID]a        ; NOE mixing time
  22u st
#endif  /* PRESAT */
  (p1 ph0):f1
  goscnp ph26  ; acquire H-H NOESY
`

const mod = new NOAHModule(
    "h1",
    "CNst",
    [Kupce2017ACIE],
    "noah_cosy States:noah_noesy States",
    shortDescription,
    preamble,
    pulprog,
    2,
    false
);
export default mod;

// vim: syntax=bruker:
