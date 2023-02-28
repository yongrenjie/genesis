import { Kupce2017ACIE, Gyongyosi2021AC } from "../citation.js";
import NOAHModule from "../noahModule.js";
let shortDescription = `; 13C HSQC-CLIP-COSY
;     [DOES NOT PRESERVE UNUSED 1JCH MAGNETISATION - ONLY FOR INTERNAL USE]
;     [use -DEDIT1 for multiplicity editing (not recommended)]`;
let preamble = `
"p2      = p1*2"                       ; 1H hard 180
"d2      = 0.5s/cnst2"                 ; JCOMP
"d4      = 0.25s/cnst2"                ; 13C INEPT
"d12     = 0.25s/cnst12"               ; perfect echo mixing (< 1/4J(HH))
"d0      = 3u"                         ; 13C HSQC-COSY t1
"in0     = inf1/2"                     ; 13C HSQC-COSY increment
define delay DCI_HSQCC_CL1
define delay DCI_HSQCC_CL2
define delay DCI_HSQCC_CL3
define delay DCI_HSQCC_CL4
define delay DCI_HSQCC_CL5
define delay DCI_HSQCC_CL6
define delay DCI_HSQCC_CL7
define delay DCI_HSQCC_CL8
"DCI_HSQCC_CL1 = (asin(cnst32)/(2*PI*cnst2))-larger(p2,p14)/2000000"
"DCI_HSQCC_CL2 = d2-p16-d16-p2-d0*2-p3*2/PI"
"DCI_HSQCC_CL3 = d2-p2+p3*2/PI"
"DCI_HSQCC_CL4 = p16+d16+p2+d0*2-4u"
"DCI_HSQCC_CL5 = d12-d4-p14/2"
"DCI_HSQCC_CL6 = d4-p14/2"
"DCI_HSQCC_CL7 = d2-p14/2"
"DCI_HSQCC_CL8 = d2-p14/2-p16-d16"
"cnst43  = sfo2/sfo1"                  ; gradient ratio
define list<gradient> GCI_HSQCC_CL={cnst43}
`;
let pulprog = `
  ; 13C-1H HSQC-CLIP-COSY

  ; forward INEPT
  (p1 ph0):f1
  DCI_HSQCC_CL1
  4u
  (center (p2 ph0):f1 (p14:sp3 ph0):f2 )
  4u
  DCI_HSQCC_CL1 pl2:f2
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
  DCI_HSQCC_CL2
  (p31:sp18 ph0):f2
  (p2 ph0):f1
  DCI_HSQCC_CL3
  4u
  (p31:sp18 ph0):f2
  2u
  2u pl2:f2
#else
  p16:gp3
  d16
  (p24:sp7 ph0):f2
  4u
  DCI_HSQCC_CL4 pl2:f2
#endif /* EDIT1 */

  (p3 ph7):f2
  p16:gp11*0.5  ; purge gradient
  d16
  (p1 ph1):f1

  ;CLIP COSY starts here
  ;in-phase transfer block, planar mixing

  d12
  (p2 ph17):f1
  DCI_HSQCC_CL5
  (p14:sp3 ph0):f2
  DCI_HSQCC_CL6 pl2:f2
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
  DCI_HSQCC_CL7
  4u
  (center (p2 ph1):f1 (p14:sp3 ph0):f2)
  DCI_HSQCC_CL8 pl12:f2
  4u
  p16:gp3*EA*GCI_HSQCC_CL
  d16
  goscnp ph30 cpd2:f2
  50u do:f2
`;
const mod = new NOAHModule("c13", "Qclip", [Kupce2017ACIE, Gyongyosi2021AC], "noah_hsqc", shortDescription, preamble, pulprog);
export default mod;
// vim: syntax=bruker:
