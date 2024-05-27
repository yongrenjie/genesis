import { Kupce2017ACIE, Foroozandeh2015CC } from "../citation.js";
import NOAHModule from "../noahModule.js";
let shortDescription = `; 1H 1D TSE-PSYCHE pure shift spectrum
;     [set TD1 and SW(Hz) as cnst37 and cnst38 respectively]`;
let preamble = `
define delay DH_TSE_PSYCHE1
define delay DH_TSE_PSYCHE2
"p2      = p1*2"
"d11     = 3u"                         ; PSYCHE t1
"in11    = trunc(1000000/(cnst38*dw*2))*dw/1000000"           ; PSYCHE increment
"p40     = 30m"                                               ; PSYCHE saltire duration
"cnst21  = (cnst20/360)*sqrt((2*10000)/(0.03/2))"             ; PSYCHE saltire RF amplitude
"spw40   = plw1*(cnst21/(250000/p1))*(cnst21/(250000/p1))"    ; PSYCHE saltire power level
"DH_TSE_PSYCHE1  = in11/2"
"DH_TSE_PSYCHE2  = dw*2*cnst22"
`;
let pulprog = `
  ; 1H 1D TSE-PSYCHE pure shift spectrum

  (p1 ph0):f1
  DH_TSE_PSYCHE2
  DH_TSE_PSYCHE1
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
  DH_TSE_PSYCHE1
  d11
  p16:gp17
  d16
  10u
  d16
  ( center (p40:sp40 ph15):f1 (p40:gp14) )
  d16
  10u
  p16:gp17
  d16
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
const mod = new NOAHModule("h1", "Pt", [Kupce2017ACIE, Foroozandeh2015CC], "noah_psyche", shortDescription, preamble, pulprog);
export default mod;
// vim: syntax=bruker
