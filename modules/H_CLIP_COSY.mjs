// vim: filetype=bruker:

const H_CLIP_COSY = {};
export default H_CLIP_COSY;

H_CLIP_COSY.shortCode = `Cc`;

H_CLIP_COSY.nuclei = `H`;

H_CLIP_COSY.shortDescription = `; 1H CLIP-COSY (States)`;

H_CLIP_COSY.auprog = `noah_clipcosy States`;

H_CLIP_COSY.preamble = `
"d10     = 3u"                         ; CLIP-COSY t1
"d12     = 0.25s/cnst12"               ; CLIP-COSY mixing (< 1/4J(HH))
"in10    = 2*dw"                       ; CLIP-COSY increment
`

H_CLIP_COSY.module = `
  ; 1H-1H CLIP-COSY

  (p1 ph6):f1
  d10
  (p1 ph0):f1
  10u gron12 pl0:f1
  (p32:sp29 ph0):f1
  20u groff
  d16 pl1:f1
  (p1 ph0):f1

  ; in-phase transfer via perfect echo
  d12
  (p2 ph1):f1
  d12
  (p1 ph1):f1
  d12
  (p2 ph3):f1
  d12

  (p1 ph0):f1
  10u gron12*1.333 pl0:f1 
  (p32*0.75:sp29 ph2):f1
  20u groff
  p16:gp11
  d16 pl1:f1 
  4u
  (p1 ph0):f1

  goscnp ph26
`
