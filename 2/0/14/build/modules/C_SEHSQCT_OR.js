import { Kupce2017ACIE } from "../citation.js";
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
define delay D[ID]a
define delay D[ID]b
define delay D[ID]c
define delay D[ID]d
define delay D[ID]e
define delay D[ID]f
define delay D[ID]g
define delay D[ID]h
"D[ID]a = d4-larger(p2,p14)/2"               ; INEPT
"D[ID]b = d2-cnst17*p24/2-p16-d16-p2-d0*2"   ; multiplicity editing
"D[ID]c = d2-cnst17*p24/2-4u"                ; multiplicity editing
"D[ID]d = p16+d16+p2+d0*2-4u"                ; 13C post-t1, no editing
"D[ID]e = d6-cnst17*p24/2"                   ; SE spin echo
"D[ID]f = d2-larger(p2,p14)/2-p1*2/PI"       ; inversion of TOCSY vs HSQC
"D[ID]g = d2-larger(p2,p14)/2-p16-d16-de-4u" ; inversion of TOCSY vs HSQC
"D[ID]h = p16+d16-p1*0.78+de+8u"             ; final spin echo, no inversion
"cnst43 = sfo2/sfo1"                         ; gradient ratio
define list<gradient> G[ID]={cnst43}
`;
let pulprog = `
  ; 13C-1H sensitivity-enhanced HSQC-TOCSY

  ; INEPT
  (p1 ph0):f1
  D[ID]a
  (center (p2 ph0):f1 (p14:sp3 ph0):f2 )
  D[ID]a pl2:f2
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
  D[ID]b
  (center (p2 ph0):f1 (p24:sp7 ph7):f2 )
  4u
  D[ID]c pl2:f2
#else
  p16:gp4
  d16
  (p24:sp7 ph7):f2
  4u
  D[ID]d pl2:f2
#endif /* EDIT */

  ; first spin echo
  (center (p1 ph0):f1 (p3 ph7):f2 )
  D[ID]e
  (center (p2 ph0):f1 (p24:sp7 ph0):f2 )
  D[ID]e pl2:f2

  ; second spin echo
  (center (p1 ph1):f1 (p3 ph9):f2 )
  D[ID]a
  (center (p2 ph0):f1 (p14:sp3 ph0):f2 )
  D[ID]a pl10:f1

  |DIPSI|
  4u pl1:f1
  (p1 ph0):f1

#ifdef INVERT
  D[ID]f
  (center (p2 ph0):f1 (p14:sp3 ph0):f2 )
  4u
  p16:gp4*G[ID]*EA
  d16 pl12:f2
  D[ID]g
#else
  D[ID]h
  (p2 ph0):f1
  4u
  p16:gp4*G[ID]*EA
  d16 pl12:f2
  4u
#endif /* INVERT */

  goscnp ph30 cpd2:f2
  50u do:f2
`;
const mod = new NOAHModule("c13", "Stp", [Kupce2017ACIE], "noah_hsqc", shortDescription, preamble, pulprog, 1, false);
export default mod;
// vim: syntax=bruker:
