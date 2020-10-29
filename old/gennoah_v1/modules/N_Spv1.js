// vim: filetype=bruker:

export const N_Spv1 = {};

N_Spv1.shortDescription = "; 15N sensitivity-enhanced HSQC (version 1)"

N_Spv1.preamble = `
"p2      = p1*2"                       ; 1H hard 180
"p22     = p21*2"                      ; 15N hard 180
"d24     = 0.25s/cnst4"                ; 15N INEPT
"d20     = 3u"                         ; 15N HSQC t1/2
"in20    = 1000000/(2*cnst40*sfo3)"    ; 15N HSQC increment: cnst40 = SW(15N)
"p17     = p16*cnst16"                 ; Longer gradients for 15N seHSQC
define delay DN_SpA1
define delay DN_SpA2
define delay DN_SpA3
define delay DN_SpA4
define delay DN_SpA5
define delay DN_SpA6
define delay DN_SpA7
"DN_SpA1 = d24-p22/2"
"DN_SpA2 = d24+p22/2"
"DN_SpA3 = p17+d16+p2/2+4u+d20-p21*2/PI"
"DN_SpA4 = d26-larger(p2,p22)/2-p19-d16"
"DN_SpA5 = d24-larger(p2,p22)/2-p16-d16"
"DN_SpA6 = d24-larger(p2,p22)/2-p1*0.78"
"DN_SpA7 = d24-p17-d16-de-larger(p2,p22)/2"
`

N_Spv1.module = `
  ; 15N-1H seHSQC, version 1

  ; INEPT
  (p1 ph1):f1
  DN_SpA1
  (p22 ph1):f3
  (p2 ph1):f1
  DN_SpA2
  (p1 ph2):f1
  (p21 ph20):f3
  DN_SpA3

  ; t1
  (p22 ph1):f3
  4u
  p17:gp21
  d16
  d20
  (p2 ph2):f1
  d20
  4u
  p17:gp21
  d16
  (p22 ph1):f3
  DN_SpA3

  ( center
    (p21 ph22):f3
    (p1 ph1 p1 ph2):f1
  )

  ; first spin echo
  DN_SpA4
  p19:gp23
  d16
  (center (p2 ph2):f1 (p22 ph22):f3 )
  DN_SpA4
  p19:gp23
  d16
  ; second spin echo
  (center (p1 ph19):f1 (p21 ph23):f3 )
  p16:gp24
  d16
  DN_SpA5
  (center (p2 ph2):f1 (p22 ph22):f3 )
  DN_SpA5
  p16:gp24
  d16
  ; third spin echo
  (p1 ph2):f1
  DN_SpA6
  (center (p2 ph1):f1 (p22 ph22):f3 )
  p17:gp22*EA
  d16
  DN_SpA7 pl16:f3
  goscnp ph28 cpd3:f3
  50u do:f3
`

N_Spv1.ea_inc = `
  1m ip23*2
`

N_Spv1.nt1_inc = `
  1m id20
  1m ip20*2
  1m ip28*2
`

N_Spv1.phases = `
ph19=2
ph20=0 2                ; coherence transfer H -> N
ph22=0 0 2 2            ; 15N pulses after t1
ph23=1 1 3 3            ; sensitivity enhancement 90
ph28=1 3 3 1
`

N_Spv1.gradients = `
;gpz21: 80%
;gpz22: 16.2%
;gpz23: 11%
;gpz24: -5%
`
