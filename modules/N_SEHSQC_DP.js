// vim: filetype=bruker:

const N_SEHSQC_DP = {};
export default N_SEHSQC_DP;

N_SEHSQC_DP.shortDescription = "; 15N sensitivity-enhanced HSQC (version 1)";
N_SEHSQC_DP.shortCode = `Spv1`;
N_SEHSQC_DP.nuclei = `NH`;
N_SEHSQC_DP.auprog = `noah_nhsqc`;

N_SEHSQC_DP.preamble = `
"p2      = p1*2"                       ; 1H hard 180
"p22     = p21*2"                      ; 15N hard 180
"d24     = 0.25s/cnst4"                ; 15N INEPT
"d20     = 3u"                         ; 15N HSQC t1/2
"in20    = 1000000/(2*cnst40*sfo3)"    ; 15N HSQC increment: cnst40 = SW(15N)
"p17     = p16*cnst16"                 ; Longer gradients for 15N seHSQC
define delay DN_SEHSQC_DP1
define delay DN_SEHSQC_DP2
define delay DN_SEHSQC_DP3
define delay DN_SEHSQC_DP4
define delay DN_SEHSQC_DP5
define delay DN_SEHSQC_DP6
define delay DN_SEHSQC_DP7
"DN_SEHSQC_DP1 = d24-p22/2"
"DN_SEHSQC_DP2 = d24+p22/2"
"DN_SEHSQC_DP3 = p17+d16+p2/2+4u+d20-p21*2/PI"
"DN_SEHSQC_DP4 = d26-larger(p2,p22)/2-p19-d16"
"DN_SEHSQC_DP5 = d24-larger(p2,p22)/2-p16-d16"
"DN_SEHSQC_DP6 = d24-larger(p2,p22)/2-p1*0.78"
"DN_SEHSQC_DP7 = d24-p17-d16-de-larger(p2,p22)/2"
"cnst44  = 2*sfo3/sfo1"                ; gradient ratio
define list<gradient> GN_SEHSQC_DP={cnst44}
`

N_SEHSQC_DP.module = `
  ; 15N-1H seHSQC, version 1

  ; INEPT
  (p1 ph0):f1
  DN_SEHSQC_DP1
  (p22 ph0):f3
  (p2 ph0):f1
  DN_SEHSQC_DP2
  (p1 ph1):f1
  (p21 ph4):f3

  ; t1
  DN_SEHSQC_DP3
  (p22 ph0):f3
  4u
  p17:gp2
  d16
  d20
  (p2 ph1):f1
  d20
  4u
  p17:gp2
  d16
  (p22 ph0):f3
  DN_SEHSQC_DP3

  ( center
    (p21 ph7):f3
    (p1 ph0 p1 ph1):f1
  )

  ; first spin echo
  DN_SEHSQC_DP4
  p19:gp8
  d16
  (center (p2 ph1):f1 (p22 ph7):f3 )
  DN_SEHSQC_DP4
  p19:gp8
  d16
  ; second spin echo
  (center (p1 ph2):f1 (p21 ph9):f3 )
  p16:gp9
  d16
  DN_SEHSQC_DP5
  (center (p2 ph1):f1 (p22 ph7):f3 )
  DN_SEHSQC_DP5
  p16:gp9
  d16
  ; third spin echo
  (p1 ph1):f1
  DN_SEHSQC_DP6
  (center (p2 ph0):f1 (p22 ph7):f3 )
  p17:gp2*EA*GN_SEHSQC_DP
  d16
  DN_SEHSQC_DP7 pl16:f3
  goscnp ph27 cpd3:f3
  50u do:f3
`
