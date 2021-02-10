// vim: filetype=bruker:

const H_COSY_ROESY_ST = {};
export default H_COSY_ROESY_ST;

H_COSY_ROESY_ST.shortDescription = "; 1H COSY and ROESY (States F1)";
H_COSY_ROESY_ST.shortCode = `CRst`;
H_COSY_ROESY_ST.nuclei = `H`;
H_COSY_ROESY_ST.auprog = `noah_cosy States:noah_roesy States`;

H_COSY_ROESY_ST.preamble = `
"d10     = 3u"                         ; COSY/ROESY t1
"in10    = 2*dw"                       ; COSY/ROESY increment
`

H_COSY_ROESY_ST.module = `
  ; 1H-1H COSY + ROESY (States)

  ; COSY
  (p1 ph6):f1
  d10
  (p1 ph0):f1
  goscnp ph26  ; acquire H-H COSY
  2m st

  ; ROESY
  10u gron12
  (p32:sp29 ph0):f1  ; ZQ suppression
  20u groff

  (p50:sp49 ph0):f1  ; ROESY mixing
  (p50:sp50 ph0):f1
  10u 
  p16:gp11
  d16 pl1:f1

  (p1 ph0):f1
  goscnp ph26  ; acquire H-H ROESY
`
