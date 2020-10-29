// vim: filetype=bruker:

const H_COSY_QF = {};
export default H_COSY_QF;

H_COSY_QF.shortCode = `Cqf`;

H_COSY_QF.nuclei = `H`;

H_COSY_QF.shortDescription = `; 1H magnitude-mode COSY`;

H_COSY_QF.auprog = `noah_cosy QF`;

H_COSY_QF.preamble = `
"d11     = 3u"                         ; COSY t1
"in11    = 2*dw"                       ; COSY increment
`

H_COSY_QF.module = `
  ; COSY, magnitude mode

  (p1 ph12):f1
  4u
  p16:gp5
  d16
  d11    ; defined as d11 since it's incremented with EA, not with t1
  (p1 ph0):f1
  4u
  p16:gp5
  d16
  4u
  goscnp ph26
`
