import { Kupce2017ACIE, Yong2021JMR } from "../citation.js";
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
define delay D[ID]a
define delay D[ID]b
define delay D[ID]c
define delay D[ID]d
define delay D[ID]e
define delay D[ID]f
define delay D[ID]g
define delay D[ID]h
define delay D[ID]i
"D[ID]a = d4-p14/2"
"D[ID]b = d4+p14/2"
"D[ID]c = p16+d16+p2/2+4u+d0-p3*2/PI"
"D[ID]d = D[ID]c-p2"
"D[ID]e = d2-p1"
"D[ID]f = d6-cnst17*p24/2-p16-d16"
"D[ID]g = d4-larger(p2,p14)/2-p16-d16"
"D[ID]h = d4-larger(p2,p14)/2-p1*0.78"
"D[ID]i = d4-p16-d16-de-larger(p2,p14)/2"
"cnst41 = 2*sfo2/sfo1"
define list<gradient> G[ID]={cnst41}
`;
let pulprog = `
  ; 13C-1H seHSQC 'version 1'

  ; INEPT
  (p1 ph0):f1
  D[ID]a
  (p14:sp3 ph0):f2
  (p2 ph0):f1
  D[ID]b pl2:f2
  (p1 ph1):f1
  (p3 ph5):f2

  ; t1 and optional multiplicity editing
#ifdef EDIT
  D[ID]c
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
  D[ID]d
  (p2 ph0):f1
  D[ID]e pl2:f2
#else
  D[ID]c
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
  D[ID]c pl2:f2
#endif /* EDIT */

  ( center
    (p3 ph7):f2
    (p1 ph0 p1 ph1):f1
  )

  ; first spin echo
  D[ID]f
  p19:gp6
  d16
  (center (p2 ph1):f1 (p24:sp7 ph7):f2 )
  D[ID]f pl2:f2
  p19:gp6
  d16
  ; second spin echo
  (center (p1 ph2):f1 (p3 ph9):f2 )
  p16:gp7
  d16
  D[ID]g
  (center (p2 ph1):f1 (p14:sp3 ph7):f2 )
  D[ID]g
  p16:gp7
  d16
  ; third spin echo
  (p1 ph1):f1
  D[ID]h
  (center (p2 ph0):f1 (p14:sp3 ph7):f2 )
  p16:gp4*EA*G[ID]
  d16
  D[ID]i pl12:f2
  goscnp ph28 cpd2:f2
  50u do:f2
`;
const mod = new NOAHModule("c13", "Spv1", [Kupce2017ACIE, Yong2021JMR], "noah_hsqc", shortDescription, preamble, pulprog, 1, false);
export default mod;
// vim: syntax=bruker:
