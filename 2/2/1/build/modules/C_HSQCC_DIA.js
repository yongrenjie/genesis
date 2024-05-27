import NOAHModule from "../noahModule.js";
let shortDescription = `; 13C TS HSQC-COSY + HSQC`;
let preamble = `
"p2      = p1*2"                       ; 1H hard 180
"d2      = 0.5s/cnst2"                 ; JCOMP
"d4      = 0.25s/cnst2"                ; 13C INEPT
"d12     = 0.25s/cnst12"               ; COSY mixing (< 1/4J(HH))
"d3      = 3u"                         ; 13C HSQC t1
"in3     = inf1/2"                     ; 13C HSQC increment
"D[ID]a  = d4-p14/2"
"D[ID]b  = d4+p14/2"
"D[ID]c  = p16+d16+p2/2+d3-p3*2/PI+4u"
"D[ID]d  = d4-p14/2"
"D[ID]e  = d12-d4-p14/2"
"D[ID]f  = d2-p31/2"
"D[ID]g  = d2+p31/2"
"D[ID]h  = d2+p31/2-p16-d16-p3-4u-de"
"cnst41  = 2*sfo2/sfo1"                ; gradient ratio
define list<gradient> G[ID]={cnst41}
`;
let pulprog = `
  ; 13C-1H HSQC-COSY

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
  (p1 ph1):f1
  D[ID]d  ; d4-p14/2
  (p14:sp3 ph0):f2
  D[ID]e  ; d12-d4-p14/2
  (p2 ph1):f1
  d12
  (p1 ph1):f1
if "l1 % 2 == 0"
{
  D[ID]f         ; d2-p31/2
  (p31:sp18 ph0):f2
}
else
{
  D[ID]g         ; d2+p31/2
}
  (p2 ph1):f1
  D[ID]h pl2:f2 ; d2+p31/2-(...)
  p16:gp4*G[ID]*EA_TS
  d16
  (p3 ph0):f2
  4u pl12:f2
  goscnp ph24 cpd2:f2   ; acquire 13C HSQC-COSY
  50u do:f2
`;
const mod = new NOAHModule("C_HSQCC_DIA", "c13", "Sc S", [], "noah_hsqc noah_TS", shortDescription, [], preamble, pulprog, 1, true);
export default mod;
// vim: syntax=bruker:
