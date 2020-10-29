// vim: filetype=bruker:

const C_HMBC_CF = {};
export default C_HMBC_CF;

C_HMBC_CF.nuclei = `CH`;

C_HMBC_CF.shortCode = `B`;

C_HMBC_CF.shortDescription = `; 13C HMBC`;

C_HMBC_CF.auprog = `noah_hmbc`;

C_HMBC_CF.preamble = `
"p2      = p1*2"                       ; 1H hard 180
"d2      = 0.5s/cnst2"                 ; JCOMP
"d4      = 0.25s/cnst2"                ; 13C INEPT
"d7      = 0.5s/cnst13"                ; 13C LR coupling evolution
"d0      = 3u"                         ; 13C t1
"in0     = inf1/2"                     ; 13C increment
define delay DC_HMBC_CF1
define delay DC_HMBC_CF2
define delay DC_HMBC_CF3
define delay DC_HMBC_CF4
define delay DC_HMBC_CF5
define delay DC_HMBC_CF6
"DC_HMBC_CF1   = d4-p14/2"
"DC_HMBC_CF2   = d4+p14/2"
"DC_HMBC_CF3   = 1s/(2*cnst6)-p16-d16"
"DC_HMBC_CF4   = 1s/(2*cnst7)-p16-d16"
"DC_HMBC_CF5   = d7-p16-d16-4u"
"DC_HMBC_CF6   = p16+d16+p2/2+d0-p3*2/PI+4u"
"cnst41  = 2*sfo2/sfo1"                ; gradient ratio
define list<gradient> GC_HMBC_CF={cnst41}
`

C_HMBC_CF.module = `
  ; 13C-1H HMBC

  ; zz-filter
  (p1 ph0):f1
  DC_HMBC_CF1
  (p14:sp3 ph0):f2
  (p2 ph0):f1
  DC_HMBC_CF2
  (p1 ph0):f1
  DC_HMBC_CF1
  (p14:sp3 ph0):f2
  (p2 ph0):f1
  DC_HMBC_CF2 pl2:f2

  ; second-order low-pass J-filter
  (p1 ph0):f1
  DC_HMBC_CF3
  p16:gp10*-3
  d16
  (p3 ph5):f2
  DC_HMBC_CF4
  p16:gp10*2
  d16
  (p3 ph5):f2
  4u
  p16:gp10
  d16
  DC_HMBC_CF5  ; nJ(CH) evolution

  ; coherence transfer to 13C and t1
  (p3 ph7):f2
  DC_HMBC_CF6
  (p14:sp3 ph0):f2
  4u
  p16:gp1
  d16
  d0
  (p2 ph11):f1
  d0
  4u
  p16:gp1
  d16
  (p14:sp3 ph0):f2
  DC_HMBC_CF6 pl2:f2
  (p3 ph5):f2
  (p2 ph0):f1
  4u
  p16:gp1*EA*GC_HMBC_CF
  d16
  4u
  goscnp ph30
`
