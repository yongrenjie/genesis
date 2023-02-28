import { Thiele2009CEJ } from "../citation.js";
import { AF_ES } from "../acquFlag.js";
import NOAHModule from "../noahModule.js";
let shortDescription = `; 1H ROESY with adiabatic spin lock
;     [use "wvm -a" to generate spin lock pulses before running]`;
let preamble = `
"d10    = 3u"                         ; ROESY t1
"in10   = 2*dw"                       ; ROESY increment
"cnst51 = abs(cnst49-cnst50)*sfo1*1.732/2"                   ; rf amplitude for spin lock
"spw49  = plw1*(cnst51*4*p1/1000000)*(cnst51*4*p1/1000000)"  ; power level for spin lock
"spw50  = spw49"
`;
let pulprog = `
  ; ROESY with adiabatic spin lock

  (p1 ph6):f1
  d10
  (p1 ph0):f1
  10u
  (p50:sp49 ph0):f1
  (p50:sp50 ph0):f1
  10u 
  p16:gp11
  d16 pl1:f1
  (p1 ph0):f1
  |SOLVSUPP|

  goscnp ph26
`;
const mod = new NOAHModule("H_ROESY_AD", "h1", "Rad", [Thiele2009CEJ], "noah_roesy States", "Adiabatic ROESY (States)", shortDescription, [AF_ES], preamble, pulprog, 1, false);
export default mod;
// vim: syntax=bruker:
