import NOAHModule from "../noahModule.js";
let shortDescription = `; 13C sensitivity-enhanced HSQC-TOCSY
;     [use -DEDIT for multiplicity editing (not recommended)]
;     [use -DINVERT for inversion of TOCSY peaks]`;
let preamble = `
"p2      = p1*2"                       ; 1H hard 180
"d2      = 0.5s/cnst2"                 ; JCOMP
"d4      = 0.25s/cnst2"                ; 13C INEPT
"d0      = 3u"                         ; 13C t1
"in0     = inf1/2"                     ; 13C increment
define delay DC_SEHSQCT_OR1
define delay DC_SEHSQCT_OR2
define delay DC_SEHSQCT_OR3
define delay DC_SEHSQCT_OR4
define delay DC_SEHSQCT_OR5
define delay DC_SEHSQCT_OR6
define delay DC_SEHSQCT_OR7
define delay DC_SEHSQCT_OR8
"DC_SEHSQCT_OR1    = d4-larger(p2,p14)/2"               ; INEPT
"DC_SEHSQCT_OR2    = d2-cnst17*p24/2-p16-d16-p2-d0*2"   ; multiplicity editing
"DC_SEHSQCT_OR3    = d2-cnst17*p24/2-4u"                ; multiplicity editing
"DC_SEHSQCT_OR4    = p16+d16+p2+d0*2-4u"                ; 13C post-t1, no editing
"DC_SEHSQCT_OR5    = d6-cnst17*p24/2"                   ; SE spin echo
"DC_SEHSQCT_OR6    = d2-larger(p2,p14)/2-p1*2/PI"       ; inversion of TOCSY vs HSQC
"DC_SEHSQCT_OR7    = d2-larger(p2,p14)/2-p16-d16-de-4u" ; inversion of TOCSY vs HSQC
"DC_SEHSQCT_OR8    = p16+d16-p1*0.78+de+8u"             ; final spin echo, no inversion
"cnst43  = sfo2/sfo1"                ; gradient ratio
define list<gradient> GC_SEHSQCT_OR={cnst43}
`;
let pulprog = `
  ; 13C-1H sensitivity-enhanced HSQC-TOCSY

  ; INEPT
  (p1 ph0):f1
  DC_SEHSQCT_OR1
  (center (p2 ph0):f1 (p14:sp3 ph13):f2 )
  DC_SEHSQCT_OR1 pl2:f2
  (p1 ph1):f1 
  (p3 ph5):f2

  ; t1
  d0 
  (p2 ph7):f1
  d0

  ; multiplicity editing
#ifdef EDIT
  p16:gp4
  d16 
  DC_SEHSQCT_OR2
  (center (p2 ph0):f1 (p24:sp7 ph7):f2 )
  4u
  DC_SEHSQCT_OR3 pl2:f2
#else
  p16:gp4
  d16
  (p24:sp7 ph7):f2
  4u
  DC_SEHSQCT_OR4 pl2:f2
#endif /* EDIT */

  ; first spin echo
  (center (p1 ph0):f1 (p3 ph7):f2 )
  DC_SEHSQCT_OR5
  (center (p2 ph0):f1 (p24:sp7 ph0):f2 )
  DC_SEHSQCT_OR5 pl2:f2

  ; second spin echo
  (center (p1 ph1):f1 (p3 ph9):f2 )
  DC_SEHSQCT_OR1
  (center (p2 ph0):f1 (p14:sp3 ph0):f2 )
  DC_SEHSQCT_OR1 pl10:f1

  |DIPSI|
  4u pl1:f1
  (p1 ph0):f1

#ifdef INVERT
  DC_SEHSQCT_OR6
  (center (p2 ph0):f1 (p14:sp3 ph13):f2 )
  4u
  p16:gp4*GC_SEHSQCT_OR*EA
  d16 pl12:f2
  DC_SEHSQCT_OR7
#else
  DC_SEHSQCT_OR8
  (p2 ph0):f1
  4u
  p16:gp4*GC_SEHSQCT_OR*EA
  d16 pl12:f2
  4u
#endif /* INVERT */

  goscnp ph30 cpd2:f2
  50u do:f2
`;
const mod = new NOAHModule("c13", "Stp", "noah_hsqc", shortDescription, preamble, pulprog);
export default mod;
// vim: syntax=bruker:
