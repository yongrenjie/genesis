import NOAHModule from "../noahModule.js";
let shortDescription = `; 13C HMBC (using hmbcetgpl3nd gradient scheme)`;
let preamble = `
"p2      = p1*2"                       ; 1H hard 180
"d2      = 0.5s/cnst2"                 ; JCOMP
"d4      = 0.25s/cnst2"                ; 13C INEPT
"d7      = 0.5s/cnst13"                ; 13C LR coupling evolution
"d0      = 3u"                         ; 13C t1
"in0     = inf1/2"                     ; 13C increment
define delay DC_HMBC_CFG1
define delay DC_HMBC_CFG2
define delay DC_HMBC_CFG3
define delay DC_HMBC_CFG4
define delay DC_HMBC_CFG5
define delay DC_HMBC_CFG6
"DC_HMBC_CFG1   = d4-p14/2"
"DC_HMBC_CFG2   = d4+p14/2"
"DC_HMBC_CFG3   = 1s/(2*cnst6)-p16-d16"
"DC_HMBC_CFG4   = 1s/(2*cnst7)-p16-d16"
"DC_HMBC_CFG5   = d7-p16-d16-4u"
"DC_HMBC_CFG6   = p2+d0*2"
"cnst47=(1-sfo2/sfo1)/(1+sfo2/sfo1)"   ; gradient ratio
define list<gradient> EA1 = { 1.000 -cnst47}
define list<gradient> EA2 = { -cnst47 1.000}
`;
let pulprog = `
  ; 13C-1H HMBC

  ; zz-filter
  (p1 ph0):f1
  DC_HMBC_CFG1
  (p14:sp3 ph0):f2
  (p2 ph0):f1
  DC_HMBC_CFG2
  (p1 ph0):f1
  DC_HMBC_CFG1
  (p14:sp3 ph0):f2
  (p2 ph0):f1
  DC_HMBC_CFG2 pl2:f2

  ; second-order low-pass J-filter
  (p1 ph0):f1
  DC_HMBC_CFG3
  p16:gp10*-3
  d16
  (p3 ph7):f2
  DC_HMBC_CFG4
  p16:gp10*2
  d16
  (p3 ph7):f2
  4u
  p16:gp10
  d16
  DC_HMBC_CFG5  ; nJ(CH) evolution

  ; coherence transfer to 13C and t1
  (p3 ph7):f2
  d0
  (p2 ph11):f1
  d0
  p16:gp1*EA1
  d16
  (p24:sp7 ph0):f2
  DC_HMBC_CFG6
  p16:gp1*EA2
  d16 pl2:f2
  (p3 ph5):f2
  4u
  goscnp ph31
`;
const mod = new NOAHModule("hmbc", "Bg", "noah_hmbc", shortDescription, preamble, pulprog);
export default mod;
// vim: syntax=bruker:
