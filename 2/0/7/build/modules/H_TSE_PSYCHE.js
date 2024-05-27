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
"cnst21  = 10000"                      ; PSYCHE bandwidth
"cnst22  = (cnst20/360)*sqrt((2*cnst21)/(p40/2000000))"       ; PSYCHE RF amplitude
"spw40   = plw1*(cnst22/(250000/p1))*(cnst22/(250000/p1))"    ; PSYCHE power level
"cnst23  = sqrt((p41/1000000)*cnst21*5/(2*PI))/(p41/1000000)" ; PSYCHE ZQS chirp RF amplitude
"spw41   = plw1*(cnst23/(250000/p1))*(cnst23/(250000/p1))"    ; PSYCHE ZQS chirp RF amplitude
"spw42   = spw41"                      ; PSYCHE ZQS chirp power
"DH_TSE_PSYCHE1  = in11/2"
"DH_TSE_PSYCHE2  = dw*2*cnst24"
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
