import { Kupce2017ACIE, Foroozandeh2014ACIE } from "../citation.js";
import NOAHModule from "../noahModule.js";
let shortDescription = `; 1H 1D PSYCHE pure shift spectrum
;     [set TD1 and SW(Hz) as cnst37 and cnst38 respectively]
;     [use -DES for excitation sculpting]`;
let preamble = `
define delay D[ID]a
define delay D[ID]b
define delay D[ID]c
"p2     = p1*2"
"d11    = 3u"                         ; PSYCHE t1
"in11   = trunc(0.5+(1000000/(cnst38*dw*2)))*dw/1000000"     ; PSYCHE increment
"p40    = 30m"                                               ; PSYCHE saltire duration
"cnst21 = (cnst20/360)*sqrt((2*10000)/(0.03/2))"             ; PSYCHE saltire RF amplitude
"spw40  = plw1*(cnst21/(250000/p1))*(cnst21/(250000/p1))"    ; PSYCHE saltire power level
"D[ID]a = in11/2-p16-d16"          ; = tauA in original pulprog
"D[ID]b = D[ID]a-p12-4u"           ; = tauA when excitation sculpting is on
"D[ID]c = (dw*2*cnst22)+d16+50u"   ; = tauB in original pulprog
`;
let pulprog = `
  ; 1H 1D PSYCHE pure shift spectrum

  (p1 ph0):f1
  d11

#ifdef ES
  D[ID]b
  p16:gp17
  d16
  (p12:sp1 ph0):f1
  4u pl1:f1
  (p2 ph0):f1
  p16:gp17
  d16
  D[ID]b
#else
  D[ID]a
  p16:gp17
  d16
  (p2 ph0):f1
  p16:gp17
  d16
  D[ID]a
#endif /* ES */

  p16:gp18
  d16
  10u
  D[ID]c
#ifdef ES
  (p12:sp1 ph0):f1
  4u
#endif /* ES */
  ( center (p40:sp40 ph14):f1 (p40:gp14) )
  d16
  10u pl1:f1
  p16:gp18
  d16
  50u
  d11
  goscnp ph26
`;
const mod = new NOAHModule("h1", "P", [Kupce2017ACIE, Foroozandeh2014ACIE], "noah_psyche", shortDescription, preamble, pulprog, 1, false);
export default mod;
// vim: syntax=bruker:
