import { Foroozandeh2014ACIE, Moutzouri2017CC } from "../citation.js";
import { AF_ES } from "../acquFlag.js";
import NOAHModule from "../noahModule.js";
let shortDescription = `; 1H 1D PSYCHE pure shift spectrum with SAPPHIRE averaging
;     [set TD1 and SW(Hz) as cnst37 and cnst38 respectively]`;
let preamble = `
"p2     = p1*2"
"d17    = 3u"                         ; PSYCHE t1
"in17   = trunc(0.5+(1000000/(cnst38*dw*2*((td1/nbl)/cnst37))))*dw*((td1/nbl)/cnst37)/1000000"  ; PSYCHE increment
"p40    = 30m"                                               ; PSYCHE saltire duration
"cnst21 = (cnst20/360)*sqrt((2*10000)/(0.03/2))"             ; PSYCHE saltire RF amplitude
"spw40  = plw1*(cnst21/(250000/p1))*(cnst21/(250000/p1))"    ; PSYCHE saltire power level
"D[ID]a = 0"              ; Delta tau_J in original paper, set at runtime
"D[ID]b = 0"              ; tau_1 in original paper, set at runtime
"D[ID]c = 0"              ; tau_2 in original paper, set at runtime
"D[ID]d = 0"              ; tau_3 in original paper, set at runtime
"D[ID]e = (dw*2*cnst22)"  ; delay for drop points
"D[ID]f = d17"            ; half of t1, set at runtime
"D[ID]g = p12+4u"         ; delay to balance J-evolution during ES pulses
`;
let pulprog = `
  ; 1H 1D PSYCHE pure shift spectrum
  ; with SAPPHIRE averaging

  ; Recalculate delays before running experiment
  "D[ID]a = 2 * in17 * (l1 % (l0/cnst37)) / (l0/cnst37)"
if "l3 == 0"
{
  ; first chunk
  "D[ID]b = max(0, (in17/2)-(D[ID]a/2))"  ; tau_1
  "D[ID]d = max(0, (D[ID]a/2)-(in17/2))"  ; tau_3
  "D[ID]c = (in17/2)-abs(D[ID]b-D[ID]d)"  ; tau_2
  "D[ID]f = d17"                          ; t1/2
}
else
{
  ; other chunks
  "D[ID]b = in17/2"            ; tau_1
  "D[ID]d = 0"                 ; tau_3
  "D[ID]f = d17-(D[ID]a/2)"    ; tau_2
  "D[ID]c = D[ID]a/2"          ; t1/2
}

  (p1 ph0):f1

  ; first spin echo
  D[ID]b
  p16:gp16
  d16
#ifdef ES
  (p12:sp1 ph0):f1
  4u pl1:f1
#endif /* ES */
  (p2 ph0):f1
  p16:gp16
  d16
  D[ID]b

  D[ID]f     ; t1/2

  ; second spin echo
  D[ID]c
  p16:gp17
  d16
  d16  ; to balance delays on either side
#ifdef ES
  (p12:sp1 ph0):f1
  4u pl1:f1
#endif /* ES */
  ( center (p40:sp40 ph14):f1 (p40:gp14) )
  d16 pl1:f1
  p16:gp17
  d16
  D[ID]c

  D[ID]e     ; delay for drop points

  ; third spin echo
  D[ID]d
#ifdef ES
  D[ID]g
#endif /* ES */
  p16:gp18
  d16
  (p2 ph0):f1
  p16:gp18
  d16
#ifdef ES
  D[ID]g
#endif /* ES */
  D[ID]d

  D[ID]f     ; t1/2
  goscnp ph26
`;
const mod = new NOAHModule("H_PSYCHE_SAP", "h1", "P", [Foroozandeh2014ACIE, Moutzouri2017CC], "noah_sapphire", shortDescription, [AF_ES], preamble, pulprog, 1, false);
export default mod;
// vim: syntax=bruker:
