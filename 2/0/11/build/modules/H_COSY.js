import { Kupce2017ACIE } from "../citation.js";
import NOAHModule from "../noahModule.js";
let shortDescription = `; 1H phase-sensitive COSY`;
let preamble = `
"d10  = 3u"                         ; COSY t1
"in10 = 2*dw"                       ; COSY increment
`;
let pulprog = `
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
`;
const mod = new NOAHModule("h1", "C", [Kupce2017ACIE], "noah_cosy", shortDescription, preamble, pulprog);
export default mod;
// vim: syntax=bruker:
