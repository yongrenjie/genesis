import { Kupce2017ACIE } from "../citation.js";
import NOAHModule from "../noahModule.js";
let shortDescription = `; 1H interleaved TOCSY (mixing time: d9) + COSY
; 1H interleaved TOCSY (mixing time: d14) + ROESY`;
let preamble = `
"d13    = 3u"                         ; COSY/NOESY t1
"in13   = 2*dw"                       ; COSY/NOESY increment
"l11    = (d9/(p6*115.112))/2"        ; half the number of short TOCSY loops
"l12    = l11*2"                      ; number of short TOCSY loops
"l19    = (d14/(p6*115.112))/2"       ; half the number of long TOCSY loops
"l20    = l19*2"                      ; number of long TOCSY loops
"cnst51 = abs(cnst49-cnst50)*sfo1*1.732/2"                   ; rf amplitude for spin lock
"spw49  = plw1*(cnst51*4*p1/1000000)*(cnst51*4*p1/1000000)"  ; power level for spin lock
"spw50  = spw49"
`;
let pulprog = `
  ; 1H-1H TOCSY + TOCSY and COSY + ROESY (all States)

if "l1 % 2 == 0"
{
  ; TOCSY 2x
  (p1 ph20):f1
  d13
  (p1 ph0):f1
  4u pl10:f1

  |DIPSI|

  4u pl1:f1
  (p2 ph2):f1
  4u
  goscnp ph26  ; acquire H-H TOCSY number 1

  4u pl10:f1
  50u
  p16:gp0*1.7
  d16
  10u st

  |DIPSI|

  p16:gp0*1.33
  4u pl1:f1
  d16
  (p1 ph0):f1
}
else
{
  ; COSY
  (p1 ph20):f1
  d13
  (p1 ph0):f1
  4u
  goscnp ph26  ; acquire H-H COSY

  ; ROESY
  10u st
  10u gron12
  (p32:sp29 ph0):f1  ; ZQ suppression
  20u groff

  (p50:sp49 ph0):f1  ; ROESY mixing
  (p50:sp50 ph0):f1
  10u 
  p16:gp11
  d16 pl1:f1

  (p1 ph0):f1
}
  goscnp ph26  ; acquire H-H TOCSY number 2
`;
const mod = new NOAHModule("h1", "TT CR", [Kupce2017ACIE], "noah_tocsy States noah_cosy States:noah_tocsy States noah_roesy States", shortDescription, preamble, pulprog, 2, true);
export default mod;
// vim: syntax=bruker:
