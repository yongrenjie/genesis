import { Kupce2017ACIE, Yong2021JMR } from "../citation.js";
import NOAHModule from "../noahModule.js";
let shortDescription = `; 13C HSQC-TOCSY / HSQC in IPAP mode`;
let preamble = `
"p2      = p1*2"                       ; 1H hard 180
"d2      = 0.5s/cnst2"                 ; JCOMP
"d4      = 0.25s/cnst2"                ; 13C INEPT
"d3      = 3u"                         ; 13C t1
"in3     = inf1/2"                     ; 13C increment
define delay DC_HSQCT_IA1
define delay DC_HSQCT_IA2
define delay DC_HSQCT_IA3
define delay DC_HSQCT_IA4
define delay DC_HSQCT_A5
define delay DC_HSQCT_I5
define delay DC_HSQCT_IA6
"DC_HSQCT_IA1   = d4-p14/2"
"DC_HSQCT_IA2   = d4+p14/2"
"DC_HSQCT_IA3   = p16+d16+p2/2+d3-p3*2/PI+4u"
"DC_HSQCT_IA4   = d4+p14/2-p16-d16"
"DC_HSQCT_A5    = d2-p14/2-p16-d16"
"DC_HSQCT_I5    = d2+p14/2-p16-d16"
"DC_HSQCT_IA6   = d2+p14/2-p16-d16-de"
"cnst41  = 2*sfo2/sfo1"                ; gradient ratio
define list<gradient> GC_HSQCT_IA={cnst41}
`;
let pulprog = `
  ; 13C-1H HSQC-TOCSY and HSQC

  ; INEPT
  (p1 ph0):f1
  DC_HSQCT_IA1
  (p14:sp3 ph0):f2
  (p2 ph0):f1
  DC_HSQCT_IA2 pl2:f2
  (p1 ph1):f1
  (p3 ph18):f2
  DC_HSQCT_IA3

  (p14:sp3 ph0):f2
  4u
  p16:gp4
  d16
  d3
  (p2 ph11):f1
  d3
  4u
  p16:gp4
  d16
  (p14:sp3 ph0):f2
  DC_HSQCT_IA3 pl2:f2

  ; reverse INEPT
  (p3 ph7):f2
  (p1 ph2):f1
  DC_HSQCT_IA1
  (p14:sp3 ph0):f2
  (p2 ph1):f1

  p16:gp13
  d16
  DC_HSQCT_IA4 pl10:f1

  |DIPSI|
  4u
  p16:gp13*-1
  d16 pl1:f1

if "l1 % 2 == 0"
{
  DC_HSQCT_A5
  (p14:sp3 ph0):f2 
  (p2 ph1):f1 
}
else
{
  DC_HSQCT_I5
  (p2 ph1):f1
}
  p16:gp4*GC_HSQCT_IA*EA_TS
  d16 pl12:f2 
  DC_HSQCT_IA6
  goscnp ph24 cpd2:f2   ; acquire 13C HSQC-TOCSY
  50u do:f2
`;
const mod = new NOAHModule("c13", "Stia", [Kupce2017ACIE, Yong2021JMR], "noah_hsqc noah_TS", shortDescription, preamble, pulprog);
export default mod;
// vim: syntax=bruker:
