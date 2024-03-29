import { Kupce2018CC } from "../citation.js";
import { AF_LP3 } from "../acquFlag.js";
import NOAHModule from "../noahModule.js";

let shortDescription = `; 13C interleaved 2x HMBC (with different nJCH evolution delays)`;

let preamble = `
"p2     = p1*2"                       ; 1H hard 180
"d3     = 3u"                         ; 13C interleaved t1
"d4     = 0.25s/cnst2"                ; 13C INEPT
"in3    = inf1/2"                     ; 13C interleaved increment
"D[ID]a = (0.5s/cnst13)-p16-d16-4u"
"D[ID]b = (0.5s/cnst14)-p16-d16-4u"
"D[ID]c = p16+d16+p2/2+d3-p3*2/PI+4u"
"cnst41 = 2*sfo2/sfo1"                ; gradient ratio
define list<gradient> G[ID]={cnst41}
`

let pulprog = `
  ; 13C-1H HMBC

  ; zz-filter
  |CZZF|

  ; low-pass J-filter
  |LPJF|

  ; nJCH evolution
if "l1 % 2 == 0" {
  D[ID]a
}
else {
  D[ID]b
}
  ; coherence transfer to 13C and t1
  (p3 ph7):f2
  D[ID]c
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
  D[ID]c pl2:f2
  (p3 ph18):f2
  (p2 ph0):f1
  4u
  p16:gp1*EA_TS*G[ID]
  d16
  4u
  goscnp ph24
`

const mod = new NOAHModule(
    "C_HMBC_CFDD",
    "hmbc",
    "B B",
    [Kupce2018CC],
    "noah_hmbc noah_hmbc",
    "13C HMBC",
    shortDescription,
    [AF_LP3],
    preamble,
    pulprog,
    1,
    true
);
export default mod;

// vim: syntax=bruker:
