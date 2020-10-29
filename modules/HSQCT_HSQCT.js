// vim: filetype=bruker:

const HSQCT_HSQCT = {};
export default HSQCT_HSQCT;

HSQCT_HSQCT.nuclei = `CH`;

HSQCT_HSQCT.shortCode = `St`;

HSQCT_HSQCT.shortDescription = `; 13C HSQC-TOCSY
;     [use -DTEDIT for multiplicity editing]`

HSQCT_HSQCT.auprog = `noah_hsqc`;

HSQCT_HSQCT.preamble = `
"p6      = (1000000/(4*cnst10))"       ; pw90 for DIPSI-2
"plw10   = plw1*(p1/p6)*(p1/p6)"       ; power level for DIPSI-2
"p2      = p1*2"                       ; 1H hard 180
"d2      = 0.5s/cnst2"                 ; JCOMP
"d4      = 0.25s/cnst2"                ; 13C INEPT
"d0      = 3u"                         ; 13C HSQC t1
"in0     = inf1/2"                     ; 13C HSQC increment
"l13     = (d19/(p6*115.112))/2"       ; half the number of HSQC-TOCSY DIPSI-2 loops
"l14     = l13*2"                      ; number of HSQC-TOCSY DIPSI-2 loops
define delay DHSQCT_HSQCT1
define delay DHSQCT_HSQCT2
define delay DHSQCT_HSQCT3
define delay DHSQCT_HSQCT4
define delay DHSQCT_HSQCT5
define delay DHSQCT_HSQCT6
define delay DHSQCT_HSQCT7
"DHSQCT_HSQCT1   = d4-p14/2"
"DHSQCT_HSQCT2   = d4+p14/2"
"DHSQCT_HSQCT3   = p16+d16+p2/2+d0-p3*2/PI+4u"
"DHSQCT_HSQCT4   = d2+p3+p2/2"
"DHSQCT_HSQCT5   = DHSQCT_HSQCT3+p3-p2/2"
"DHSQCT_HSQCT6   = d4+p14/2-p16-d16"
"DHSQCT_HSQCT7   = de+4u"
"cnst41  = 2*sfo2/sfo1"                ; gradient ratio
define list<gradient> GHSQCT_HSQCT={cnst41}
`

HSQCT_HSQCT.module = `
  ; 13C-1H HSQC

  ; INEPT
  (p1 ph0):f1
  DHSQCT_HSQCT1
  (p14:sp3 ph0):f2
  (p2 ph0):f1
  DHSQCT_HSQCT2 pl2:f2
  (p1 ph1):f1
  (p3 ph5):f2
  DHSQCT_HSQCT3

  ; t1 period
#ifdef TEDIT
  (p31:sp18 ph0):f2
#else
  (p14:sp3 ph0):f2
#endif /*TEDIT*/
  4u
  p16:gp3*EA
  d16
  d0
  (p2 ph11):f1
  d0
  4u
  p16:gp3*EA
  d16

  ; multiplicity editing
#ifdef TEDIT
  DHSQCT_HSQCT4
  (p31:sp18 ph0):f2
  DHSQCT_HSQCT5
  (p2 ph1):f1
  d2 pl2:f2
#else
  (p14:sp3 ph0):f2
  DHSQCT_HSQCT3 pl2:f2
#endif /* TEDIT */

  ; reverse INEPT
  (p3 ph7):f2
  (p1 ph2):f1    ; this phase (-x) differs from HSQC (+x) as HSQC-TOCSY has extra 180 at the end
  DHSQCT_HSQCT1
  (p14:sp3 ph0):f2
  (p2 ph1):f1

  p16:gp13
  d16
  DHSQCT_HSQCT6 pl10:f1

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

  4u
  p16:gp13*-1
  d16 pl1:f1

  DHSQCT_HSQCT7
  (p2 ph1):f1
  4u
  p16:gp3*GHSQCT_HSQCT
  d16 pl12:f2
  4u
  goscnp ph30 cpd2:f2   ; acquire 13C HSQC-TOCSY
  50u do:f2
`
