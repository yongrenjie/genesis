import { Kupce2017ACIE } from "../citation.js";
import NOAHModule from "../noahModule.js";
let shortDescription = "; 1H COSY and NOESY (echo/antiecho F1)";
let preamble = `
"d10    = 3u"                         ; COSY/NOESY t1
"in10   = 2*dw"                       ; COSY/NOESY increment
define delay D[ID]a
define delay D[ID]b
define delay D[ID]c
"D[ID]a = p16+d16+4u-d10"
"D[ID]b = d8-4u-p16-d16-de-aq-4u-p16-d16-p32-30u"     ; NOE mixing time
"D[ID]c = p16+d16"
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
  10u gron12
  (p32:sp29 ph0):f1  ; ZQ suppression
  20u groff
  p16:gp11
  d16 pl1:f1
  D[ID]b st  ; NOE mixing time
  (p1 ph7):f1
  D[ID]c
  de
  4u
  (p2 ph7):f1
  4u
  p16:gp5*EA
  d16
  goscnp ph30    ; acquire phase sensitive H-H NOESY
`;
const mod = new NOAHModule("h1", "CN", [Kupce2017ACIE], "noah_cosy:noah_noesy", shortDescription, preamble, pulprog);
export default mod;
// vim: syntax=bruker:
