import { AF_PRESAT_NOE, AF_NOZQS, AF_ES } from "../acquFlag.js";
import NOAHModule from "../noahModule.js";
let shortDescription = `; 1H interleaved NOESY + TOCSY`;
let preamble = `
"d13    = 3u"                         ; NOESY/TOCSY t1
"in13   = 2*dw"                       ; NOESY/TOCSY increment
"l11    = (d9/(p6*115.112))/2"        ; half the number of TOCSY loops
"l12    = l11*2"                      ; number of TOCSY loops
"D[ID]a = d8-p32-p16-d16-38u"         ; NOE mixing time (with ZQS)
"D[ID]b = d8-p16-d16-8u"              ; NOE mixing time (without ZQS)
`;
let pulprog = `
  ; 1H interleaved ROESY / TOCSY
  (p1 ph20):f1
  d13
  (p1 ph0):f1

if "l1 % 2 == 0"
{
  ; NOESY
#ifdef NOZQS
# ifdef PRESAT
  p16:gp11
  d16 pl9:f1
  D[ID]b cw:f1
  4u do:f1
# else  /* PRESAT not defined */
  p16:gp11
  d16
  D[ID]b
  4u
# endif  /* PRESAT */
#else   /* NOZQS not defined, i.e. run ZQS */
  10u gron12
  (p32:sp29 ph0):f1
  20u groff
  p16:gp11
# ifdef PRESAT
  d16 pl9:f1
  D[ID]a cw:f1
  4u do:f1
# else   /* PRESAT not defined */
  d16 pl1:f1
  D[ID]a
  4u
# endif  /* PRESAT */
#endif  /* NOZQS */
  4u pl1:f1
}
else
{
#ifdef NOZQS
  p16:gp11*0.65
#else
  10u gron12
  (p32:sp29 ph0):f1
  20u groff
#endif  /* NOZQS */
  d16 pl10:f1

  |DIPSI|

  p16:gp11
  d16 pl1:f1
#ifdef NOZQS
#else
  10u gron12*1.333
  (p32*0.75:sp29 ph0):f1
  20u groff
  d16 pl1:f1
#endif  /* NOZQS */
}
  (p1 ph0):f1
  |SOLVSUPP|
  goscnp ph26
`;
const mod = new NOAHModule("H_N_T", "h1", "N T", [], "noah_noesy States noah_tocsy States", "NOESY (States)/TOCSY (States)", shortDescription, [AF_PRESAT_NOE, AF_NOZQS, AF_ES], preamble, pulprog, 1, true);
export default mod;
// vim: syntax=bruker:
