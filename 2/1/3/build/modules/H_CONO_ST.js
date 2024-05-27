import { AF_PRESAT_NOE, AF_NOZQS, AcquFlag } from "../acquFlag.js";
import NOAHModule from "../noahModule.js";
let shortDescription = `; 1H COSY and NOESY (States F1)`;
let AF_ES_NOESYONLY = new AcquFlag("ES", "pre-acquisition excitation sculpting in NOESY");
let preamble = `
"d10    = 3u"                         ; COSY/NOESY t1
"in10   = 2*dw"                       ; COSY/NOESY increment
"D[ID]a = d8-de-aq-p32-p16-d16-52u"   ; NOE mixing time (with ZQS, without ES)
"D[ID]b = d8-de-aq-p16-d16-22u"       ; NOE mixing time (without ZQS, without ES)
`;
// ES in the COSY module is currently not working as expected - it leads to
// extra suppression in the NOESY module along particular f1 frequencies which
// correspond to the nulls in the inversion profile of the soft 180 pulse
// 
// If we ever get it to work correctly, then we need to:
//
// 1) Add it into the COSY part of the pulprog
//
// 2) Add the following lines to the preamble
//
// "D[ID]c = (4*(p16+d16))+(2*(p12+p2))+16u+de+p1*2/3.1416"   ; time taken for ES
// "D[ID]d = D[ID]a - D[ID]c"            ; NOE mixing time (with ZQS, with ES)
// "D[ID]e = D[ID]b - D[ID]c"            ; NOE mixing time (without ZQS, with ES)
//
// Make sure to change D[ID]c as needed, because the form of ES used may be
// different!
//
// 3) Change the NOESY mixing time from D[ID]a to D[ID]d, or from D[ID]b to
//    D[ID]e, if ES is defined
//
// Note that the process for CR and CT modules is far less complicated, because
// the mixing time doesn't need to be changed depending on whether ES is
// present in the COSY module.
let pulprog = `
  ; 1H-1H COSY + NOESY (States)

  ; COSY
  (p1 ph6):f1
  d10
  (p1 ph0):f1
  goscnp ph26  ; acquire H-H COSY

  ; NOESY
#ifdef NOZQS
# ifdef PRESAT
  /* NOZQS PRESAT */
  4u
  p16:gp11
  d16 pl9:f1
  D[ID]b cw:f1
  4u do:f1
  4u pl1:f1
  10u st
# else
  /* NOZQS only */
  4u
  p16:gp11
  d16 pl1:f1
  D[ID]b
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
  D[ID]a cw:f1
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
  D[ID]a
  18u st
# endif  /* PRESAT */
#endif  /* NOZQS */
  (p1 ph0):f1
  |SOLVSUPP|
  goscnp ph26  ; acquire H-H NOESY
`;
const mod = new NOAHModule("H_CONO_ST", "h1", "CNst", [], "noah_cosy States:noah_noesy States", shortDescription, [AF_PRESAT_NOE, AF_NOZQS, AF_ES_NOESYONLY], preamble, pulprog, 2, false);
export default mod;
// vim: syntax=bruker:
