import { Hansen2021AC, Yong2021JMR } from "../citation.js";
import { AF_EDIT } from "../acquFlag.js";
import NOAHModule from "../noahModule.js";

let shortDescription = `; 13C sensitivity-enhanced HSQC, IPAP mode`

let preamble = `
"p2      = p1*2"                       ; 1H hard 180
"d2      = 0.5s/cnst2"                 ; JCOMP
"d4      = 0.25s/cnst2"                ; 13C INEPT
"d3      = 3u"                         ; 13C HSQC t1
"in3     = inf1/2"                     ; 13C HSQC increment
"D[ID]a = d4-p14/2"                       ; zz-filter
"D[ID]b = d4+p14/2"                       ; zz-filter
"D[ID]c = d4-larger(p2,p14)/2"            ; INEPT
"D[ID]d = p16+d16+p2+d3*2-4u-p3*2/PI"     ; 13C pre-t1 if editing
"D[ID]e = d2-p16-d16+p3*2/PI"             ; 13C editing period
"D[ID]f = d2-p2-p3*2/PI"                  ; 13C editing period
"D[ID]g = p16+d16+p2/2+d3-4u-p3*2/PI"     ; 13C pre-/post-t1 if no editing
"D[ID]h = d6-cnst17*p24/2-p19-d16"        ; first spin echo after t1
"D[ID]i = d4-larger(p2,p14)/2-p16-d16"    ; second spin echo after t1
"D[ID]j = d4-p2/2"                        ; final spin echo for refocusing gradient
"D[ID]k = d4-p2/2-p16-d16-de"             ; final spin echo for refocusing gradient
"D[ID]l = d4-larger(p2,p14)/2"            ; final spin echo for refocusing gradient
"D[ID]m = d4-larger(p2,p14)/2-p16-d16-de" ; final spin echo for refocusing gradient
"cnst41 = 2*sfo2/sfo1"                    ; gradient ratio
define list<gradient> G[ID]={cnst41}
`


let pulprog = `
  ; 13C-1H seHSQC (with ZIP element)

  ; ZIP
  (p1 ph0):f1
  D[ID]a
  (p14:sp3 ph0):f2
  (p2 ph0):f1
  D[ID]b
  (p1 ph0):f1
  D[ID]a
  (p14:sp3 ph0):f2
  (p2 ph0):f1
  D[ID]b            ; 13C-1H: y,  12C-1H: z

  ; forward INEPT
#ifdef EDIT
  (p1 ph1):f1
#else
  (p1 ph3):f1
#endif /* EDIT */
  D[ID]c
  4u
  (center (p2 ph0):f1 (p14:sp3 ph0):f2 )
  4u
  D[ID]c pl2:f2
  4u
  (p1 ph1):f1 (p3 ph18):f2

  ; t1 evolution with optional multiplicity editing
#ifdef EDIT
  4u
  D[ID]d
  (p31:sp18 ph0):f2
  p16:gp4
  d16 pl2:f2

  d3
  (p2 ph7):f1
  d3

  p16:gp4
  d16
  D[ID]e
  (p31:sp18 ph0):f2
  (p2 ph0):f1
  D[ID]f pl2:f2
#else
  4u
  D[ID]g 
  (p24:sp7 ph0):f2
  p16:gp4
  d16 pl2:f2

  d3
  (p2 ph7):f1
  d3

  p16:gp4
  d16
  (p24:sp7 ph0):f2
  4u
  D[ID]g pl2:f2
#endif /* EDIT */

  ; reverse INEPT for first component
  (center (p1 ph0):f1 (p3 ph7):f2 )
  p19:gp6
  d16
  D[ID]h
  (center (p2 ph0):f1 (p24:sp7 ph0):f2 )
  D[ID]h
  p19:gp6
  d16 pl2:f2
  (center (p1 ph1):f1 (p3 ph19):f2 )

  ; reverse INEPT for second component
  p16:gp7
  d16
  D[ID]i
  (center (p2 ph0):f1 (p14:sp3 ph0):f2 )
  D[ID]i
  p16:gp7
  d16
  (p1 ph0):f1

  ; spin echo, IP/AP selection, and refocusing gradient
if "l1 % 2 == 0" {
  D[ID]j
  (p2 ph0):f1
  D[ID]k
  p16:gp4*EA_TS*G[ID]
  d16
  goscnp ph24
}
else {
  D[ID]l
  (center (p2 ph0):f1 (p14:sp3 ph0):f2 )
  D[ID]m
  p16:gp4*EA_TS*G[ID]
  d16 ip24
  goscnp ph24       ; acquire 13C seHSQC
  dp24
}
`

const mod = new NOAHModule(
    "C_SEHSQC_IA",
    "c13",
    "Sip Sap",
    [Hansen2021AC, Yong2021JMR],
    "noah_hsqc noah_split",
    "13C IPAP seHSQC",
    shortDescription,
    [AF_EDIT],
    preamble,
    pulprog,
    1,
    true
);
export default mod;

// vim: syntax=bruker:
