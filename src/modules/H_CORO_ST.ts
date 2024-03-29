import { Thiele2009CEJ } from "../citation.js";
import { AF_NOZQS, AcquFlag } from "../acquFlag.js";
import NOAHModule from "../noahModule.js";

let shortDescription = `; 1H COSY and ROESY (States F1)`

let AF_ES_ROESYONLY = new AcquFlag("ES", "pre-acquisition excitation sculpting in ROESY");

let preamble = `
"d10    = 3u"                         ; COSY/ROESY t1
"in10   = 2*dw"                       ; COSY/ROESY increment
"cnst51 = abs(cnst49-cnst50)*sfo1*1.732/2"                   ; rf amplitude for spin lock
"spw49  = plw1*(cnst51*4*p1/1000000)*(cnst51*4*p1/1000000)"  ; power level for spin lock
"spw50  = spw49"
`

let pulprog = `
  ; 1H-1H COSY + ROESY (States)

  ; COSY
  (p1 ph6):f1
  d10
  (p1 ph0):f1
  goscnp ph26  ; acquire H-H COSY
  2m st

  ; ROESY
#ifdef NOZQS
#else
  10u gron12
  (p32:sp29 ph0):f1
  20u groff
  d16
#endif  /* NOZQS */
  (p50:sp49 ph0):f1  ; ROESY mixing
  (p50:sp50 ph0):f1
  4u
  p16:gp11
  d16 pl1:f1

  (p1 ph0):f1
  |SOLVSUPP|
  goscnp ph26  ; acquire H-H ROESY
`

const mod = new NOAHModule(
    "H_CORO_ST",
    "h1",
    "CRst",
    [Thiele2009CEJ],
    "noah_cosy States:noah_roesy States",
    "COSY (States):ROESY (States)",
    shortDescription,
    [AF_NOZQS, AF_ES_ROESYONLY],
    preamble,
    pulprog,
    2,
    false
);
export default mod;

// vim: syntax=bruker:
