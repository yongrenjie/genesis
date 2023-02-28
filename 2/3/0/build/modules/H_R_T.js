import { Thiele2009CEJ } from "../citation.js";
import NOAHModule from "../noahModule.js";
let shortDescription = `; 1H interleaved ROESY + TOCSY`;
let preamble = `
"d13    = 3u"                         ; ROESY t1
"in13   = 2*dw"                       ; ROESY increment
"cnst51 = abs(cnst49-cnst50)*sfo1*1.732/2"                   ; rf amplitude for spin lock
"spw49  = plw1*(cnst51*4*p1/1000000)*(cnst51*4*p1/1000000)"  ; power level for spin lock
"spw50  = spw49"
"l11    = (d9/(p6*115.112))/2"        ; half the number of TOCSY loops
"l12    = l11*2"                      ; number of TOCSY loops
`;
let pulprog = `
  ; 1H interleaved ROESY / TOCSY
  (p1 ph20):f1
  d13
  (p1 ph0):f1

if "l1 % 2 == 0"
{
  10u
  (p50:sp49 ph0):f1
  (p50:sp50 ph0):f1
  10u 
  p16:gp11
  d16 pl1:f1
}
else
{
  10u gron12
  (p32:sp29 ph0):f1
  20u groff
  d16 pl10:f1

  |DIPSI|

  p16:gp11
  d16
  10u gron12*1.333
  (p32*0.75:sp29 ph0):f1
  20u groff
  d16 pl1:f1
  4u
}
  (p1 ph0):f1
  goscnp ph26
`;
const mod = new NOAHModule("H_R_T", "h1", "R T", [Thiele2009CEJ], "noah_roesy States noah_tocsy States", "ROESY (States)/TOCSY (States)", shortDescription, [], preamble, pulprog, 1, true);
export default mod;
// vim: syntax=bruker:
