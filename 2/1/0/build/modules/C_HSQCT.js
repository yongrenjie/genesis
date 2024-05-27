import { Yong2021JMR } from "../citation.js";
import { AF_EDIT, AF_INVERT } from "../acquFlag.js";
import NOAHModule from "../noahModule.js";
let shortDescription = `; 13C HSQC-TOCSY`;
let preamble = `
"p2      = p1*2"                       ; 1H hard 180
"d2      = 0.5s/cnst2"                 ; JCOMP
"d4      = 0.25s/cnst2"                ; 13C INEPT
"d0      = 3u"                         ; 13C t1
"in0     = inf1/2"                     ; 13C increment
"D[ID]a   = d4-p14/2"
"D[ID]b   = d4+p14/2"
"D[ID]c   = p16+d16+p2/2+d0-p3*2/PI+4u"
"D[ID]d   = d2+p3+p2/2"
"D[ID]e   = D[ID]c+p3-p2/2"
"D[ID]f   = d4+p14/2-p16-d16"
"D[ID]g   = d2-p14/2-p16-d16-4u"
"D[ID]h   = d2+p14/2-p16-d16-de"
"D[ID]i   = de+4u"
"cnst41  = 2*sfo2/sfo1"                ; gradient ratio
define list<gradient> G[ID]={cnst41}
`;
let pulprog = `
  ; 13C-1H HSQC-TOCSY

  ; INEPT
  (p1 ph0):f1
  D[ID]a
  (p14:sp3 ph0):f2
  (p2 ph0):f1
  D[ID]b pl2:f2
  (p1 ph1):f1
  (p3 ph5):f2
  D[ID]c

  ; t1 period
#ifdef EDIT
  (p31:sp18 ph0):f2
#else
  (p14:sp3 ph0):f2
#endif /* EDIT */
  4u
  p16:gp4
  d16
  d0
  (p2 ph11):f1
  d0
  4u
  p16:gp4
  d16

  ; multiplicity editing
#ifdef EDIT
  D[ID]d
  (p31:sp18 ph0):f2
  D[ID]e
  (p2 ph1):f1
  d2 pl2:f2
#else
  (p14:sp3 ph0):f2
  D[ID]c pl2:f2
#endif /* EDIT */

  ; reverse INEPT
  (p3 ph7):f2
  (p1 ph2):f1
  D[ID]a
  (p14:sp3 ph0):f2
  (p2 ph1):f1

  p16:gp13
  d16
  D[ID]f pl10:f1

  |DIPSI|
  4u
  p16:gp13*-1
  d16 pl1:f1

#ifdef INVERT
  D[ID]g
  (p14:sp3 ph0):f2 
  (p2 ph1):f1 
  p16:gp4*G[ID]*EA
  d16 pl12:f2 
  D[ID]h
#else
  D[ID]i
  (p2 ph1):f1
  4u
  p16:gp4*G[ID]*EA
  d16 pl12:f2
  4u
#endif /* INVERT */
  goscnp ph30 cpd2:f2   ; acquire 13C HSQC-TOCSY
  50u do:f2
`;
const mod = new NOAHModule("C_HSQCT", "c13", "St", [Yong2021JMR], "noah_hsqc", shortDescription, [AF_EDIT, AF_INVERT], preamble, pulprog, 1, false);
export default mod;
// vim: syntax=bruker:
