import { Kupce2017ACIE, Foroozandeh2015CC } from "../citation.js";
import { AF_ES } from "../acquFlag.js";
import NOAHModule from "../noahModule.js";
let shortDescription = `; 1H 1D TSE-PSYCHE pure shift spectrum
;     [set TD1 and SW(Hz) as cnst37 and cnst38 respectively]`;
let preamble = `
"p2     = p1*2"
"d11    = 3u"                         ; PSYCHE t1
"in11   = trunc(0.5+(1000000/(cnst38*dw*2)))*dw/1000000"     ; PSYCHE increment
"p40    = 30m"                                               ; PSYCHE saltire duration
"cnst21 = (cnst20/360)*sqrt((2*10000)/(0.03/2))"             ; PSYCHE saltire RF amplitude
"spw40  = plw1*(cnst21/(250000/p1))*(cnst21/(250000/p1))"    ; PSYCHE saltire power level
"D[ID]a = in11/2"       ; tauA from original pulse programme
"D[ID]b = D[ID]a-p12"   ; tauA with excitation sculpting
"D[ID]c = dw*2*cnst22"  ; tauB from original pulse programme
`;
let pulprog = `
  ; 1H 1D TSE-PSYCHE pure shift spectrum

  (p1 ph0):f1

  ; Spin echo with L2H chirp
#ifdef ES
  D[ID]b
  50u
  p16:gp16
  d16
  10u
  (p12:sp1 ph0):f1
  d16
  ( center (p41:sp41 ph7):f1 (p41:gp15) )
  d16
  60u
  p16:gp16
  d16
  D[ID]b
#else
  D[ID]a
  50u
  p16:gp16
  d16
  10u
  d16
  ( center (p41:sp41 ph7):f1 (p41:gp15) )
  d16
  60u
  p16:gp16
  d16
  D[ID]a
#endif  /* ES */

  d11
  ; Spin echo with JRE
  p16:gp17
  d16
  10u
#ifdef ES
  (p12:sp1 ph0):f1
#endif
  d16
  ( center (p40:sp40 ph15):f1 (p40:gp14) )
  d16
  10u
  p16:gp17
  d16

  D[ID]c
  ; Spin echo with H2L chirp
  p16:gp18
  d16
  60u
  d16
  ( center (p41:sp42 ph0):f1 (p41:gp15) )
  d16
  10u pl1:f1
  p16:gp18
  d16

  d11
  50u
  goscnp ph26
`;
const mod = new NOAHModule("h1", "Pt", [Kupce2017ACIE, Foroozandeh2015CC], "noah_psyche", shortDescription, [AF_ES], preamble, pulprog, 1, false);
export default mod;
// vim: syntax=bruker
