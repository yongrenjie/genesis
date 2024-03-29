import NOAHModule from "../noahModule.js";

let shortDescription = `; 1H interleaved TOCSY (mixing time: d9) + COSY
; 1H interleaved TOCSY (mixing time: d14) + NOESY`;

let preamble = `
"p2     = p1*2"                       ; 1H hard 180
"d13    = 3u"                         ; COSY/NOESY t1
"in13   = 2*dw"                       ; COSY/NOESY increment
"l11    = (d9/(p6*115.112))/2"        ; half the number of short TOCSY loops
"l12    = l11*2"                      ; number of short TOCSY loops
"l19    = (d14/(p6*115.112))/2"       ; half the number of long TOCSY loops
"l20    = l19*2"                      ; number of long TOCSY loops
"D[ID]a = d8-4u-de-aq-4u-p16-d16-p32-30u-2m"     ; NOE mixing time
`

let pulprog = `
  ; 1H-1H TOCSY + TOCSY and COSY + NOESY (all States)

if "l1 % 2 == 0"
{
  ; TOCSY 2x
  (p1 ph20):f1
  d13
  (p1 ph0):f1
  4u pl10:f1

  |DIPSI|

  4u pl1:f1
  (p2 ph2):f1
  4u
  goscnp ph26  ; acquire H-H TOCSY number 1

  4u pl10:f1
  50u
  p16:gp0*1.7
  d16
  2m st

  |DIPSI|

  p16:gp0*1.33
  4u pl1:f1
  d16
  (p1 ph0):f1
}
else
{
  ; COSY
  (p1 ph20):f1
  d13
  (p1 ph0):f1
  4u
  goscnp ph26  ; acquire H-H COSY

  ; NOESY
  4u
  10u gron12
  (p32:sp29 ph0):f1
  20u groff
  p16:gp11
  d16 pl1:f1
  D[ID]a       ; NOE mixing time
  2m st
  (p1 ph0):f1
}
  goscnp ph26  ; acquire H-H TOCSY number 2
`

const mod = new NOAHModule(
    "H_TT_CN",
    "h1",
    "TT CN",
    [],
    "noah_tocsy States noah_cosy States:noah_tocsy States noah_noesy States",
    "TOCSY (States)/COSY (States):TOCSY (States)/NOESY (States)",
    shortDescription,
    [],
    preamble,
    pulprog,
    2,
    true
);
export default mod;

// vim: syntax=bruker:
