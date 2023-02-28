import { Kupce2017ACIE, Kupce2018CC } from "../citation.js";
import NOAHModule from "../noahModule.js";
let shortDescription = `; 13C HMBC (interleaved for two different nJ(CH))`;
let preamble = `
"p2      = p1*2"                       ; 1H hard 180
"d2      = 0.5s/cnst2"                 ; JCOMP
"d3      = 3u"                         ; 13C interleaved t1
"d4      = 0.25s/cnst2"                ; 13C INEPT
"in3     = inf1/2"                     ; 13C interleaved increment
define delay DC_HMBC_CFDD1
define delay DC_HMBC_CFDD2
define delay DC_HMBC_CFDD3
define delay DC_HMBC_CFDD4
define delay DC_HMBC_CFDD5
define delay DC_HMBC_CFDD6
define delay DC_HMBC_CFDD7
"DC_HMBC_CFDD1   = d4-p14/2"
"DC_HMBC_CFDD2   = d4+p14/2"
"DC_HMBC_CFDD3   = (0.5s/cnst6)-p16-d16"
"DC_HMBC_CFDD4   = (0.5s/cnst7)-p16-d16"
"DC_HMBC_CFDD5   = (0.5s/cnst13)-p16-d16-4u"
"DC_HMBC_CFDD6   = (0.5s/cnst14)-p16-d16-4u"
"DC_HMBC_CFDD7   = p16+d16+p2/2+d3-p3*2/PI+4u"
"cnst41  = 2*sfo2/sfo1"                ; gradient ratio
define list<gradient> GC_HMBC_CFDD={cnst41}
`;
let pulprog = `
  ; 13C-1H HMBC

  ; zz-filter
  (p1 ph0):f1
  DC_HMBC_CFDD1
  (p14:sp3 ph0):f2
  (p2 ph0):f1
  DC_HMBC_CFDD2
  (p1 ph0):f1
  DC_HMBC_CFDD1
  (p14:sp3 ph0):f2
  (p2 ph0):f1
  DC_HMBC_CFDD2 pl2:f2

  ; second-order low-pass J-filter
  (lalign (p1 ph0):f1 (p3 ph7):f2 )
  DC_HMBC_CFDD3
  p16:gp10*-3
  d16
  (p3 ph7):f2
  DC_HMBC_CFDD4
  p16:gp10*2
  d16
  (p3 ph7):f2
  4u
  p16:gp10
  d16
  ; nJCH evolution
if "l1 % 2 == 0" {
  DC_HMBC_CFDD5
}
else {
  DC_HMBC_CFDD6
}

  ; coherence transfer to 13C and t1
  (p3 ph7):f2
  DC_HMBC_CFDD7
  (p14:sp3 ph0):f2
  4u
  p16:gp1
  d16
  d3
  (p2 ph11):f1
  d3
  4u
  p16:gp1
  d16
  (p14:sp3 ph0):f2
  DC_HMBC_CFDD7 pl2:f2
  (p3 ph18):f2
  (p2 ph0):f1
  4u
  p16:gp1*EA_TS*GC_HMBC_CFDD
  d16
  4u
  goscnp ph24
`;
const mod = new NOAHModule("hmbc", "Bb", [Kupce2017ACIE, Kupce2018CC], "noah_hmbc noah_hmbc", shortDescription, preamble, pulprog);
export default mod;
// vim: syntax=bruker:
