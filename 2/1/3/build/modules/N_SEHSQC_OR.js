import NOAHModule from "../noahModule.js";
let shortDescription = `; 15N sensitivity-enhanced HSQC
;     [set SW(ppm) as cnst40; optional k-scaling with cnst39]`;
let preamble = `
"p2     = p1*2"                       ; 1H hard 180
"p22    = p21*2"                      ; 15N hard 180
"d24    = 0.25s/cnst4"                ; 15N INEPT
"d20    = 3u"                         ; 15N HSQC t1/2
"in20   = 1000000/(2*cnst40*sfo3)"    ; 15N HSQC increment: cnst40 = SW(15N)
"p17    = p16*cnst16"                 ; Longer gradients for 15N seHSQC v2
"D[ID]a = d24-p22/2"                    ; zz-filter
"D[ID]b = d24+p22/2"                    ; zz-filter
"D[ID]c = d24-larger(p2,p22)/2"         ; INEPT
"D[ID]d = p17+d16+p2+d20*2-4u"          ; 15N post-t1, if no editing
"D[ID]e = d26-larger(p2,p22)/2-p19-d16" ; first spin echo after t1
"D[ID]f = d24-larger(p2,p22)/2-p16-d16" ; second spin echo after t1
"D[ID]g = p17+d16-p1*0.78+de+8u"        ; final spin echo for refocusing gradient
"cnst46 = sfo3/sfo1"                    ; gradient ratio
define list<gradient> G[ID]={cnst46}
`;
let pulprog = `
  ; 15N-1H seHSQC

  ; forward INEPT
  (p1 ph3):f1
  D[ID]c
  4u
  (center (p2 ph0):f1 (p22 ph0):f3 )
  4u
  D[ID]c
  4u
  (p1 ph1):f1
  (p21 ph4):f3

  ; t1 evolution
  d20
  (p2 ph7):f1
  d20
  p17:gp2*EA
  d16
  (p22 ph0):f3
  4u
  D[ID]d

  ; reverse INEPT for first component
  (center (p1 ph0):f1 (p21 ph7):f3 )
  p19:gp8
  d16
  D[ID]e
  (center (p2 ph0):f1 (p22 ph0):f3 )
  D[ID]e
  p19:gp8
  d16
  (center (p1 ph1):f1 (p21 ph9):f3 )

  ; reverse INEPT for second component
  p16:gp9
  d16
  D[ID]f
  (center (p2 ph0):f1 (p22 ph0):f3 )
  D[ID]f
  p16:gp9
  d16
  (p1 ph0):f1

  ; spin echo for refocusing gradient
  D[ID]g
  (p2 ph0):f1
  4u
  p17:gp2*G[ID]
  d16 pl16:f3
  4u
  goscnp ph29 cpd3:f3
  50u do:f3
`;
const mod = new NOAHModule("N_SEHSQC_OR", "n15", "Spn", [], "noah_nhsqc", shortDescription, [], preamble, pulprog, 1, false);
export default mod;
// vim: syntax=bruker:
