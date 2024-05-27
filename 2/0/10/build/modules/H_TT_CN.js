import { Kupce2017ACIE } from "../citation.js";
import NOAHModule from "../noahModule.js";
let shortDescription = "; 1H interleaved TOCSY/TOCSY and COSY/NOESY (States F1)";
let preamble = `
"d13     = 3u"                         ; COSY/NOESY t1
"in13    = 2*dw"                       ; COSY/NOESY increment
"l11     = (d9/(p6*115.112))/2"        ; half the number of short TOCSY loops
"l12     = l11*2"                      ; number of short TOCSY loops
"l19     = (d14/(p6*115.112))/2"       ; half the number of long TOCSY loops
"l20     = l19*2"                      ; number of long TOCSY loops
define delay DH_TT_CN1
"DH_TT_CN1 = d8-4u-de-aq-4u-p16-d16-p32-30u"     ; NOE mixing time
`;
let pulprog = `
  ; 1H-1H TOCSY + TOCSY and COSY + NOESY (all States)

if "l1 % 2 == 0"
{
  ; TOCSY 2x
  (p1 ph20):f1
  d13
  (p1 ph0):f1
  4u pl10:f1

  |DIPSI|

  4u pl1:f1
  (p2 ph2):f1
  4u
  goscnp ph26  ; acquire H-H TOCSY number 1

  4u pl10:f1
  50u
  p16:gp0*1.7
  2m st

  |DIPSI|

  p16:gp0*1.33
  4u pl1:f1
  d16
  (p1 ph0):f1
}
else
{
  ; COSY
  (p1 ph20):f1
  d13
  (p1 ph0):f1
  4u
  GOSCNP ph26  ; acquire H-H COSY

  ; NOESY
  4u
  10u gron12
  (p32:sp29 ph0):f1
  20u groff
  p16:gp11
  d16 pl1:f1
  DH_TT_CN1 st  ; NOE mixing time
  (p1 ph0):f1
}
  goscnp ph26  ; acquire H-H TOCSY number 2
`;
const mod = new NOAHModule("h1", "TcTn", [Kupce2017ACIE], "noah_tocsy States noah_cosy States:noah_tocsy States noah_noesy States", shortDescription, preamble, pulprog);
export default mod;
// vim: syntax=bruker:
