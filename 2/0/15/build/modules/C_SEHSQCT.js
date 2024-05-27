import { Kupce2017ACIE, Hansen2021AC } from "../citation.js";
import NOAHModule from "../noahModule.js";
let shortDescription = `; 13C sensitivity-enhanced HSQC-TOCSY (with ZIP)
;     [use -DEDIT for multiplicity editing (not recommended)]
;     [use -DINVERT for inversion of TOCSY peaks]`;
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
define delay D[ID]h
define delay D[ID]i
define delay D[ID]j
define delay D[ID]k
define delay D[ID]l
"D[ID]a = d4-p14/2"                          ; zz-filter
"D[ID]b = d4+p14/2"                          ; zz-filter
"D[ID]c = d4-larger(p2,p14)/2"               ; INEPT
"D[ID]d = p16+d16+p2+d0*2-4u-p3*2/PI"        ; 13C pre-t1 if editing
"D[ID]e = d2-p16-d16+p3*2/PI"                ; 13C editing period
"D[ID]f = d2-p2-p3*2/PI"                     ; 13C editing period
"D[ID]g = p16+d16+p2/2+d0-4u-p3*2/PI"        ; 13C pre-/post-t1 if no editing
"D[ID]h = d6-cnst17*p24/2-p19-d16"           ; first spin echo after t1
"D[ID]i = d4-larger(p2,p14)/2-p16-d16-4u"    ; DIPSI spin echo
"D[ID]j = d2-larger(p2,p14)/2-p1*2/PI"       ; inversion of TOCSY vs HSQC
"D[ID]k = d2-larger(p2,p14)/2-p16-d16-de-4u" ; inversion of TOCSY vs HSQC
"D[ID]l = p16+d16-p1*0.78+de+8u"             ; final spin echo, no inversion
"cnst41 = 2*sfo2/sfo1"                       ; gradient ratio
define list<gradient> G[ID]={cnst41}
`;
let pulprog = `
  ; 13C-1H sensitivity-enhanced HSQC-TOCSY (with ZIP)

  ; ZIP element
  (p1 ph0):f1
  D[ID]a
  (p14:sp3 ph0):f2
  (p2 ph0):f1
  D[ID]b
  (p1 ph0):f1
  D[ID]a
  (p14:sp3 ph0):f2
  (p2 ph0):f1
  D[ID]b            ; 13C-1H: y,  12C-1H: z

  ; forward INEPT
#ifdef EDIT
  (p1 ph1):f1
#else
  (p1 ph3):f1
#endif /* EDIT */
  D[ID]c
  4u
  (center (p2 ph0):f1 (p14:sp3 ph0):f2 )
  4u
  D[ID]c pl2:f2
  4u
  (p1 ph1):f1 (p3 ph5):f2

  ; t1 evolution with optional multiplicity editing
#ifdef EDIT
  4u
  D[ID]d
  (p31:sp18 ph0):f2
  p16:gp3
  d16 pl2:f2

  d0
  (p2 ph7):f1
  d0

  p16:gp3
  d16
  D[ID]e
  (p31:sp18 ph0):f2
  (p2 ph0):f1
  D[ID]f pl2:f2
#else
  4u
  D[ID]g 
  (p24:sp7 ph0):f2
  p16:gp3
  d16 pl2:f2

  d0
  (p2 ph7):f1
  d0

  p16:gp3
  d16
  (p24:sp7 ph0):f2
  4u
  D[ID]g pl2:f2
#endif /* EDIT */

  ; reverse INEPT for first component
  (center (p1 ph0):f1 (p3 ph7):f2 )
  p19:gp6
  d16
  D[ID]h
  (center (p2 ph0):f1 (p24:sp7 ph0):f2 )
  D[ID]h
  p19:gp6
  d16 pl2:f2
  (center (p1 ph1):f1 (p3 ph9):f2 )  ; seHSQC pulse, incremented with EA

  ; reverse INEPT for second component
  4u
  p16:gp7
  d16
  D[ID]i
  (center (p2 ph0):f1 (p14:sp3 ph0):f2 )
  D[ID]i pl10:f1
  p16:gp7
  d16

  |DIPSI|
  4u pl1:f1
  (p1 ph0):f1

#ifdef INVERT
  D[ID]j
  (center (p2 ph0):f1 (p14:sp3 ph0):f2 )
  4u
  p16:gp3*G[ID]*EA
  d16 pl12:f2
  D[ID]k
#else
  D[ID]l
  (p2 ph0):f1
  4u
  p16:gp3*G[ID]*EA
  d16 pl12:f2
  4u
#endif /* INVERT */

  goscnp ph30 cpd2:f2
  50u do:f2
`;
const mod = new NOAHModule("c13", "Stp", [Kupce2017ACIE, Hansen2021AC], "noah_hsqc", shortDescription, preamble, pulprog, 1, false);
export default mod;
// vim: syntax=bruker:
