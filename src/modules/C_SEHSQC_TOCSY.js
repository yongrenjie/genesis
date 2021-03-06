// vim: filetype=bruker:

const C_SEHSQC_TOCSY = {};
export default C_SEHSQC_TOCSY;

C_SEHSQC_TOCSY.shortCode = `Stp`;

C_SEHSQC_TOCSY.nuclei = `CH`;

C_SEHSQC_TOCSY.shortDescription = `; 13C sensitivity-enhanced HSQC-TOCSY (with ZIP)
;     [use -DEDIT for multiplicity editing (not recommended)]
;     [use -DINVERT for inversion of TOCSY peaks]`

C_SEHSQC_TOCSY.auprog = `noah_hsqc`;

C_SEHSQC_TOCSY.preamble = `
"p2      = p1*2"                       ; 1H hard 180
"d2      = 0.5s/cnst2"                 ; JCOMP
"d4      = 0.25s/cnst2"                ; 13C INEPT
"d0      = 3u"                         ; 13C HSQC t1
"in0     = inf1/2"                     ; 13C HSQC increment
"l13     = (d19/(p6*115.112))/2"       ; half the number of HSQC-TOCSY DIPSI-2 loops
"l14     = l13*2"                      ; number of HSQC-TOCSY DIPSI-2 loops
define delay DC_SEHSQCT1
define delay DC_SEHSQCT2
define delay DC_SEHSQCT3
define delay DC_SEHSQCT4
define delay DC_SEHSQCT5
define delay DC_SEHSQCT6
define delay DC_SEHSQCT7
define delay DC_SEHSQCT8
define delay DC_SEHSQCT9
define delay DC_SEHSQCT10
define delay DC_SEHSQCT11
define delay DC_SEHSQCT12
"DC_SEHSQCT1  = d4-p14/2"                          ; zz-filter
"DC_SEHSQCT2  = d4+p14/2"                          ; zz-filter
"DC_SEHSQCT3  = d4-larger(p2,p14)/2"               ; INEPT
"DC_SEHSQCT4  = p16+d16+p2+d0*2-4u-p3*2/PI"        ; 13C pre-t1 if editing
"DC_SEHSQCT5  = d2-p16-d16+p3*2/PI"                ; 13C editing period
"DC_SEHSQCT6  = d2-p2-p3*2/PI"                     ; 13C editing period
"DC_SEHSQCT7  = p16+d16+p2/2+d0-4u-p3*2/PI"        ; 13C pre-/post-t1 if no editing
"DC_SEHSQCT8  = d6-cnst17*p24/2-p19-d16"           ; first spin echo after t1
"DC_SEHSQCT9  = d4-larger(p2,p14)/2-p16-d16-4u"    ; DIPSI spin echo
"DC_SEHSQCT10 = d2-larger(p2,p14)/2-p1*2/PI"       ; inversion of TOCSY vs HSQC
"DC_SEHSQCT11 = d2-larger(p2,p14)/2-p16-d16-de-4u" ; inversion of TOCSY vs HSQC
"DC_SEHSQCT12 = p16+d16-p1*0.78+de+8u"             ; final spin echo, no inversion
"cnst41  = 2*sfo2/sfo1"                ; gradient ratio
define list<gradient> GC_SEHSQCT={cnst41}
`


C_SEHSQC_TOCSY.module = `
  ; 13C-1H seHSQC-TOCSY

  ; ZIP element
  (p1 ph0):f1
  DC_SEHSQCT1
  (p14:sp3 ph0):f2
  (p2 ph0):f1
  DC_SEHSQCT2
  (p1 ph0):f1
  DC_SEHSQCT1
  (p14:sp3 ph0):f2
  (p2 ph0):f1
  DC_SEHSQCT2            ; 13C-1H: y,  12C-1H: z

  ; forward INEPT
#ifdef EDIT
  (p1 ph1):f1
#else
  (p1 ph3):f1
#endif /* EDIT */
  DC_SEHSQCT3
  4u
  (center (p2 ph0):f1 (p14:sp3 ph0):f2 )
  4u
  DC_SEHSQCT3 pl2:f2
  4u
  (p1 ph1):f1 (p3 ph5):f2

  ; t1 evolution with optional multiplicity editing
#ifdef EDIT
  4u
  DC_SEHSQCT4
  (p31:sp18 ph0):f2
  p16:gp3
  d16 pl2:f2

  d0
  (p2 ph7):f1
  d0

  p16:gp3
  d16
  DC_SEHSQCT5
  (p31:sp18 ph0):f2
  (p2 ph0):f1
  DC_SEHSQCT6 pl2:f2
#else
  4u
  DC_SEHSQCT7 
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
  DC_SEHSQCT7 pl2:f2
#endif /* EDIT */

  ; reverse INEPT for first component
  (center (p1 ph0):f1 (p3 ph7):f2 )
  p19:gp6
  d16
  DC_SEHSQCT8
  (center (p2 ph0):f1 (p24:sp7 ph0):f2 )
  DC_SEHSQCT8
  p19:gp6
  d16 pl2:f2
  (center (p1 ph1):f1 (p3 ph9):f2 )  ; seHSQC pulse, incremented with EA

  ; reverse INEPT for second component
  4u
  p16:gp7
  d16
  DC_SEHSQCT9
  (center (p2 ph0):f1 (p14:sp3 ph0):f2 )
  DC_SEHSQCT9 pl10:f1
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

#ifdef INVERT
  DC_SEHSQCT10
  (center (p2 ph0):f1 (p14:sp3 ph13):f2 )
  4u
  p16:gp3*GC_SEHSQCT*EA
  d16 pl12:f2
  DC_SEHSQCT11
#else
  DC_SEHSQCT12
  (p2 ph0):f1
  4u
  p16:gp3*GC_SEHSQCT*EA
  d16 pl12:f2
  4u
#endif /* INVERT */

  goscnp ph30 cpd2:f2
  50u do:f2
`
