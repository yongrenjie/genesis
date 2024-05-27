import { Kupce2017ACIE, Yong2021JMR } from "../citation.js";
import NOAHModule from "../noahModule.js";
let shortDescription = `; 13C HSQC-TOCSY
;     [use -DEDIT for multiplicity editing (not recommended)]
;     [use -DINVERT for inversion of TOCSY peaks]`;
let preamble = `
"p2      = p1*2"                       ; 1H hard 180
"d2      = 0.5s/cnst2"                 ; JCOMP
"d4      = 0.25s/cnst2"                ; 13C INEPT
"d0      = 3u"                         ; 13C t1
"in0     = inf1/2"                     ; 13C increment
define delay DC_HSQC_TOCSY1
define delay DC_HSQC_TOCSY2
define delay DC_HSQC_TOCSY3
define delay DC_HSQC_TOCSY4
define delay DC_HSQC_TOCSY5
define delay DC_HSQC_TOCSY6
define delay DC_HSQC_TOCSY7
define delay DC_HSQC_TOCSY8
define delay DC_HSQC_TOCSY9
"DC_HSQC_TOCSY1   = d4-p14/2"
"DC_HSQC_TOCSY2   = d4+p14/2"
"DC_HSQC_TOCSY3   = p16+d16+p2/2+d0-p3*2/PI+4u"
"DC_HSQC_TOCSY4   = d2+p3+p2/2"
"DC_HSQC_TOCSY5   = DC_HSQC_TOCSY3+p3-p2/2"
"DC_HSQC_TOCSY6   = d4+p14/2-p16-d16"
"DC_HSQC_TOCSY7   = d2-p14/2-p16-d16-4u"
"DC_HSQC_TOCSY8   = d2+p14/2-p16-d16-de"
"DC_HSQC_TOCSY9   = de+4u"
"cnst41  = 2*sfo2/sfo1"                ; gradient ratio
define list<gradient> GC_HSQC_TOCSY={cnst41}
`;
let pulprog = `
  ; 13C-1H HSQC-TOCSY

  ; INEPT
  (p1 ph0):f1
  DC_HSQC_TOCSY1
  (p14:sp3 ph0):f2
  (p2 ph0):f1
  DC_HSQC_TOCSY2 pl2:f2
  (p1 ph1):f1
  (p3 ph5):f2
  DC_HSQC_TOCSY3

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

  ; multiplicity editing
#ifdef EDIT
  DC_HSQC_TOCSY4
  (p31:sp18 ph0):f2
  DC_HSQC_TOCSY5
  (p2 ph1):f1
  d2 pl2:f2
#else
  (p14:sp3 ph0):f2
  DC_HSQC_TOCSY3 pl2:f2
#endif /* EDIT */

  ; reverse INEPT
  (p3 ph7):f2
  (p1 ph2):f1
  DC_HSQC_TOCSY1
  (p14:sp3 ph0):f2
  (p2 ph1):f1

  p16:gp13
  d16
  DC_HSQC_TOCSY6 pl10:f1

  |DIPSI|
  4u
  p16:gp13*-1
  d16 pl1:f1

#ifdef INVERT
  DC_HSQC_TOCSY7
  (p14:sp3 ph0):f2 
  (p2 ph1):f1 
  p16:gp4*GC_HSQC_TOCSY*EA
  d16 pl12:f2 
  DC_HSQC_TOCSY8
#else
  DC_HSQC_TOCSY9
  (p2 ph1):f1
  4u
  p16:gp4*GC_HSQC_TOCSY*EA
  d16 pl12:f2
  4u
#endif /* INVERT */
  goscnp ph30 cpd2:f2   ; acquire 13C HSQC-TOCSY
  50u do:f2
`;
const mod = new NOAHModule("c13", "St", [Kupce2017ACIE, Yong2021JMR], "noah_hsqc", shortDescription, preamble, pulprog);
export default mod;
// vim: syntax=bruker:
