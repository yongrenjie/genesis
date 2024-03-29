import { Yong2021JMR } from "../citation.js";
import NOAHModule from "../noahModule.js";

let shortDescription = `; 13C TS HSQC-TOCSY / HSQC`

let preamble = `
"p2      = p1*2"                       ; 1H hard 180
"d2      = 0.5s/cnst2"                 ; JCOMP
"d4      = 0.25s/cnst2"                ; 13C INEPT
"d3      = 3u"                         ; 13C t1
"in3     = inf1/2"                     ; 13C increment
"D[ID]a   = d4-p14/2"
"D[ID]b   = d4+p14/2"
"D[ID]c   = p16+d16+p2/2+d3-p3*2/PI+4u"
"D[ID]d   = d4+p14/2-p16-d16"
"D[ID]e    = d2-p14/2-p16-d16"
"D[ID]f    = d2+p14/2-p16-d16"
"D[ID]g   = d2+p14/2-p16-d16-de"
"cnst41  = 2*sfo2/sfo1"                ; gradient ratio
define list<gradient> G[ID]={cnst41}
`

let pulprog = `
  ; 13C-1H HSQC-TOCSY and HSQC

  ; INEPT
  (p1 ph0):f1
  D[ID]a
  (p14:sp3 ph0):f2
  (p2 ph0):f1
  D[ID]b pl2:f2
  (p1 ph1):f1
  (p3 ph18):f2
  D[ID]c

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
  D[ID]c pl2:f2

  ; reverse INEPT
  (p3 ph7):f2
  (p1 ph2):f1
  D[ID]a
  (p14:sp3 ph0):f2
  (p2 ph1):f1

  p16:gp13
  d16
  D[ID]d pl10:f1

  |DIPSI|
  4u
  p16:gp13*-1
  d16 pl1:f1

if "l1 % 2 == 0"
{
  D[ID]e
  (p14:sp3 ph0):f2 
  (p2 ph1):f1 
}
else
{
  D[ID]f
  (p2 ph1):f1
}
  p16:gp4*G[ID]*EA_TS
  d16 pl12:f2 
  D[ID]g
  goscnp ph24 cpd2:f2   ; acquire 13C HSQC-TOCSY
  50u do:f2
`

const mod = new NOAHModule(
    "C_HSQCT_IA",
    "c13",
    "St S",
    [Yong2021JMR],
    "noah_hsqc noah_TS",
    "13C IPAP HSQC-TOCSY",
    shortDescription,
    [],
    preamble,
    pulprog,
    1,
    true
);
export default mod;

// vim: syntax=bruker:
