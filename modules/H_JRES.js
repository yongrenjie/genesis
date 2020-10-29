// vim: filetype=bruker:

const H_JRES = {};
export default H_JRES;

H_JRES.nuclei = `H`;

H_JRES.shortCode = `Jqf`;

H_JRES.shortDescription = `; 1H magnitude-mode 2D J spectrum`;

H_JRES.auprog = `noah_jres QF`;

H_JRES.preamble = `
"p2      = p1*2"
"d11     = 3u"                         ; JRES t1
"in11    = (1/cnst38)/2"               ; JRES increment
`

H_JRES.module = `
  ; 2D J spectrum, magnitude mode

  (p1 ph0):f1
  d11
  (p2 ph14):f1
  d11
  goscnp ph26
`
