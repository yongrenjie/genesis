import { Kupce2017ACIE, Hansen2021AC, Yong2021JMR } from "../citation.js";
import NOAHModule from "../noahModule.js";
let shortDescription = `; 13C sensitivity-enhanced HSQC
;     [use -DEDIT for multiplicity editing]`;
let preamble = `
"p2      = p1*2"                       ; 1H hard 180
"d2      = 0.5s/cnst2"                 ; JCOMP
"d4      = 0.25s/cnst2"                ; 13C INEPT
"d0      = 3u"                         ; 13C HSQC t1
"in0     = inf1/2"                     ; 13C HSQC increment
define delay DC_SEHSQC1
define delay DC_SEHSQC2
define delay DC_SEHSQC3
define delay DC_SEHSQC4
define delay DC_SEHSQC5
define delay DC_SEHSQC6
define delay DC_SEHSQC7
define delay DC_SEHSQC8
define delay DC_SEHSQC9
define delay DC_SEHSQC10
"DC_SEHSQC1 = d4-p14/2"                     ; zz-filter
"DC_SEHSQC2 = d4+p14/2"                     ; zz-filter
"DC_SEHSQC3 = d4-larger(p2,p14)/2"          ; INEPT
"DC_SEHSQC4 = p16+d16+p2+d0*2-4u-p3*2/PI"   ; 13C pre-t1 if editing
"DC_SEHSQC5 = d2-p16-d16+p3*2/PI"           ; 13C editing period
"DC_SEHSQC6 = d2-p2-p3*2/PI"                ; 13C editing period
"DC_SEHSQC7 = p16+d16+p2/2+d0-4u-p3*2/PI"   ; 13C pre-/post-t1 if no editing
"DC_SEHSQC8 = d6-cnst17*p24/2-p19-d16"      ; first spin echo after t1
"DC_SEHSQC9 = d4-larger(p2,p14)/2-p16-d16"  ; second spin echo after t1
"DC_SEHSQC10= p16+d16-p1*0.78+de+8u"        ; final spin echo for refocusing gradient
"cnst41  = 2*sfo2/sfo1"                ; gradient ratio
define list<gradient> GC_SEHSQC={cnst41}
`;
let pulprog = `
  ; 13C-1H seHSQC (with ZIP element)

  ; ZIP
  (p1 ph0):f1
  DC_SEHSQC1
  (p14:sp3 ph0):f2
  (p2 ph0):f1
  DC_SEHSQC2
  (p1 ph0):f1
  DC_SEHSQC1
  (p14:sp3 ph0):f2
  (p2 ph0):f1
  DC_SEHSQC2            ; 13C-1H: y,  12C-1H: z

  ; forward INEPT
#ifdef EDIT
  (p1 ph1):f1
#else
  (p1 ph3):f1
#endif /* EDIT */
  DC_SEHSQC3
  4u
  (center (p2 ph0):f1 (p14:sp3 ph0):f2 )
  4u
  DC_SEHSQC3 pl2:f2
  4u
  (p1 ph1):f1 (p3 ph5):f2

  ; t1 evolution with optional multiplicity editing
#ifdef EDIT
  4u
  DC_SEHSQC4
  (p31:sp18 ph0):f2
  p16:gp4
  d16 pl2:f2

  d0
  (p2 ph7):f1
  d0

  p16:gp4
  d16
  DC_SEHSQC5
  (p31:sp18 ph0):f2
  (p2 ph0):f1
  DC_SEHSQC6 pl2:f2
#else
  4u
  DC_SEHSQC7 
  (p24:sp7 ph0):f2
  p16:gp4
  d16 pl2:f2

  d0
  (p2 ph7):f1
  d0

  p16:gp4
  d16
  (p24:sp7 ph0):f2
  4u
  DC_SEHSQC7 pl2:f2
#endif /* EDIT */

  ; reverse INEPT for first component
  (center (p1 ph0):f1 (p3 ph7):f2 )
  p19:gp6
  d16
  DC_SEHSQC8
  (center (p2 ph0):f1 (p24:sp7 ph0):f2 )
  DC_SEHSQC8
  p19:gp6
  d16 pl2:f2
  (center (p1 ph1):f1 (p3 ph9):f2 )  ; seHSQC pulse, incremented with EA

  ; reverse INEPT for second component
  p16:gp7
  d16
  DC_SEHSQC9
  (center (p2 ph0):f1 (p14:sp3 ph0):f2 )
  DC_SEHSQC9
  p16:gp7
  d16
  (p1 ph0):f1

  ; spin echo for refocusing gradient
  DC_SEHSQC10
  (p2 ph0):f1
  4u
  p16:gp4*EA*GC_SEHSQC
  d16 pl12:f2
  4u
  goscnp ph30 cpd2:f2   ; acquire 13C HSQC
  50u do:f2
`;
const mod = new NOAHModule("c13", "Sp", [Kupce2017ACIE, Hansen2021AC, Yong2021JMR], "noah_hsqc", shortDescription, preamble, pulprog);
export default mod;
// vim: syntax=bruker:
