import { Kupce2017ACIE } from "../citation.js";
import NOAHModule from "../noahModule.js";
let shortDescription = `; 1H pulse-acquire`;
let preamble = `
`;
let pulprog = `
  ; Pulse-acquire

  (p1 ph12):f1
  goscnp ph26
`;
const mod = new NOAHModule("h1", "Zg", [Kupce2017ACIE], "noah_cosy QF", shortDescription, [], preamble, pulprog, 1, false);
export default mod;
// vim: syntax=bruker:
