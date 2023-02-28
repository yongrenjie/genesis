import NOAHModule from "../noahModule.js";
let shortDescription = `; 15N HMQC
;     [set SW(ppm) as cnst40; optional k-scaling with cnst39]`;
let preamble = `
"p2     = p1*2"                       ; 1H hard 180
"p22    = p21*2"                      ; 15N hard 180
"p22    = p21*2"                      ; 15N hard 180
"d24    = 0.25s/cnst4"                ; 15N INEPT
"d20    = 3u"                         ; 15N HMQC t1/2
"in20   = 1000000/(2*cnst40*sfo3)"    ; 15N HMQC increment: cnst40 = SW(15N)
"D[ID]a = p17+d16+p2/2+d20+4u-p21*2/PI"
"D[ID]b = d24-p17-d16-de-4u+p1*2/PI"
"p17    = p16*cnst16"                 ; Longer gradients for 15N HMQC
"cnst44 = 2*sfo3/sfo1"                ; gradient ratio
define list<gradient> G[ID]={cnst44}
`;
let pulprog = `
  ; 15N-1H HMQC

  (p1 ph2):f1
  d24
  (center (p2 ph0):f1 (p22 ph0):f3)
  d24
  (p1 ph2):f1
  (p21 ph4):f3
  D[ID]a
  (p22 ph0):f3
  4u
  p17:gp2
  d16

  d20
  (p2 ph11)
  d20

  4u
  p17:gp2
  d16
  (p22 ph0):f3
  D[ID]a
  (p21 ph7):f3
  d24
  (center (p2 ph0):f1 (p22 ph0):f3)
  4u
  p17:gp2*EA*G[ID]
  d16
  D[ID]b
  4u pl16:f3

  goscnp ph29 cpd3:f3
  50u do:f3
`;
const mod = new NOAHModule("N_HMQC", "n15", "Mn", [], "noah_nhsqc", "15N HMQC", shortDescription, [], preamble, pulprog, 1, false);
export default mod;
// vim: syntax=bruker:
