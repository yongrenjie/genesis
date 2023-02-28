import { Kupce2017ACIE, Gyongyosi2021AC } from "../citation.js";
import { AF_EDIT1 } from "../acquFlag.js";
import NOAHModule from "../noahModule.js";
let shortDescription = `; 13C HSQC-CLIP-COSY
;     [DOES NOT PRESERVE UNUSED 1JCH MAGNETISATION - ONLY FOR INTERNAL USE]`;
let preamble = `
"p2     = p1*2"                       ; 1H hard 180
"d2     = 0.5s/cnst2"                 ; JCOMP
"d4     = 0.25s/cnst2"                ; 13C INEPT
"d12    = 0.25s/cnst12"               ; perfect echo mixing (< 1/4J(HH))
"d0     = 3u"                         ; 13C HSQC-COSY t1
"in0    = inf1/2"                     ; 13C HSQC-COSY increment
"D[ID]a = (asin(cnst32)/(2*PI*cnst2))-larger(p2,p14)/2000000"
"D[ID]b = d2-p16-d16-p2-d0*2-p3*2/PI"
"D[ID]c = d2-p2+p3*2/PI"
"D[ID]d = p16+d16+p2+d0*2-4u"
"D[ID]e = d12-d4-p14/2"
"D[ID]f = d4-p14/2"
"D[ID]g = d2-p14/2"
"D[ID]h = d2-p14/2-p16-d16"
"cnst43 = sfo2/sfo1"                  ; gradient ratio
define list<gradient> G[ID]={cnst43}
`;
let pulprog = `
  ; 13C-1H HSQC-CLIP-COSY

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
#ifdef EDIT1
  p16:gp3
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
  p16:gp3
  d16
  (p24:sp7 ph0):f2
  4u
  D[ID]d pl2:f2
#endif /* EDIT1 */

  (p3 ph7):f2
  p16:gp11*0.5  ; purge gradient
  d16
  (p1 ph1):f1

  ;CLIP COSY starts here
  ;in-phase transfer block, planar mixing

  d12
  (p2 ph17):f1
  D[ID]e
  (p14:sp3 ph0):f2
  D[ID]f pl2:f2
  (p1 ph17):f1
  d12
  (p2 ph3):f1
  d12

  ;z-filter block
  (p1 ph0):f1
  4u gron12
  (p32:sp29 ph2):f1
  40u groff
  p16:gp11
  d16 pl1:f1

  (p1 ph0):f1
  (p3 ph12):f2
  D[ID]g
  4u
  (center (p2 ph1):f1 (p14:sp3 ph0):f2)
  D[ID]h pl12:f2
  4u
  p16:gp3*EA*G[ID]
  d16
  goscnp ph30 cpd2:f2
  50u do:f2
`;
const mod = new NOAHModule("c13", "Scc", [Kupce2017ACIE, Gyongyosi2021AC], "noah_hsqc", shortDescription, [AF_EDIT1], preamble, pulprog, 1, false);
export default mod;
// vim: syntax=bruker:
