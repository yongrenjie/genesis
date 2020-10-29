// vim: filetype=bruker:

export const N_S = {};

N_S.shortDescription = "; 15N HSQC"

N_S.preamble = `
"p2      = p1*2"                       ; 1H hard 180
"p22     = p21*2"                      ; 15N hard 180
"d24     = 0.25s/cnst4"                ; 15N INEPT
"d20     = 3u"                         ; 15N HSQC t1/2
"in20    = 1000000/(2*cnst40*sfo3)"    ; 15N HSQC increment: cnst40 = SW(15N)
define delay DN_S1
define delay DN_S2
define delay DN_S3
define delay DN_S4
"DN_S1   = d24-p22/2"
"DN_S2   = d24+p22/2"
"DN_S3   = p16+d16+p2/2+d20-p21*2/PI+4u"
"DN_S4   = DN_S2-p16-d16-p21-de+p1*2/PI-8u"
`

N_S.module = `
  ; 15N-1H HSQC

  ; INEPT
  (p1 ph1):f1
  DN_S1
  (p22 ph1):f3
  (p2 ph1):f1
  DN_S2
  (p1 ph2):f1
  (p21 ph20):f3
  DN_S3

  ; t1 period
  (p22 ph1):f3
  4u
  p16:gp21*EA
  d16
  d20
  (p2 ph21):f1
  d20
  4u
  p16:gp21*EA
  d16
  (p22 ph1):f3
  DN_S3

  ; reverse INEPT
  (p21 ph22):f3
  (p1 ph1):f1
  DN_S1
  (p22 ph1):f3
  (p2 ph2):f1
  4u
  p16:gp22
  d16
  DN_S4
  (p21 ph1):f3
  4u pl16:f3
  goscnp ph28 cpd3:f3
  50u do:f3
`

N_S.nt1_inc = `
  1m id20
  1m ip20*2
  1m ip28*2
`

N_S.phases = `
ph20=0 2                ; coherence transfer H->N
ph21=0 0 0 0 2 2 2 2
ph22=0 0 2 2
ph28=0 2 2 0
`

N_S.gradients = `
;gpz21: 80%
;gpz22: 16.2%
`
