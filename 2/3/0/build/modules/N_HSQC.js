import NOAHModule from "../noahModule.js";
let shortDescription = `; 15N HSQC
;     [set SW(ppm) as cnst40; optional k-scaling with cnst39]`;
let preamble = `
"p2     = p1*2"                       ; 1H hard 180
"p22    = p21*2"                      ; 15N hard 180
"d24    = 0.25s/cnst4"                ; 15N INEPT
"d20    = 3u"                         ; 15N HSQC t1/2
"in20   = 1000000/(2*cnst40*sfo3)"    ; 15N HSQC increment: cnst40 = SW(15N)
"D[ID]a = d24-p22/2"
"D[ID]b = d24+p22/2"
"D[ID]c = p17+d16+p2/2+d20-p21*2/PI+4u"
"D[ID]d = D[ID]b-p17-d16-p21-de+p1*2/PI-8u"
"p17    = p16*cnst16"                 ; Longer gradients for 15N HSQC
"cnst44 = 2*sfo3/sfo1"                ; gradient ratio
define list<gradient> G[ID]={cnst44}
`;
let pulprog = `
  ; 15N-1H HSQC

  ; INEPT
  (p1 ph0):f1
  D[ID]a
  (p22 ph0):f3
  (p2 ph0):f1
  D[ID]b
  (p1 ph1):f1
  (p21 ph4):f3

  ; t1 period
  D[ID]c
  (p22 ph0):f3
  4u
  p17:gp2
  d16
  d20
  (p2 ph11):f1
  d20
  4u
  p17:gp2
  d16
  (p22 ph0):f3
  D[ID]c

  ; reverse INEPT
  (p21 ph7):f3
  (p1 ph0):f1
  D[ID]a
  (p22 ph0):f3
  (p2 ph1):f1
  4u
  p17:gp2*EA*G[ID]
  d16
  D[ID]d
  (p21 ph0):f3
  4u pl16:f3
  goscnp ph29 cpd3:f3
  50u do:f3
`;
const mod = new NOAHModule("N_HSQC", "n15", "Sn", [], "noah_nhsqc", "15N HSQC", shortDescription, [], preamble, pulprog, 1, false);
export default mod;
// vim: syntax=bruker:
