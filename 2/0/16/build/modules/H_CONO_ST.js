import { Kupce2017ACIE } from "../citation.js";
import NOAHModule from "../noahModule.js";
let shortDescription = `; 1H COSY and NOESY (States F1)
;     [use -DPRESAT for presaturation during NOE mixing time (and d1)]
;     [use -DNOZQS to skip zero-quantum suppression]
;     [use -DES for pre-acquisition excitation sculpting]`;
let preamble = `
"d10    = 3u"                         ; COSY/NOESY t1
"in10   = 2*dw"                       ; COSY/NOESY increment
define delay D[ID]a
define delay D[ID]b
define delay D[ID]c
define delay D[ID]d
define delay D[ID]e
"D[ID]a = d8-de-aq-p32-p16-d16-52u"   ; NOE mixing time (with ZQS, without ES)
"D[ID]b = d8-de-aq-p16-d16-22u"       ; NOE mixing time (without ZQS, without ES)
"D[ID]c = (4*(p16+d16))+(2*(p12+p2))+16u+de+p1*2/3.1416"   ; time taken for ES
"D[ID]d = D[ID]a - D[ID]c"            ; NOE mixing time (with ZQS, with ES)
"D[ID]e = D[ID]b - D[ID]c"            ; NOE mixing time (without ZQS, with ES)
`;
let pulprog = `
  ; 1H-1H COSY + NOESY (States)

  ; COSY
  (p1 ph6):f1
  d10
  (p1 ph0):f1
  |SOLVSUPP(0.6)|
  goscnp ph26  ; acquire H-H COSY

  ; NOESY
#ifdef NOZQS
# ifdef PRESAT
  /* NOZQS PRESAT */
  4u
  p16:gp11
  d16 pl9:f1
#  ifdef ES
  D[ID]e cw:f1
#  else
  D[ID]b cw:f1
#  endif
  4u do:f1
  4u pl1:f1
  10u st
# else
  /* NOZQS only */
  4u
  p16:gp11
  d16 pl1:f1
#  ifdef ES
  D[ID]e
#  else
  D[ID]b
#  endif
  18u st
# endif
#else
# ifdef PRESAT
  /* PRESAT only */
  4u
  10u gron12
  (p32:sp29 ph0):f1
  20u groff
  p16:gp11
  d16 pl9:f1
#  ifdef ES
  D[ID]d cw:f1
#  else
  D[ID]a cw:f1
#  endif
  4u do:f1
  4u pl1:f1
  10u st
# else
  /* no flags */
  4u
  10u gron12
  (p32:sp29 ph0):f1
  20u groff
  p16:gp11
  d16 pl1:f1
#  ifdef ES
  D[ID]d
#  else
  D[ID]a
#  endif
  18u st
# endif  /* PRESAT */
#endif  /* NOZQS */
  (p1 ph0):f1
  |SOLVSUPP|
  goscnp ph26  ; acquire H-H NOESY
`;
const mod = new NOAHModule("h1", "CNst", [Kupce2017ACIE], "noah_cosy States:noah_noesy States", shortDescription, preamble, pulprog, 2, false);
export default mod;
// vim: syntax=bruker:
