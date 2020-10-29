// vim: filetype=bruker:

export const N_M = {};

N_M.shortDescription = "; 15N HMQC"

N_M.preamble = `
"p2      = p1*2"                       ; 1H hard 180
"p22     = p21*2"                      ; 15N hard 180
"p22     = p21*2"                      ; 15N hard 180
"d24     = 0.25s/cnst4"                ; 15N INEPT
"d20     = 3u"                         ; 15N HMQC t1/2
"in20    = 1000000/(2*cnst40*sfo3)"    ; 15N HMQC increment: cnst40 = SW(15N)
define delay DN_M1
define delay DN_M2
"DN_M1   = p2/2+d20-4u+p21*2/PI"
"DN_M2   = d24-p16-d16-de-8u+p1*2/PI"
`

N_M.module = `
  ; 15N-1H HMQC

  (p1 ph19):f1
  d24
  (center (p2 ph1):f1 (p22 ph1):f3)
  d24
  (p1 ph19):f1
  (p21 ph20):f3

  4u
  p16:gp21*-1*EA
  d16
  DN_M1
  (p22 ph20):f3
  d20
  p16:gp21*EA
  d16
  (p2 ph21)
  p16:gp21*EA
  d16
  d20
  (p22 ph22):f3
  4u
  p16:gp21*-1*EA
  d16
  DN_M1
  (p21 ph22):f3
  d24
  (center (p2 ph1):f1 (p22 ph1):f3)
  4u
  p16:gp22
  d16
  DN_M2
  4u pl16:f3
  4u

  goscnp ph28 cpd3:f3
  50u do:f3
`

N_M.nt1_inc = `
  1m id20
  1m ip20*2
  1m ip28*2
`

N_M.phases = `
ph19=2
ph20=0 2                ; coherence transfer H -> N
ph21=0 0 0 0 2 2 2 2    ; 1H 180 in t1
ph22=0 0 2 2
ph28=0 2 2 0
`

N_M.gradients = `
;gpz21: 80%
;gpz22: 32.4%
`
