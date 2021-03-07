import NOAHModule from "./moduleSpec.js";

import CI_HSQC from "./CI_HSQC.js";
import CI_HSQC_COSY from "./CI_HSQC_COSY.js";
import CI_HSQC_COSY_CLIP from "./CI_HSQC_COSY_CLIP.js";
import CI_HSQC_COSY_DSE from "./CI_HSQC_COSY_DSE.js";
import CI_HSQC_F2J from "./CI_HSQC_F2J.js";
import CI_HSQC_TOCSY from "./CI_HSQC_TOCSY.js";
import C_HMBC_CF from "./C_HMBC_CF.js";
import C_HMBC_CFG from "./C_HMBC_CFG.js";
import C_HMBC_CNF from "./C_HMBC_CNF.js";
import C_HMBC_NOF from "./C_HMBC_NOF.js";
import C_HSQC from "./C_HSQC.js";
import C_HSQC_COSY from "./C_HSQC_COSY.js";
import C_HSQC_COSY_CLIP from "./C_HSQC_COSY_CLIP.js";
import C_HSQC_F2J from "./C_HSQC_F2J.js";
import C_HSQC_TOCSY from "./C_HSQC_TOCSY.js";
import C_SEHSQC from "./C_SEHSQC.js";
import C_SEHSQC_DP from "./C_SEHSQC_DP.js";
import C_SEHSQC_OR from "./C_SEHSQC_OR.js";
import C_SEHSQC_TOCSY from "./C_SEHSQC_TOCSY.js";
import C_SEHSQC_TOCSY_OR from "./C_SEHSQC_TOCSY_OR.js";
import H_CLIP_COSY from "./H_CLIP_COSY.js";
import H_COSY from "./H_COSY.js";
import H_COSY_NOESY from "./H_COSY_NOESY.js";
import H_COSY_NOESY_ST from "./H_COSY_NOESY_ST.js";
import H_COSY_QF from "./H_COSY_QF.js";
import H_COSY_ROESY_ST from "./H_COSY_ROESY_ST.js";
import H_COSY_TOCSY from "./H_COSY_TOCSY.js";
import H_COSY_TOCSY_ST from "./H_COSY_TOCSY_ST.js";
import H_DQF_COSY from "./H_DQF_COSY.js";
import H_DQF_COSY_EA from "./H_DQF_COSY_EA.js";
import H_JRES from "./H_JRES.js";
import H_NOESY from "./H_NOESY.js";
import H_PSYCHE from "./H_PSYCHE.js";
import H_PSYCHE_JRES from "./H_PSYCHE_JRES.js";
import H_ROESY from "./H_ROESY.js";
import H_ROESY_AD from "./H_ROESY_AD.js";
import H_TOCSY from "./H_TOCSY.js";
import H_TSE_PSYCHE from "./H_TSE_PSYCHE.js";
import N_HMQC from "./N_HMQC.js";
import N_HSQC from "./N_HSQC.js";
import N_SEHSQC from "./N_SEHSQC.js";
import N_SEHSQC_DP from "./N_SEHSQC_DP.js";
import N_SEHSQC_OR from "./N_SEHSQC_OR.js";


const allModules: Map<string, NOAHModule> = new Map([
    ["CI_HSQC", CI_HSQC],
    ["CI_HSQC_COSY", CI_HSQC_COSY],
    ["CI_HSQC_COSY_CLIP", CI_HSQC_COSY_CLIP],
    ["CI_HSQC_COSY_DSE", CI_HSQC_COSY_DSE],
    ["CI_HSQC_F2J", CI_HSQC_F2J],
    ["CI_HSQC_TOCSY", CI_HSQC_TOCSY],
    ["C_HMBC_CF", C_HMBC_CF],
    ["C_HMBC_CFG", C_HMBC_CFG],
    ["C_HMBC_CNF", C_HMBC_CNF],
    ["C_HMBC_NOF", C_HMBC_NOF],
    ["C_HSQC", C_HSQC],
    ["C_HSQC_COSY", C_HSQC_COSY],
    ["C_HSQC_COSY_CLIP", C_HSQC_COSY_CLIP],
    ["C_HSQC_F2J", C_HSQC_F2J],
    ["C_HSQC_TOCSY", C_HSQC_TOCSY],
    ["C_SEHSQC", C_SEHSQC],
    ["C_SEHSQC_DP", C_SEHSQC_DP],
    ["C_SEHSQC_OR", C_SEHSQC_OR],
    ["C_SEHSQC_TOCSY", C_SEHSQC_TOCSY],
    ["C_SEHSQC_TOCSY_OR", C_SEHSQC_TOCSY_OR],
    ["H_CLIP_COSY", H_CLIP_COSY],
    ["H_COSY", H_COSY],
    ["H_COSY_NOESY", H_COSY_NOESY],
    ["H_COSY_NOESY_ST", H_COSY_NOESY_ST],
    ["H_COSY_QF", H_COSY_QF],
    ["H_COSY_ROESY_ST", H_COSY_ROESY_ST],
    ["H_COSY_TOCSY", H_COSY_TOCSY],
    ["H_COSY_TOCSY_ST", H_COSY_TOCSY_ST],
    ["H_DQF_COSY", H_DQF_COSY],
    ["H_DQF_COSY_EA", H_DQF_COSY_EA],
    ["H_JRES", H_JRES],
    ["H_NOESY", H_NOESY],
    ["H_PSYCHE", H_PSYCHE],
    ["H_PSYCHE_JRES", H_PSYCHE_JRES],
    ["H_ROESY", H_ROESY],
    ["H_ROESY_AD", H_ROESY_AD],
    ["H_TOCSY", H_TOCSY],
    ["H_TSE_PSYCHE", H_TSE_PSYCHE],
    ["N_HMQC", N_HMQC],
    ["N_HSQC", N_HSQC],
    ["N_SEHSQC", N_SEHSQC],
    ["N_SEHSQC_DP", N_SEHSQC_DP],
    ["N_SEHSQC_OR", N_SEHSQC_OR],
]);
export default allModules;
