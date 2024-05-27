import { Kupce2017ACIE } from "../citation.js";
import NOAHModule from "../noahModule.js";
let shortDescription = `; 15N HSQC
;     [set SW(ppm) as cnst40; optional k-scaling with cnst39]`;
let preamble = `
"p2      = p1*2"                       ; 1H hard 180
"p22     = p21*2"                      ; 15N hard 180
"d24     = 0.25s/cnst4"                ; 15N INEPT
"d20     = 3u"                         ; 15N HSQC t1/2
"in20    = 1000000/(2*cnst40*sfo3)"    ; 15N HSQC increment: cnst40 = SW(15N)
define delay DN_HSQC1
define delay DN_HSQC2
define delay DN_HSQC3
define delay DN_HSQC4
"DN_HSQC1   = d24-p22/2"
"DN_HSQC2   = d24+p22/2"
"DN_HSQC3   = p17+d16+p2/2+d20-p21*2/PI+4u"
"DN_HSQC4   = DN_HSQC2-p17-d16-p21-de+p1*2/PI-8u"
"p17     = p16*cnst16"                 ; Longer gradients for 15N HSQC
"cnst44  = 2*sfo3/sfo1"                ; gradient ratio
define list<gradient> GN_HSQC={cnst44}
`;
let pulprog = `
  ; 15N-1H HSQC

  ; INEPT
  (p1 ph0):f1
  DN_HSQC1
  (p22 ph0):f3
  (p2 ph0):f1
  DN_HSQC2
  (p1 ph1):f1
  (p21 ph4):f3

  ; t1 period
  DN_HSQC3
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
  DN_HSQC3

  ; reverse INEPT
  (p21 ph7):f3
  (p1 ph0):f1
  DN_HSQC1
  (p22 ph0):f3
  (p2 ph1):f1
  4u
  p17:gp2*EA*GN_HSQC
  d16
  DN_HSQC4
  (p21 ph0):f3
  4u pl16:f3
  goscnp ph29 cpd3:f3
  50u do:f3
`;
const mod = new NOAHModule("n15", "Sn", [Kupce2017ACIE], "noah_nhsqc", shortDescription, preamble, pulprog);
export default mod;
// vim: syntax=bruker:
