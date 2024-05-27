import { AF_NLP3 } from "../acquFlag.js";
import NOAHModule from "../noahModule.js";
let shortDescription = `; 15N HMBC (QF)`;
let preamble = `
"p2     = p1*2"                       ; 1H hard 180
"p22    = p21*2"                      ; 15N hard 180
"d4     = 0.25s/cnst2"                ; 13C INEPT
"d25    = 3u"                         ; 15N QF HMBC t1/2
"in25   = 1000000/(2*cnst40*sfo3)"    ; 15N QF HMBC increment: cnst40 = SW(15N)
"p17    = p16*cnst16"                 ; Longer gradients for 15N module
"D[ID]a = (0.5s/cnst23)-p16-d16-4u"
`;
let pulprog = `
  ; 15N-1H HMBC

  ; zz-filter
  |CZZF|

  ; low-pass J-filter
  |NLPJF|

  ; nJ(CH) evolution
  D[ID]a
  ; coherence transfer to 13C and t1
  (p21 ph12):f3
  d25
  p16:gp25
  d16
  (p2 ph11):f1
  d25
  p16:gp26
  d16
  (p21 ph0):f3
  4u
  p16:gp27
  d16
  4u
  goscnp ph26
`;
const mod = new NOAHModule("N_HMBC_CFQF", "hmbc", "Bnqf", [], "noah_nhmbc QF", shortDescription, [AF_NLP3], preamble, pulprog, 1, false);
export default mod;
// vim: syntax=bruker:
