// vim: filetype=bruker:

const H_COSY_NOESY_ST = {};
export default H_COSY_NOESY_ST;

H_COSY_NOESY_ST.shortDescription = "; 1H COSY and NOESY (States F1)";
H_COSY_NOESY_ST.shortCode = `CNst`;
H_COSY_NOESY_ST.nuclei = `H`;
H_COSY_NOESY_ST.auprog = `noah_cosy States:noah_noesy States`;

H_COSY_NOESY_ST.preamble = `
"d10     = 3u"                         ; COSY/NOESY t1
"in10    = 2*dw"                       ; COSY/NOESY increment
define delay DH_COSY_NOESY_ST1
"DH_COSY_NOESY_ST1  = d8-4u-de-aq-4u-p16-d16-p32-30u"     ; NOE mixing time
`

H_COSY_NOESY_ST.module = `
  ; 1H-1H COSY + NOESY (States)

  ; COSY
  (p1 ph6):f1
  d10
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
  DH_COSY_NOESY_ST1 st  ; NOE mixing time
  (p1 ph0):f1
  goscnp ph26  ; acquire H-H NOESY
`
