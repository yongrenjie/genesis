// vim: filetype=bruker:

const CI_HSQC_F2J = {};
export default CI_HSQC_F2J;

CI_HSQC_F2J.nuclei = `CH`;

CI_HSQC_F2J.shortCode = `Sj`;

CI_HSQC_F2J.shortDescription = `; 13C HSQC (F2-coupled) with variable INEPT excitation
;     [specify fraction of 1J(CH) magnetisation to use with cnst32]
;     [use -DEDIT1 for multiplicity editing]`

CI_HSQC_F2J.auprog = `noah_hsqc`;

CI_HSQC_F2J.preamble = `
"p2      = p1*2"                       ; 1H hard 180
"d2      = 0.5s/cnst2"                 ; JCOMP
"d4      = 0.25s/cnst2"                ; 13C INEPT
"d0      = 3u"                         ; 13C HSQC t1
"in0     = inf1/2"                     ; 13C HSQC increment
"l13     = (d19/(p6*115.112))/2"       ; half the number of HSQC-TOCSY DIPSI-2 loops
"l14     = l13*2"                      ; number of HSQC-TOCSY DIPSI-2 loops
define delay DCI_HSQC_F2J1
define delay DCI_HSQC_F2J2
define delay DCI_HSQC_F2J3
define delay DCI_HSQC_F2J4
define delay DCI_HSQC_F2J5
define delay DCI_HSQC_F2J6
define delay DCI_HSQC_F2J7
"DCI_HSQC_F2J1   = (asin(cnst32)/(2*PI*cnst2))-p14/2000000"
"DCI_HSQC_F2J2   = (asin(cnst32)/(2*PI*cnst2))+p14/2000000"
"DCI_HSQC_F2J3   = p16+d16+p2/2+d0-p3*2/PI+4u"
"DCI_HSQC_F2J4   = d2+p3+p2/2"
"DCI_HSQC_F2J5   = DCI_HSQC_F2J3+p3-p2/2"
"DCI_HSQC_F2J6   = d4-p14/2"
"DCI_HSQC_F2J7   = d4+p14/2-p16-d16-p3-de+p1*2/PI-8u"
"cnst41  = 2*sfo2/sfo1"                ; gradient ratio
define list<gradient> GCI_HSQC_F2J={cnst41}
`

CI_HSQC_F2J.module = `
  ; 13C-1H HSQC (F2-coupled) with variable INEPT excitation

  ; INEPT
  (p1 ph0):f1
  DCI_HSQC_F2J1
  (p14:sp3 ph0):f2
  (p2 ph0):f1
  DCI_HSQC_F2J2 pl2:f2
  (p1 ph1):f1
  (p3 ph5):f2
  DCI_HSQC_F2J3

  ; t1 period
#ifdef EDIT1
  (p31:sp18 ph0):f2
#else
  (p14:sp3 ph0):f2
#endif /* EDIT1 */
  4u
  p16:gp3
  d16
  d0
  (p2 ph11):f1
  d0
  4u
  p16:gp3
  d16

  ; multiplicity editing
#ifdef EDIT1
  DCI_HSQC_F2J4
  (p31:sp18 ph0):f2
  DCI_HSQC_F2J5
  (p2 ph1):f1
  d2 pl2:f2
#else
  (p14:sp3 ph0):f2
  DCI_HSQC_F2J3 pl2:f2
#endif /* EDIT1 */

  ; reverse INEPT
  (p3 ph7):f2
  (p1 ph0):f1
  DCI_HSQC_F2J6
  (p14:sp3 ph0):f2
  (p2 ph1):f1
  4u
  p16:gp3*GCI_HSQC_F2J*EA
  d16 pl2:f2
  DCI_HSQC_F2J7
  (p3 ph0):f2
  4u pl12:f2
  goscnp ph30
  50u

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
