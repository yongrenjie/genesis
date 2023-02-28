import { Kupce2017ACIE, Hansen2021AC, Yong2021JMR } from "../citation.js";
import NOAHModule from "../noahModule.js";
let shortDescription = `; 13C sensitivity-enhanced HSQC, IPAP mode
;     [use -DEDIT for multiplicity editing]
;     [set userPx to 'noah_hsqc noah_TS' to perform addition/subtraction of IP/AP multiplets]`;
let preamble = `
"p2      = p1*2"                       ; 1H hard 180
"d2      = 0.5s/cnst2"                 ; JCOMP
"d4      = 0.25s/cnst2"                ; 13C INEPT
"d3      = 3u"                         ; 13C HSQC t1
"in3     = inf1/2"                     ; 13C HSQC increment
define delay DC_SEHSQC_IA1
define delay DC_SEHSQC_IA2
define delay DC_SEHSQC_IA3
define delay DC_SEHSQC_IA4
define delay DC_SEHSQC_IA5
define delay DC_SEHSQC_IA6
define delay DC_SEHSQC_IA7
define delay DC_SEHSQC_IA8
define delay DC_SEHSQC_IA9
define delay DC_SEHSQC_IA10
define delay DC_SEHSQC_IA11
define delay DC_SEHSQC_IA12
define delay DC_SEHSQC_IA13
"DC_SEHSQC_IA1 = d4-p14/2"                     ; zz-filter
"DC_SEHSQC_IA2 = d4+p14/2"                     ; zz-filter
"DC_SEHSQC_IA3 = d4-larger(p2,p14)/2"          ; INEPT
"DC_SEHSQC_IA4 = p16+d16+p2+d3*2-4u-p3*2/PI"   ; 13C pre-t1 if editing
"DC_SEHSQC_IA5 = d2-p16-d16+p3*2/PI"           ; 13C editing period
"DC_SEHSQC_IA6 = d2-p2-p3*2/PI"                ; 13C editing period
"DC_SEHSQC_IA7 = p16+d16+p2/2+d3-4u-p3*2/PI"   ; 13C pre-/post-t1 if no editing
"DC_SEHSQC_IA8 = d6-cnst17*p24/2-p19-d16"      ; first spin echo after t1
"DC_SEHSQC_IA9 = d4-larger(p2,p14)/2-p16-d16"  ; second spin echo after t1
"DC_SEHSQC_IA10= d4-p2/2"                      ; final spin echo for refocusing gradient
"DC_SEHSQC_IA11= d4-p2/2-p16-d16-de"           ; final spin echo for refocusing gradient
"DC_SEHSQC_IA12= d4-larger(p2,p14)/2"          ; final spin echo for refocusing gradient
"DC_SEHSQC_IA13= d4-larger(p2,p14)/2-p16-d16-de" ; final spin echo for refocusing gradient
"cnst41  = 2*sfo2/sfo1"                ; gradient ratio
define list<gradient> GC_SEHSQC_IA={cnst41}
`;
let pulprog = `
  ; 13C-1H seHSQC (with ZIP element)

  ; ZIP
  (p1 ph0):f1
  DC_SEHSQC_IA1
  (p14:sp3 ph0):f2
  (p2 ph0):f1
  DC_SEHSQC_IA2
  (p1 ph0):f1
  DC_SEHSQC_IA1
  (p14:sp3 ph0):f2
  (p2 ph0):f1
  DC_SEHSQC_IA2            ; 13C-1H: y,  12C-1H: z

  ; forward INEPT
#ifdef EDIT
  (p1 ph1):f1
#else
  (p1 ph3):f1
#endif /* EDIT */
  DC_SEHSQC_IA3
  4u
  (center (p2 ph0):f1 (p14:sp3 ph0):f2 )
  4u
  DC_SEHSQC_IA3 pl2:f2
  4u
  (p1 ph1):f1 (p3 ph18):f2

  ; t1 evolution with optional multiplicity editing
#ifdef EDIT
  4u
  DC_SEHSQC_IA4
  (p31:sp18 ph0):f2
  p16:gp4
  d16 pl2:f2

  d3
  (p2 ph7):f1
  d3

  p16:gp4
  d16
  DC_SEHSQC_IA5
  (p31:sp18 ph0):f2
  (p2 ph0):f1
  DC_SEHSQC_IA6 pl2:f2
#else
  4u
  DC_SEHSQC_IA7 
  (p24:sp7 ph0):f2
  p16:gp4
  d16 pl2:f2

  d3
  (p2 ph7):f1
  d3

  p16:gp4
  d16
  (p24:sp7 ph0):f2
  4u
  DC_SEHSQC_IA7 pl2:f2
#endif /* EDIT */

  ; reverse INEPT for first component
  (center (p1 ph0):f1 (p3 ph7):f2 )
  p19:gp6
  d16
  DC_SEHSQC_IA8
  (center (p2 ph0):f1 (p24:sp7 ph0):f2 )
  DC_SEHSQC_IA8
  p19:gp6
  d16 pl2:f2
  (center (p1 ph1):f1 (p3 ph19):f2 )

  ; reverse INEPT for second component
  p16:gp7
  d16
  DC_SEHSQC_IA9
  (center (p2 ph0):f1 (p14:sp3 ph0):f2 )
  DC_SEHSQC_IA9
  p16:gp7
  d16
  (p1 ph0):f1

  ; spin echo, IP/AP selection, and refocusing gradient
if "l1 % 2 == 0" {
  DC_SEHSQC_IA10
  (p2 ph0):f1
  DC_SEHSQC_IA11
  p16:gp4*EA_TS*GC_SEHSQC_IA
  d16
  goscnp ph24
}
else {
  DC_SEHSQC_IA12
  (center (p2 ph0):f1 (p14:sp3 ph0):f2 )
  DC_SEHSQC_IA13
  p16:gp4*EA_TS*GC_SEHSQC_IA
  d16 ip24
  GOSCNP ph24       ; acquire 13C seHSQC
  dp24
}
`;
// When the pulprog generator is 'counting' NBL, it does so by counting the
// number of goscnp or go= statements.  Therefore, if we have two goscnp
// statements, it will think that this module is actually two modules (it's not
// smart enough to understand that they're in mutually exclusive if/else
// blocks).  The way around this is to use GOSCNP for one of them. Because the
// search for goscnp/go= is case-sensitive, it doesn't pick up GOSCNP; and in
// the generator there is a line which makes sure that all GOSCNP statements
// are changed to small caps before being output. So this is a hacky, but
// general and extensible, way to have multiple goscnp statements inside what
// is technically only one module.
const mod = new NOAHModule("c13", "Spia", [Kupce2017ACIE, Hansen2021AC, Yong2021JMR], "noah_hsqc noah_split", shortDescription, preamble, pulprog);
export default mod;
// vim: syntax=bruker:
