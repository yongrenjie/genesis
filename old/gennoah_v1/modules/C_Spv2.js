// vim: filetype=bruker:

export const C_Spv2 = {};

C_Spv2.shortDescription = `; 13C sensitivity-enhanced HSQC (version 2)
;     [use -DEDIT for multiplicity editing]`

C_Spv2.preamble = `
"p2      = p1*2"                       ; 1H hard 180
"p4      = p3*2"                       ; 13C hard 180
"d2      = 0.5s/cnst2"                 ; JCOMP
"d4      = 0.25s/cnst2"                ; 13C INEPT
"d0      = 3u"                         ; 13C HSQC t1
"in0     = inf1/2"                     ; 13C HSQC increment
define delay DC_SpB1
define delay DC_SpB2
define delay DC_SpB3
define delay DC_SpB4
define delay DC_SpB5
define delay DC_SpB6
define delay DC_SpB7
define delay DC_SpB8
define delay DC_SpB9
"DC_SpB1 = d4-p14/2"                     ; zz-filter
"DC_SpB2 = d4+p14/2"                     ; zz-filter
"DC_SpB3 = d4-larger(p2,p14)/2"          ; INEPT
"DC_SpB4 = d2-p16-d16-p2-d0*2-p3*2/PI"   ; 13C editing period
"DC_SpB5 = d2-p2+p3*2/PI"                ; 13C editing period
"DC_SpB6 = p16+d16+p2+d0*2-4u"           ; 13C post-t1, if no editing
"DC_SpB7 = d6-cnst17*p24/2-p19-d16"      ; first spin echo after t1
"DC_SpB8 = d4-larger(p2,p14)/2-p16-d16"  ; second spin echo after t1
"DC_SpB9 = p16+d16-p1*0.78+de+8u"        ; final spin echo for refocusing gradient
`


C_Spv2.module = `
  ; 13C-1H seHSQC version 2

  ; reverse zz-filter
  (p1 ph1):f1
  DC_SpB1
  (p14:sp3 ph1):f2
  (p2 ph1):f1
  DC_SpB2
  (p1 ph1):f1
  DC_SpB1
  (p14:sp3 ph1):f2
  (p2 ph1):f1
  DC_SpB2            ; 13C-1H: y,  12C-1H: z

  ; forward INEPT
#ifdef EDIT
  (p1 ph2):f1
#else
  (p1 ph9):f1
#endif
  DC_SpB3
  4u
  (center (p2 ph1):f1 (p14:sp3 ph1):f2 )
  4u
  DC_SpB3 pl2:f2
  4u
  (p1 ph2):f1 (p3 ph3):f2

  ; t1 evolution
  d0
  (p2 ph5):f1
  d0

  ; optional multiplicity editing
  ; edited part from hsqcedetgpsisp2.3
  ; nonedited part from hsqcetgpsisp2.2
#ifdef EDIT
  p16:gp1*EA
  d16
  DC_SpB4
  (p31:sp18 ph1):f2
  (p2 ph1):f1
  DC_SpB5
  4u
  (p31:sp18 ph1):f2
  2u
  2u pl2:f2
#else
  p16:gp1*EA
  d16
  (p24:sp7 ph1):f2
  4u
  DC_SpB6 pl2:f2
#endif

  ; reverse INEPT for first component
  (center (p1 ph1):f1 (p3 ph5):f2 )
  p19:gp3
  d16
  DC_SpB7
  (center (p2 ph1):f1 (p24:sp7 ph1):f2 )
  DC_SpB7
  p19:gp3
  d16 pl2:f2
#ifdef EDIT
  (center (p1 ph2):f1 (p3 ph7):f2 )
#else
  (center (p1 ph2):f1 (p3 ph6):f2 )
#endif

  ; reverse INEPT for second component
  p16:gp4
  d16
  DC_SpB8
  (center (p2 ph1):f1 (p14:sp3 ph1):f2 )
  DC_SpB8
  p16:gp4
  d16
  (p1 ph1):f1

  ; spin echo for refocusing gradient
  DC_SpB9
  (p2 ph1):f1
  4u
  p16:gp2
  d16 pl12:f2
  4u
  goscnp ph29 cpd2:f2   ; acquire 13C HSQC
  50u do:f2
`

C_Spv2.ea_inc = `
  1m ip6*2
  1m ip7*2
`

C_Spv2.t1_inc = `
  1m id0
  1m ip3*2
  1m ip29*2
`

C_Spv2.phases = `
ph3=0 2                 ; coherence transfer H->C
ph5=0 0 2 2
ph6=1 1 3 3             ; sensitivity enhancement 90 without editing
ph7=3 3 1 1             ; sensitivity enhancement 90 with editing
ph9=3
ph29=0 2 2 0
`

C_Spv2.gradients = `
;gpz1: 80%
;gpz2: 20.1%
;gpz3: 11%
;gpz4: -5%
`

C_Spv2.wavemaker = `
;sp18:wvm:wu180Jcomp: cawurst-40(280 ppm; Jcomp, L2H)
;sp3:wvm:wu180C13: cawurst-20(60 kHz, 0.5 ms; L2H)
;cpd2:wvm:wudec: cawurst_d-20(220 ppm, 1.4 ms; L2H)
`
