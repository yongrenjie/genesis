// vim: syntax=bruker:

import NOAHModule from "./moduleSpec.js";

let shortDescription = `; 1H phase-sensitive COSY`;

let preamble = `
"d10     = 3u"                         ; COSY t1
"in10    = 2*dw"                       ; COSY increment
`

let module = `
  ; COSY

  (p1 ph5):f1
  4u
  p16:gp5*EA
  d16
  d10
  (p1 ph0):f1
  4u
  p16:gp5
  d16
  4u
  goscnp ph31
`

const mod = new NOAHModule(
    "H",
    "C",
    "noah_cosy",
    shortDescription,
    preamble,
    module
);
export default mod;
