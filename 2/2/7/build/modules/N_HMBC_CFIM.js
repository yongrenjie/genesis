import { AF_NLP3 } from "../acquFlag.js";
import NOAHModule from "../noahModule.js";
let shortDescription = `; 15N IMPEACH-MBC (unrefocused)`;
let preamble = `
"p2     = p1*2"                       ; 1H hard 180
"p22    = p21*2"                      ; 15N hard 180
"d4     = 0.25s/cnst2"                ; 13C INEPT
"d20    = 3u"                         ; 15N HMBC t1/2
"in20   = 1000000/(2*cnst40*sfo3)"    ; 15N HMBC increment: cnst40 = SW(15N)
"d21    = 0.5s/cnst28"                ; decremented delay 15N IMPEACH-MBC
"d22    = 4u"                         ; incremented delay 15N IMPEACH-MBC
"in21   = ((0.5s/cnst28)-(0.5s/cnst29))/((td1/nbl)/2)"
"in22   = in21/2"
"p17    = p16*cnst16"                 ; Longer gradients for 15N module
"D[ID]a = 4u+p16+d16"
"D[ID]b = p16+d16+p2/2+d20-p21*2/PI+4u"
"cnst44 = 2*sfo3/sfo1"                ; gradient ratio
define list<gradient> G[ID]={cnst44}
`;
let pulprog = `
  ; 15N-1H IMPEACH-MBC

  ; zz-filter
  |CZZF|

  ; low-pass J-filter
  |NLPJF|

  ; accordion nJ(CH) evolution
  d22  ; incremented with t1
  (p22 ph0):f3
  D[ID]a
  d22  ; incremented with t1
  d21  ; decremented with t1
  
  ; coherence transfer to 13C and t1
  (p21 ph7):f3
  D[ID]b
  (p22 ph0):f3
  4u
  p17:gp1
  d16
  d20
  (p2 ph11):f1
  d20
  4u
  p17:gp1
  d16
  (p22 ph0):f3
  D[ID]b
  (p21 ph4):f3
  (p2 ph0):f1
  4u
  p17:gp1*EA*G[ID]
  d16
  4u
  goscnp ph29
`;
const mod = new NOAHModule("N_HMBC_CFIM", "hmbc", "In", [], "noah_nhmbc", shortDescription, [AF_NLP3], preamble, pulprog, 1, false);
export default mod;
// vim: syntax=bruker:
