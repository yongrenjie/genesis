import { Kupce2017ACIE } from "../citation.js";
import NOAHModule from "../noahModule.js";
let shortDescription = `; 13C sensitivity-enhanced HSQC
;     [use -DEDIT for multiplicity editing]`;
let preamble = `
"p2      = p1*2"                       ; 1H hard 180
"d2      = 0.5s/cnst2"                 ; JCOMP
"d4      = 0.25s/cnst2"                ; 13C INEPT
"d0      = 3u"                         ; 13C HSQC t1
"in0     = inf1/2"                     ; 13C HSQC increment
define delay DC_SEHSQC_OR1
define delay DC_SEHSQC_OR2
define delay DC_SEHSQC_OR3
define delay DC_SEHSQC_OR4
define delay DC_SEHSQC_OR5
define delay DC_SEHSQC_OR6
define delay DC_SEHSQC_OR7
"DC_SEHSQC_OR1 = d4-larger(p2,p14)/2"          ; INEPT
"DC_SEHSQC_OR2 = d2-p16-d16-p2-d0*2-p3*2/PI"   ; 13C editing period
"DC_SEHSQC_OR3 = d2-p2+p3*2/PI"                ; 13C editing period
"DC_SEHSQC_OR4 = p16+d16+p2+d0*2-4u"           ; 13C post-t1, if no editing
"DC_SEHSQC_OR5 = d6-cnst17*p24/2-p19-d16"      ; first spin echo after t1
"DC_SEHSQC_OR6 = d4-larger(p2,p14)/2-p16-d16"  ; second spin echo after t1
"DC_SEHSQC_OR7 = p16+d16-p1*0.78+de+8u"        ; final spin echo for refocusing gradient
"cnst43  = sfo2/sfo1"                  ; gradient ratio
define list<gradient> GC_SEHSQC_OR={cnst43}
`;
let pulprog = `
  ; 13C-1H seHSQC

  ; forward INEPT
  (p1 ph0):f1
  DC_SEHSQC_OR1
  4u
  (center (p2 ph0):f1 (p14:sp3 ph0):f2 )
  4u
  DC_SEHSQC_OR1 pl2:f2
  4u
  (p1 ph1):f1 (p3 ph5):f2

  ; t1 evolution
  d0
  (p2 ph7):f1
  d0

  ; optional multiplicity editing
  ; edited part from hsqcedetgpsisp2.3
  ; nonedited part from hsqcetgpsisp2.2
#ifdef EDIT
  p16:gp4*EA
  d16
  DC_SEHSQC_OR2
  (p31:sp18 ph0):f2
  (p2 ph0):f1
  DC_SEHSQC_OR3
  4u
  (p31:sp18 ph0):f2
  2u
  2u pl2:f2
#else
  p16:gp4*EA
  d16
  (p24:sp7 ph0):f2
  4u
  DC_SEHSQC_OR4 pl2:f2
#endif /* EDIT */

  ; reverse INEPT for first component
  (center (p1 ph0):f1 (p3 ph7):f2 )
  p19:gp6
  d16
  DC_SEHSQC_OR5
  (center (p2 ph0):f1 (p24:sp7 ph0):f2 )
  DC_SEHSQC_OR5
  p19:gp6
  d16 pl2:f2
#ifdef EDIT
  (center (p1 ph1):f1 (p3 ph10):f2 )
#else
  (center (p1 ph1):f1 (p3 ph9):f2 )
#endif /* EDIT */

  ; reverse INEPT for second component
  p16:gp7
  d16
  DC_SEHSQC_OR6
  (center (p2 ph0):f1 (p14:sp3 ph0):f2 )
  DC_SEHSQC_OR6
  p16:gp7
  d16
  (p1 ph0):f1

  ; spin echo for refocusing gradient
  DC_SEHSQC_OR7
  (p2 ph0):f1
  4u
  p16:gp4*GC_SEHSQC_OR
  d16 pl12:f2
  4u
  goscnp ph30 cpd2:f2   ; acquire 13C HSQC
  50u do:f2
`;
const mod = new NOAHModule("c13", "Sp", [Kupce2017ACIE], "noah_hsqc", shortDescription, preamble, pulprog);
export default mod;
// vim: syntax=bruker:
