import { Kupce2017ACIE, Foroozandeh2014ACIE } from "../citation.js";
import NOAHModule from "../noahModule.js";

let shortDescription = `; 1H 1D PSYCHE pure shift spectrum
;     [set TD1 and SW(Hz) as cnst37 and cnst38 respectively]`;

let preamble = `
define delay D[ID]a
define delay D[ID]b
"p2     = p1*2"
"d11    = 3u"                         ; PSYCHE t1
"in11   = trunc(1000000/(cnst38*dw*2))*dw/1000000"           ; PSYCHE increment
"p40    = 30m"                                               ; PSYCHE saltire duration
"cnst21 = (cnst20/360)*sqrt((2*10000)/(0.03/2))"             ; PSYCHE saltire RF amplitude
"spw40  = plw1*(cnst21/(250000/p1))*(cnst21/(250000/p1))"    ; PSYCHE saltire power level
"D[ID]a = in11/2-p16-d16-50u"
"D[ID]b = (dw*2*cnst22)+d16+50u"
`

let pulprog = `
  ; 1H 1D PSYCHE pure shift spectrum

  (p1 ph0):f1
  d11
  D[ID]a
  50u
  p16:gp17
  d16
  (p2 ph0):f1
  50u
  p16:gp17
  d16
  D[ID]a
  p16:gp18
  d16
  10u
  D[ID]b
  ( center (p40:sp40 ph14):f1 (p40:gp14) )
  d16
  10u pl1:f1
  p16:gp18
  d16
  50u
  d11
  goscnp ph26
`

const mod = new NOAHModule(
    "h1",
    "P",
    [Kupce2017ACIE, Foroozandeh2014ACIE],
    "noah_psyche",
    shortDescription,
    preamble,
    pulprog,
    1,
    false
);
export default mod;

// vim: syntax=bruker:
