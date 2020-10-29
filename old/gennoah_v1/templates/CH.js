export const CH = {};

CH.text = `
;$CLASS=HighRes
;$DIM=2D
;$TYPE=
;$SUBTYPE=
;$COMMENT=

#include <Avance.incl>
#include <Grad.incl>
#include <Delay.incl>

include preamble
"l0      = td1/(nbl*2)"                ; Total number of t1 increments for 13C HSQC
"acqt0   = 0"
baseopt_echo

1 ze
  30m pl12:f2
2 30m do:f2
3 5m
4 50u UNBLKGRAD
  ; Cleanup
  4u pl2:f2
  (p3 ph1):f2
  4u pl1:f1
  p16:gp0
  4u
  (p1 ph1)
  4u
  p16:gp0*-1.37
  4u
  (p1 ph2)
  4u
  p16:gp0*0.77
  50u BLKGRAD
  d1 st0
  50u UNBLKGRAD

  ; MODULE 1
  include module
  ; Cleanup
  4u pl2:f2
  (p3 ph1):f2
  50u
  p16:gp0*2.32
  2m st

  ; MODULE 2
  include module
  ; echo/antiecho loop
  include ea_inc
  1m igrad EA
  30m wr #0 if #0 zd
  lo to 3 times 2

  ; 13C t1 incrementation loop
  include t1_inc
  lo to 4 times l0

50u BLKGRAD
exit 


ph1=0
ph2=1
include phases

include gradients

include wavemaker

include parameters
`
