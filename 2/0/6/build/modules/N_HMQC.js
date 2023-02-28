import NOAHModule from "../noahModule.js";
let shortDescription = `; 15N HMQC
;     [set SW(ppm) as cnst40; optional k-scaling with cnst39]`;
let preamble = `
"p2      = p1*2"                       ; 1H hard 180
"p22     = p21*2"                      ; 15N hard 180
"p22     = p21*2"                      ; 15N hard 180
"d24     = 0.25s/cnst4"                ; 15N INEPT
"d20     = 3u"                         ; 15N HMQC t1/2
"in20    = 1000000/(2*cnst40*sfo3)"    ; 15N HMQC increment: cnst40 = SW(15N)
define delay DN_HMQC1
define delay DN_HMQC2
"DN_HMQC1   = p2/2+d20-4u+p21*2/PI+p17+d16"
"DN_HMQC2   = d24-p17-d16-de-8u+p1*2/PI"
"p17     = p16*cnst16"                 ; Longer gradients for 15N HMQC
"cnst44  = 2*sfo3/sfo1"                ; gradient ratio
define list<gradient> GN_HMQC={cnst44}
`;
let pulprog = `
  ; 15N-1H HMQC

  (p1 ph2):f1
  d24
  (center (p2 ph0):f1 (p22 ph0):f3)
  d24
  (p1 ph2):f1
  (p21 ph4):f3

  4u
  ; p16:gp2*-1*EA
  ; d16
  DN_HMQC1
  (p22 ph4):f3
  d20
  p17:gp2
  d16
  (p2 ph11)
  p17:gp2
  d16
  d20
  (p22 ph7):f3
  4u
  ; p16:gp2*-1*EA
  ; d16
  DN_HMQC1
  (p21 ph7):f3
  d24
  (center (p2 ph0):f1 (p22 ph0):f3)
  4u
  p17:gp2*EA*GN_HMQC
  d16
  DN_HMQC2
  4u pl16:f3
  4u

  goscnp ph29 cpd3:f3
  50u do:f3
`;
const mod = new NOAHModule("n15", "M", "noah_nhsqc", shortDescription, preamble, pulprog);
export default mod;
// vim: syntax=bruker:
