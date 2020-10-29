export const NCH = {};

NCH.text = `
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
"l1      = 0"                          ; Running counter of total t1 increments for 13C HSQC
"acqt0   = 0"
baseopt_echo

1 ze
2 30m
3 5m do:f2
4 50u UNBLKGRAD
  ; Cleanup
  4u pl3:f3
  4u pl2:f2
  (p21 ph1):f3
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
  4u pl3:f3
  4u pl2:f2
  (p21 ph1):f3
  (p3 ph1):f2
  50u
  p16:gp0*1.77
  2m st

  ; MODULE 2
  include module
  ; Cleanup
  4u pl2:f2
  (p3 ph1):f2
  50u
  p16:gp0*2.32
  2m st

  ; MODULE 3
  include module
  ; echo/antiecho loop
  1m igrad EA
  include ea_inc
  30m wr #0 if #0 zd
  lo to 3 times 2

  ; 13C t1 incrementation loop
  include t1_inc

  ; 15N t1 incrementation check
  "l1 = l1 + 1"
if "l1 % cnst39 == 0"
{
  include nt1_inc
}
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
