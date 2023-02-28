import { AF_PRESAT_NOE, AF_NOZQS } from "../acquFlag.js";
import NOAHModule from "../noahModule.js";
let shortDescription = `; 1H COSY and NOESY (echo/antiecho F1)`;
let preamble = `
"p2     = p1*2"                       ; 1H hard 180
"d10    = 3u"                         ; COSY/NOESY t1
"in10   = 2*dw"                       ; COSY/NOESY increment
"D[ID]a = p16+d16+4u-d10"
"D[ID]b = d8-p16-d16-de-aq-p16-d16-30u"        ; NOE mixing time (without ZQS)
"D[ID]c = d8-p16-d16-de-aq-p16-d16-p32-60u"    ; NOE mixing time
"D[ID]d = p16+d16"
`;
let pulprog = `
  ; 1H-1H COSY + NOESY

  ; COSY
  (p1 ph5)
  D[ID]a
  (p2 ph0)
  4u
  p16:gp5
  d16
  d10
  (p1 ph0)
  4u
  p16:gp5*EA
  d16
  goscnp ph31    ; acquire H-H COSY

  ; NOESY
  4u
#ifdef NOZQS
#else
  10u gron12
  (p32:sp29 ph0):f1  ; ZQ suppression
  20u groff
#endif
  p16:gp11
  d16 pl1:f1
#ifdef PRESAT
  4u pl9:f1
# ifdef NOZQS
  D[ID]b cw:f1  ; presat, no ZQS
  4u do:f1
# else
  D[ID]c cw:f1  ; presat, ZQS
  4u do:f1
# endif
#else
# ifdef NOZQS
  D[ID]b        ; no presat, no ZQS
  4u
# else
  D[ID]c        ; presat, ZQS
  4u
# endif
#endif  /* PRESAT */

  4u pl1:f1
  2m st
  (p1 ph7):f1
  D[ID]d
  de
  4u
  (p2 ph7):f1
  4u
  p16:gp5*EA
  d16
  goscnp ph30    ; acquire H-H NOESY
`;
const mod = new NOAHModule("H_CONO", "h1", "CN", [], "noah_cosy:noah_noesy", shortDescription, [AF_PRESAT_NOE, AF_NOZQS], preamble, pulprog, 2, false);
export default mod;
// vim: syntax=bruker:
