import { AF_NOZQS } from "../acquFlag.js";
import NOAHModule from "../noahModule.js";
let shortDescription = `; 1H COSY + TOCSY (echo/antiecho F1)`;
let preamble = `
"p2     = p1*2"                       ; 1H hard 180
"d10    = 3u"                         ; COSY/TOCSY t1
"in10   = 2*dw"                       ; COSY/TOCSY increment
"D[ID]a = p16+d16+4u-d10"
"D[ID]b = p16+d16"
`;
let pulprog = `
  ; 1H-1H COSY + TOCSY

  ; COSY
  (p1 ph5):f1
  D[ID]a
  (p2 ph0):f1
  4u
  p16:gp5
  d16
  d10
  (p1 ph0):f1
  4u
  p16:gp5*EA
  d16
  goscnp ph31    ; acquire H-H COSY
  2m st

  ; TOCSY
  4u
#ifdef NOZQS
#else
  10u gron12
  (p32:sp29 ph0):f1  ; ZQ suppression
  20u groff
#endif /* NOZQS */
  d16 pl10:f1

  |DIPSI|

  p16:gp11
  d16
  10u gron12*1.333
  (p32*0.75:sp29 ph0):f1  ; ZQ suppression
  20u groff
  d16 pl1:f1
  4u

  (p1 ph0):f1
  D[ID]b
  de
  4u
  (p2 ph7):f1
  4u
  p16:gp5*EA
  d16

  goscnp ph31
`;
const mod = new NOAHModule("H_COTO", "h1", "CT", [], "noah_cosy:noah_tocsy", shortDescription, [AF_NOZQS], preamble, pulprog, 2, false);
export default mod;
// vim: syntax=bruker:
