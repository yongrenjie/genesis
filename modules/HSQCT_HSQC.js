// vim: filetype=bruker:

const HSQCT_HSQC = {};
export default HSQCT_HSQC;

HSQCT_HSQC.nuclei = `CH`;

HSQCT_HSQC.shortCode = `2S`;

HSQCT_HSQC.shortDescription = `; 13C HSQC followed by DIPSI-2
;     [use -DTEDIT for multiplicity editing]`

HSQCT_HSQC.auprog = `noah_hsqc`;

HSQCT_HSQC.preamble = `
"p6      = (1000000/(4*cnst10))"       ; pw90 for DIPSI-2
"plw10   = plw1*(p1/p6)*(p1/p6)"       ; power level for DIPSI-2
"p2      = p1*2"                       ; 1H hard 180
"d2      = 0.5s/cnst2"                 ; JCOMP
"d4      = 0.25s/cnst2"                ; 13C INEPT
"d0      = 3u"                         ; 13C HSQC t1
"in0     = inf1/2"                     ; 13C HSQC increment
"l13     = (d19/(p6*115.112))/2"       ; half the number of HSQC-TOCSY DIPSI-2 loops
"l14     = l13*2"                      ; number of HSQC-TOCSY DIPSI-2 loops
define delay DHSQCT_HSQC1
define delay DHSQCT_HSQC2
define delay DHSQCT_HSQC3
define delay DHSQCT_HSQC4
define delay DHSQCT_HSQC5
define delay DHSQCT_HSQC6
define delay DHSQCT_HSQC7
"DHSQCT_HSQC1   = (asin(cnst32)/(2*PI*cnst2))-p14/2000000"
"DHSQCT_HSQC2   = (asin(cnst32)/(2*PI*cnst2))+p14/2000000"
"DHSQCT_HSQC3   = p16+d16+p2/2+d0-p3*2/PI+4u"
"DHSQCT_HSQC4   = d2+p3+p2/2"
"DHSQCT_HSQC5   = DHSQCT_HSQC3+p3-p2/2"
"DHSQCT_HSQC6   = d4-p14/2"
"DHSQCT_HSQC7   = d4+p14/2-p16-d16-p3-de+p1*2/PI-8u"
"cnst41  = 2*sfo2/sfo1"                ; gradient ratio
define list<gradient> GHSQCT_HSQC={cnst41}
`

HSQCT_HSQC.module = `
  ; 13C-1H HSQC

  ; INEPT
  (p1 ph0):f1
  DHSQCT_HSQC1
  (p14:sp3 ph0):f2
  (p2 ph0):f1
  DHSQCT_HSQC2 pl2:f2
  (p1 ph1):f1
  (p3 ph5):f2
  DHSQCT_HSQC3

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
  DHSQCT_HSQC4
  (p31:sp18 ph0):f2
  DHSQCT_HSQC5
  (p2 ph1):f1
  d2 pl2:f2
#else
  (p14:sp3 ph0):f2
  DHSQCT_HSQC3 pl2:f2
#endif /* TEDIT */

  ; reverse INEPT
  (p3 ph7):f2
  (p1 ph0):f1
  DHSQCT_HSQC6
  (p14:sp3 ph0):f2
  (p2 ph1):f1
  4u
  p16:gp3*GHSQCT_HSQC
  d16 pl2:f2
  DHSQCT_HSQC7
  (p3 ph0):f2
  4u pl12:f2
  goscnp ph30 cpd2:f2
  50u do:f2

  ; DIPSI-2 mixing before next module
if "d19 > 1m"
{
  50u
  p16:gp13
  d16 pl10:f1
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
  p16:gp13*1.333
  d16
}
`
