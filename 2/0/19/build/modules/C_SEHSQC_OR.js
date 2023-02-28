import { Kupce2017ACIE } from "../citation.js";
import { AF_EDIT } from "../acquFlag.js";
import NOAHModule from "../noahModule.js";
let shortDescription = `; 13C sensitivity-enhanced HSQC`;
let preamble = `
"p2      = p1*2"                       ; 1H hard 180
"d2      = 0.5s/cnst2"                 ; JCOMP
"d4      = 0.25s/cnst2"                ; 13C INEPT
"d0      = 3u"                         ; 13C HSQC t1
"in0     = inf1/2"                     ; 13C HSQC increment
define delay D[ID]a
define delay D[ID]b
define delay D[ID]c
define delay D[ID]d
define delay D[ID]e
define delay D[ID]f
define delay D[ID]g
"D[ID]a = d4-larger(p2,p14)/2"          ; INEPT
"D[ID]b = d2-p16-d16-p2-d0*2-p3*2/PI"   ; 13C editing period
"D[ID]c = d2-p2+p3*2/PI"                ; 13C editing period
"D[ID]d = p16+d16+p2+d0*2-4u"           ; 13C post-t1, if no editing
"D[ID]e = d6-cnst17*p24/2-p19-d16"      ; first spin echo after t1
"D[ID]f = d4-larger(p2,p14)/2-p16-d16"  ; second spin echo after t1
"D[ID]g = p16+d16-p1*0.78+de+8u"        ; final spin echo for refocusing gradient
"cnst43 = sfo2/sfo1"                    ; gradient ratio
define list<gradient> G[ID]={cnst43}
`;
let pulprog = `
  ; 13C-1H sensitivity-enhanced HSQC

  ; forward INEPT
  (p1 ph0):f1
  D[ID]a
  4u
  (center (p2 ph0):f1 (p14:sp3 ph0):f2 )
  4u
  D[ID]a pl2:f2
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
  D[ID]b
  (p31:sp18 ph0):f2
  (p2 ph0):f1
  D[ID]c
  4u
  (p31:sp18 ph0):f2
  2u
  2u pl2:f2
#else
  p16:gp4*EA
  d16
  (p24:sp7 ph0):f2
  4u
  D[ID]d pl2:f2
#endif /* EDIT */

  ; reverse INEPT for first component
  (center (p1 ph0):f1 (p3 ph7):f2 )
  p19:gp6
  d16
  D[ID]e
  (center (p2 ph0):f1 (p24:sp7 ph0):f2 )
  D[ID]e
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
  D[ID]f
  (center (p2 ph0):f1 (p14:sp3 ph0):f2 )
  D[ID]f
  p16:gp7
  d16
  (p1 ph0):f1

  ; spin echo for refocusing gradient
  D[ID]g
  (p2 ph0):f1
  4u
  p16:gp4*G[ID]
  d16 pl12:f2
  4u
  goscnp ph30 cpd2:f2   ; acquire 13C seHSQC
  50u do:f2
`;
const mod = new NOAHModule("c13", "Sp", [Kupce2017ACIE], "noah_hsqc", shortDescription, [AF_EDIT], preamble, pulprog, 1, false);
export default mod;
// vim: syntax=bruker:
