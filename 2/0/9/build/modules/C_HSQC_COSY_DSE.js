import { Kupce2017ACIE } from "../citation.js";
import NOAHModule from "../noahModule.js";
let shortDescription = `; 13C HSQC-COSY (2 spin echoes)
;     [use -DEDIT for multiplicity editing (not recommended)]`;
let preamble = `
"p2      = p1*2"                       ; 1H hard 180
"d2      = 0.5s/cnst2"                 ; JCOMP
"d4      = 0.25s/cnst2"                ; 13C INEPT
"d12     = 0.25s/cnst12"               ; COSY mixing (< 1/4J(HH))
"d0      = 3u"                         ; 13C HSQC t1
"in0     = inf1/2"                     ; 13C HSQC increment
define delay DC_HSQCC_DSE1
define delay DC_HSQCC_DSE2
define delay DC_HSQCC_DSE3
define delay DC_HSQCC_DSE4
define delay DC_HSQCC_DSE5
define delay DC_HSQCC_DSE6
define delay DC_HSQCC_DSE7
define delay DC_HSQCC_DSE8
define delay DC_HSQCC_DSE9
"DC_HSQCC_DSE1    = d4-p14/2"
"DC_HSQCC_DSE2    = d4+p14/2"
"DC_HSQCC_DSE3    = p16+d16+p2/2+d0-p3*2/PI+4u"
"DC_HSQCC_DSE4    = d2+p3+p2/2"
"DC_HSQCC_DSE5    = DC_HSQCC_DSE3+p3-p2/2"
"DC_HSQCC_DSE6    = d4-p14/2"
"DC_HSQCC_DSE7    = d12-d4-p14/2"
"DC_HSQCC_DSE8    = d2-p31/2"
"DC_HSQCC_DSE9    = d2+p31/2-p16-d16-p3-4u-de"
"cnst41  = 2*sfo2/sfo1"                ; gradient ratio
define list<gradient> GC_HSQCC_DSE={cnst41}
`;
let pulprog = `
  ; 13C-1H HSQC-COSY

  ; INEPT
  (p1 ph0):f1
  DC_HSQCC_DSE1
  (p14:sp3 ph0):f2
  (p2 ph0):f1
  DC_HSQCC_DSE2 pl2:f2
  (p1 ph1):f1
  (p3 ph5):f2
  DC_HSQCC_DSE3

  ; t1 period
#ifdef EDIT
  (p31:sp18 ph0):f2
#else
  (p14:sp3 ph0):f2
#endif /* EDIT */
  4u
  p16:gp4
  d16
  d0
  (p2 ph11):f1
  d0
  4u
  p16:gp4
  d16

  ; multiplicity editing (not recommended)
#ifdef EDIT
  DC_HSQCC_DSE4
  (p31:sp18 ph0):f2
  DC_HSQCC_DSE5
  (p2 ph1):f1
  d2 pl2:f2
#else
  (p14:sp3 ph0):f2
  DC_HSQCC_DSE3 pl2:f2
#endif /* EDIT */

  ; reverse INEPT
  (p3 ph7):f2
  (p1 ph1):f1
  DC_HSQCC_DSE6  ; d4-p14/2
  (p14:sp3 ph0):f2
  DC_HSQCC_DSE7  ; d12-d4-p14/2
  (p2 ph1):f1
  d12
  (p1 ph1):f1
  DC_HSQCC_DSE8 ; d2-p31/2
  (p31:sp18 ph0):f2
  (p2 ph1):f1
  DC_HSQCC_DSE9 pl2:f2 ; d2+p31/2-(...)
  p16:gp4*GC_HSQCC_DSE*EA
  d16
  (p3 ph0):f2
  4u pl12:f2
  goscnp ph30 cpd2:f2   ; acquire 13C HSQC-COSY
  50u do:f2
`;
const mod = new NOAHModule("c13", "Qdse", [Kupce2017ACIE], "noah_hsqc", shortDescription, preamble, pulprog);
export default mod;
// vim: syntax=bruker:
