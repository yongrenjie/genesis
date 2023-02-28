import { AF_NLP3 } from "../acquFlag.js";
import NOAHModule from "../noahModule.js";
let shortDescription = `; interleaved 15N HMBC (QF) with two different nJ(NH)`;
let preamble = `
"p2     = p1*2"                       ; 1H hard 180
"p22    = p21*2"                      ; 15N hard 180
"d4     = 0.25s/cnst2"                ; 13C INEPT
"d20    = 3u"                         ; 15N interleaved QF HMBC t1/2
"in20   = 1000000/(2*cnst40*sfo3)"    ; 15N interleaved QF HMBC increment: cnst40 = SW(15N)
"p17    = p16*cnst16"                 ; Longer gradients for 15N module
"D[ID]a = (0.5s/cnst23)-p16-d16-4u"   ; HMBC evolution 1
"D[ID]b = (0.5s/cnst24)-p16-d16-4u"   ; HMBC evolution 2
`;
let pulprog = `
  ; 15N-1H HMBC

  ; zz-filter
  |CZZF|

  ; low-pass J-filter
  |NLPJF|

  ; nJ(NH) evolution
if "l1 % 2 == 0" {
  D[ID]a
}
else {
  D[ID]b
}
  ; coherence transfer to 13C and t1
  (p21 ph12):f3
  d20
  p16:gp25
  d16
  (p2 ph11):f1
  d20
  p16:gp26
  d16
  (p21 ph0):f3
  4u
  p16:gp27
  d16
  4u
  goscnp ph26
`;
const mod = new NOAHModule("N_HMBC_CFQDD", "hmbc", "BnqfBnqf", [], "noah_nhmbc QF noah_nhmbc QF", shortDescription, [AF_NLP3], preamble, pulprog, 1, true);
export default mod;
// vim: syntax=bruker:
