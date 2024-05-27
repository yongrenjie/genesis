import { Reif1996JMR } from "../citation.js";
import NOAHModule from "../noahModule.js";
let shortDescription = `; 13C 1,1-ADEQUATE with ZIP element`;
let preamble = `
"p2      = p1*2"                       ; 1H hard 180
"d4      = 0.25s/cnst2"                ; 13C INEPT
"d0      = 3u"                         ; 13C HSQC t1
"in0     = inf1/2"                     ; 13C HSQC increment
"p8      = p3*1.333"                   ; 13C 120 deg pulse
"d27     = 0.25s/cnst3"                ; 1J(CC) evolution
"in28    = in0"
"d28     = d27-4u"
"D[ID]a  = d4-p14/2"
"D[ID]b  = d4+p14/2"
"D[ID]c  = d27-p24/2"
"D[ID]d  = p16+d16-p2-d0*2+4u"
"D[ID]e  = d27-p16-d16-4u-p2-d0"
"D[ID]f  = d6-cnst17*p24/2"
"D[ID]g  = p16+d16+6u"
`;
let pulprog = `
  ; 13C 1,1-ADEQUATE

  ; check that constant-time period (1/2J(CC)) is longer than t1max
  ; note: don't use d28 because that is being changed every increment!
if "(2 * d27) < (l0 * 2 * in0)"
{
  print "error: ADEQUATE constant-time period is too short: please decrease cnst3, reduce td1, or increase 13C SW"
  goto end
}

  ; ZIP element
#ifdef NOZZFADEQ
  (p1 ph0):f1
#else
  (p1 ph0):f1
  D[ID]a
  (p14:sp3 ph0):f2 
  (p2 ph0):f1 
  D[ID]b 
  (p1 ph0):f1
  D[ID]a
  (p14:sp3 ph0):f2 
  (p2 ph0):f1 
  D[ID]b pl2:f2 
  (p1 ph1):f1
#endif

  D[ID]a
  (center (p2 ph0):f1 (p14:sp3 ph0):f2 )
  D[ID]a pl2:f2
  (p1 ph1):f1 (p3 ph5):f2
  D[ID]c
  (p24:sp7 ph0):f2
  D[ID]c pl2:f2
  (p3 ph11):f2
  d0
  (p2 ph0):f1
  d0
  D[ID]d
  (p24:sp7 ph0):f2
  4u
  p16:gp22
  d16 pl2:f2
  (p8 ph13):f2
  4u
  d28
  (p24:sp7 ph0):f2
  4u
  p16:gp23
  d16
  D[ID]e pl2:f2
  (p2 ph0):f1
  d0
  (center (p1 ph0):f1 (p3 ph7):f2 )
  D[ID]f
  (center (p2 ph0):f1 (p24:sp7 ph0):f2 )
  D[ID]f pl2:f2
  (center (p1 ph1):f1 (p3 ph9):f2 )
  D[ID]a
  (center (p2 ph0):f1 (p14:sp3 ph0):f2 )
  D[ID]a
  (p1 ph0):f1
  D[ID]g
  (p2 ph0):f1
  3u
  p16:gp24*EA
  d16 pl12:f2 
  3u

  goscnp ph22 cpd2:f2
  50u do:f2
`;
const mod = new NOAHModule("C_ADEQ", "c13", "A", [Reif1996JMR], "noah_hsqc", "13C 1,1-ADEQUATE", shortDescription, [], preamble, pulprog, 1, false);
export default mod;
// vim: syntax=bruker:
