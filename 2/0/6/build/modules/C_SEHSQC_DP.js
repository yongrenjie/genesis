import NOAHModule from "../noahModule.js";
let shortDescription = `; 13C sensitivity-enhanced HSQC ('version 1')
;     [use -DEDIT for multiplicity editing]`;
let preamble = `
"p2      = p1*2"                       ; 1H hard 180
"p4      = p3*2"                       ; 13C hard 180
"d2      = 0.5s/cnst2"                 ; JCOMP
"d4      = 0.25s/cnst2"                ; 13C INEPT
"d0      = 3u"                         ; 13C HSQC t1
"in0     = inf1/2"                     ; 13C HSQC increment
define delay DC_SEHSQC_DP1
define delay DC_SEHSQC_DP2
define delay DC_SEHSQC_DP3
define delay DC_SEHSQC_DP4
define delay DC_SEHSQC_DP5
define delay DC_SEHSQC_DP6
define delay DC_SEHSQC_DP7
define delay DC_SEHSQC_DP8
define delay DC_SEHSQC_DP9
"DC_SEHSQC_DP1 = d4-p14/2"
"DC_SEHSQC_DP2 = d4+p14/2"
"DC_SEHSQC_DP3 = p16+d16+p2/2+4u+d0-p3*2/PI"
"DC_SEHSQC_DP4 = DC_SEHSQC_DP3-p2"
"DC_SEHSQC_DP5 = d2-p1"
"DC_SEHSQC_DP6 = d6-cnst17*p24/2-p16-d16"
"DC_SEHSQC_DP7 = d4-larger(p2,p14)/2-p16-d16"
"DC_SEHSQC_DP8 = d4-larger(p2,p14)/2-p1*0.78"
"DC_SEHSQC_DP9 = d4-p16-d16-de-larger(p2,p14)/2"
"cnst41  = 2*sfo2/sfo1"                ; gradient ratio
define list<gradient> GC_SEHSQC_DP={cnst41}
`;
let pulprog = `
  ; 13C-1H seHSQC 'version 1'

  ; INEPT
  (p1 ph0):f1
  DC_SEHSQC_DP1
  (p14:sp3 ph0):f2
  (p2 ph0):f1
  DC_SEHSQC_DP2 pl2:f2
  (p1 ph1):f1
  (p3 ph5):f2

  ; t1 and optional multiplicity editing
#ifdef EDIT
  DC_SEHSQC_DP3
  (p31:sp18 ph0):f2
  4u
  p16:gp4
  d16
  d0
  (p2 ph0):f1
  d0
  4u
  p16:gp4
  d16
  d2
  (p31:sp18 ph0):f2
  DC_SEHSQC_DP4
  (p2 ph0):f1
  DC_SEHSQC_DP5 pl2:f2
#else
  DC_SEHSQC_DP3
  (p14:sp3 ph0):f2
  4u
  p16:gp4
  d16
  d0
  (p2 ph1):f1
  d0
  4u
  p16:gp4
  d16
  (p14:sp3 ph0):f2
  DC_SEHSQC_DP3 pl2:f2
#endif /* EDIT */

  ( center
    (p3 ph7):f2
    (p1 ph0 p1 ph1):f1
  )

  ; first spin echo
  DC_SEHSQC_DP6
  p19:gp6
  d16
  (center (p2 ph1):f1 (p24:sp7 ph7):f2 )
  DC_SEHSQC_DP6 pl2:f2
  p19:gp6
  d16
  ; second spin echo
  (center (p1 ph2):f1 (p3 ph9):f2 )
  p16:gp7
  d16
  DC_SEHSQC_DP7
  (center (p2 ph1):f1 (p14:sp3 ph7):f2 )
  DC_SEHSQC_DP7
  p16:gp7
  d16
  ; third spin echo
  (p1 ph1):f1
  DC_SEHSQC_DP8
  (center (p2 ph0):f1 (p14:sp3 ph7):f2 )
  p16:gp4*EA*GC_SEHSQC_DP
  d16
  DC_SEHSQC_DP9 pl12:f2
  goscnp ph28 cpd2:f2
  50u do:f2
`;
const mod = new NOAHModule("c13", "Spv1", "noah_hsqc", shortDescription, preamble, pulprog);
export default mod;
// vim: syntax=bruker:
