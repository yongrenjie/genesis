// vim: syntax=bruker:
import NOAHModule from "../noahModule.js";
let shortDescription = `; 1H 1D PSYCHE pure shift spectrum
;     [set TD1 and SW(Hz) as cnst37 and cnst38 respectively]`;
let preamble = `
define delay DH_PSYCHE1
define delay DH_PSYCHE2
"p2      = p1*2"
"d11     = 3u"                         ; PSYCHE t1
"in11    = trunc(1000000/(cnst38*dw*2))*dw/1000000"           ; PSYCHE increment
"cnst21  = 10000"                      ; PSYCHE bandwidth
"cnst22  = (cnst20/360)*sqrt((2*cnst21)/(p40/2000000))"       ; PSYCHE RF amplitude
"spw40   = plw1*(cnst22/(250000/p1))*(cnst22/(250000/p1))"    ; PSYCHE power level
"DH_PSYCHE1  = in11/2-p16-d16-50u"
"DH_PSYCHE2  = (dw*2*cnst24)+d16+50u"
`;
let pulprog = `
  ; 1H 1D PSYCHE pure shift spectrum

  (p1 ph0):f1
  d11
  DH_PSYCHE1
  50u
  p16:gp17
  d16
  (p2 ph0):f1
  50u
  p16:gp17
  d16
  DH_PSYCHE1
  p16:gp18
  d16
  10u
  DH_PSYCHE2
  ( center (p40:sp40 ph14):f1 (p40:gp14) )
  d16
  10u pl1:f1
  p16:gp18
  d16
  50u
  d11
  goscnp ph26
`;
const mod = new NOAHModule("h1", "P", "noah_psyche", shortDescription, preamble, pulprog);
export default mod;
