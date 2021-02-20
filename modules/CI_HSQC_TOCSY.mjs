// vim: filetype=bruker:

const CI_HSQC_TOCSY = {};
export default CI_HSQC_TOCSY;

CI_HSQC_TOCSY.nuclei = `CH`;

CI_HSQC_TOCSY.shortCode = `St`;

CI_HSQC_TOCSY.shortDescription = `; 13C HSQC-TOCSY with Ernst angle excitation
;     [specify fraction of 1J(CH) magnetisation to use with cnst32]`;

CI_HSQC_TOCSY.auprog = `noah_hsqc`;

CI_HSQC_TOCSY.preamble = `
"p2      = p1*2"                       ; 1H hard 180
"d4      = 0.25s/cnst2"                ; 13C INEPT
"d0      = 3u"                         ; 13C t1
"in0     = inf1/2"                     ; 13C increment
"l13     = (d19/(p6*115.112))/2"       ; half the number of HSQC-TOCSY DIPSI-2 loops
"l14     = l13*2"                      ; number of HSQC-TOCSY DIPSI-2 loops
define delay DCI_HSQC_TOCSY1
define delay DCI_HSQC_TOCSY2
define delay DCI_HSQC_TOCSY3
define delay DCI_HSQC_TOCSY4
define delay DCI_HSQC_TOCSY5
define delay DCI_HSQC_TOCSY6
"DCI_HSQC_TOCSY1   = (asin(cnst32)/(2*PI*cnst2))-p14/2000000"
"DCI_HSQC_TOCSY2   = (asin(cnst32)/(2*PI*cnst2))+p14/2000000"
"DCI_HSQC_TOCSY3   = p16+d16+p2/2+d0-p3*2/PI+4u"
"DCI_HSQC_TOCSY4   = d4-p14/2"
"DCI_HSQC_TOCSY5   = d4+p14/2-p16-d16"
"DCI_HSQC_TOCSY6   = de+4u"
"cnst41  = 2*sfo2/sfo1"                ; gradient ratio
define list<gradient> GCI_HSQC_TOCSY={cnst41}
`

CI_HSQC_TOCSY.module = `
  ; 13C-1H HSQC-TOCSY with Ernst angle excitation

  ; INEPT
  (p1 ph0):f1
  DCI_HSQC_TOCSY1
  (p14:sp3 ph0):f2
  (p2 ph0):f1
  DCI_HSQC_TOCSY2 pl2:f2
  (p1 ph1):f1
  (p3 ph5):f2
  DCI_HSQC_TOCSY3

  ; t1 period
  (p14:sp3 ph0):f2
  4u
  p16:gp3
  d16
  d0
  (p2 ph11):f1
  d0
  4u
  p16:gp3
  d16
  (p14:sp3 ph0):f2
  DCI_HSQC_TOCSY3 pl2:f2

  ; reverse INEPT
  (p3 ph7):f2
  (p1 ph2):f1
  DCI_HSQC_TOCSY4
  (p14:sp3 ph0):f2
  (p2 ph1):f1

  p16:gp13
  d16
  DCI_HSQC_TOCSY5 pl10:f1

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

  DCI_HSQC_TOCSY6
  (p2 ph1):f1
  4u
  p16:gp3*GCI_HSQC_TOCSY*EA
  d16 pl12:f2
  4u
  goscnp ph30 cpd2:f2   ; acquire 13C HSQC-TOCSY
  50u do:f2
`
