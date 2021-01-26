// vim: filetype=bruker:

const HSQCT_SI = {};
export default HSQCT_SI;

HSQCT_SI.shortCode = `Stp`;

HSQCT_SI.nuclei = `CH`;

HSQCT_SI.shortDescription = `; 13C sensitivity-enhanced HSQC-TOCSY
;     [use -DTEDIT for multiplicity editing]`

HSQCT_SI.auprog = `noah_hsqc`;

HSQCT_SI.preamble = `
"p2      = p1*2"                       ; 1H hard 180
"d2      = 0.5s/cnst2"                 ; JCOMP
"d4      = 0.25s/cnst2"                ; 13C INEPT
"d0      = 3u"                         ; 13C HSQC t1
"in0     = inf1/2"                     ; 13C HSQC increment
"l13     = (d19/(p6*115.112))/2"       ; half the number of HSQC-TOCSY DIPSI-2 loops
"l14     = l13*2"                      ; number of HSQC-TOCSY DIPSI-2 loops
define delay DHSQCT_SI1
define delay DHSQCT_SI2
define delay DHSQCT_SI3
define delay DHSQCT_SI4
define delay DHSQCT_SI5
define delay DHSQCT_SI6
define delay DHSQCT_SI7
define delay DHSQCT_SI8
define delay DHSQCT_SI9
define delay DHSQCT_SI10
"DHSQCT_SI1 = d4-p14/2"                        ; zz-filter
"DHSQCT_SI2 = d4+p14/2"                        ; zz-filter
"DHSQCT_SI3 = d4-larger(p2,p14)/2"             ; INEPT
"DHSQCT_SI4 = p16+d16+p2+d0*2-4u-p3*2/PI"      ; 13C pre-t1 if editing
"DHSQCT_SI5 = d2-p16-d16+p3*2/PI"              ; 13C editing period
"DHSQCT_SI6 = d2-p2-p3*2/PI"                   ; 13C editing period
"DHSQCT_SI7 = p16+d16+p2/2+d0-4u-p3*2/PI"      ; 13C pre-/post-t1 if no editing
"DHSQCT_SI8 = d6-cnst17*p24/2-p19-d16"         ; first spin echo after t1
"DHSQCT_SI9 = d4-larger(p2,p14)/2-p16-d16-4u"  ; DIPSI spin echo
"DHSQCT_SI10= p16+d16-p1*0.78+de+8u"           ; final spin echo for refocusing gradient
"cnst41  = 2*sfo2/sfo1"                ; gradient ratio
define list<gradient> GHSQCT_SI={cnst41}
`


HSQCT_SI.module = `
  ; 13C-1H seHSQC-TOCSY

  ; reverse zz-filter
  (p1 ph0):f1
  DHSQCT_SI1
  (p14:sp3 ph0):f2
  (p2 ph0):f1
  DHSQCT_SI2
  (p1 ph0):f1
  DHSQCT_SI1
  (p14:sp3 ph0):f2
  (p2 ph0):f1
  DHSQCT_SI2            ; 13C-1H: y,  12C-1H: z

  ; forward INEPT
#ifdef TEDIT
  (p1 ph1):f1
#else
  (p1 ph3):f1
#endif
  DHSQCT_SI3
  4u
  (center (p2 ph0):f1 (p14:sp3 ph0):f2 )
  4u
  DHSQCT_SI3 pl2:f2
  4u
  (p1 ph1):f1 (p3 ph5):f2

  ; t1 evolution with optional multiplicity editing
#ifdef TEDIT
  4u
  DHSQCT_SI4
  (p31:sp18 ph0):f2
  p16:gp3
  d16 pl2:f2

  d0
  (p2 ph7):f1
  d0

  p16:gp3
  d16
  DHSQCT_SI5
  (p31:sp18 ph0):f2
  (p2 ph0):f1
  DHSQCT_SI6 pl2:f2
#else
  4u
  DHSQCT_SI7 
  (p24:sp7 ph0):f2
  p16:gp3
  d16 pl2:f2

  d0
  (p2 ph7):f1
  d0

  p16:gp3
  d16
  (p24:sp7 ph0):f2
  4u
  DHSQCT_SI7 pl2:f2
#endif

  ; reverse INEPT for first component
  (center (p1 ph0):f1 (p3 ph7):f2 )
  p19:gp6
  d16
  DHSQCT_SI8
  (center (p2 ph0):f1 (p24:sp7 ph0):f2 )
  DHSQCT_SI8
  p19:gp6
  d16 pl2:f2
  (center (p1 ph1):f1 (p3 ph9):f2 )  ; seHSQC pulse, incremented with EA

  ; reverse INEPT for second component
  4u
  p16:gp7
  d16
  DHSQCT_SI9
  (center (p2 ph0):f1 (p14:sp3 ph0):f2 )
  DHSQCT_SI9 pl10:f1
  p16:gp7
  d16

						;begin DIPSI2
5 p6*3.556 ph3
  p6*4.556 ph1
  p6*3.222 ph3
  p6*3.167 ph1
  p6*0.333 ph3
  p6*2.722 ph1
  p6*4.167 ph3
  p6*2.944 ph1
  p6*4.111 ph3
  
  p6*3.556 ph1
  p6*4.556 ph3
  p6*3.222 ph1
  p6*3.167 ph3
  p6*0.333 ph1
  p6*2.722 ph3
  p6*4.167 ph1
  p6*2.944 ph3
  p6*4.111 ph1

  p6*3.556 ph1
  p6*4.556 ph3
  p6*3.222 ph1
  p6*3.167 ph3
  p6*0.333 ph1
  p6*2.722 ph3
  p6*4.167 ph1
  p6*2.944 ph3
  p6*4.111 ph1

  p6*3.556 ph3
  p6*4.556 ph1
  p6*3.222 ph3
  p6*3.167 ph1
  p6*0.333 ph3
  p6*2.722 ph1
  p6*4.167 ph3
  p6*2.944 ph1
  p6*4.111 ph3
  lo to 5 times l14
						;end DIPSI2

  4u pl1:f1
  (p1 ph0):f1

  ; spin echo for refocusing gradient
  DHSQCT_SI10
  (p2 ph0):f1
  4u
  p16:gp3*EA*GHSQCT_SI
  d16 pl12:f2
  4u
  goscnp ph30 cpd2:f2   ; acquire 13C HSQC
  50u do:f2
`
