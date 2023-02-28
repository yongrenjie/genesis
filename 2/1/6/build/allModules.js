import CI_HSQC from "./modules/CI_HSQC.js";
import CI_HSQCC from "./modules/CI_HSQCC.js";
import CI_HSQCC_CLIP from "./modules/CI_HSQCC_CLIP.js";
import CI_HSQCC_DSE from "./modules/CI_HSQCC_DSE.js";
import CI_HSQCC_IA from "./modules/CI_HSQCC_IA.js";
import CI_HSQCJ from "./modules/CI_HSQCJ.js";
import CI_HSQCT from "./modules/CI_HSQCT.js";
import C_ADEQ from "./modules/C_ADEQ.js";
import C_HMBC_CF from "./modules/C_HMBC_CF.js";
import C_HMBC_CFDD from "./modules/C_HMBC_CFDD.js";
import C_HMBC_CF_K from "./modules/C_HMBC_CF_K.js";
import C_HMBC_CFGA from "./modules/C_HMBC_CFGA.js";
import C_HMBC_CFGB from "./modules/C_HMBC_CFGB.js";
import C_HMBC_CFGC from "./modules/C_HMBC_CFGC.js";
import C_HMBC_CNF from "./modules/C_HMBC_CNF.js";
import C_HMBC_NOF from "./modules/C_HMBC_NOF.js";
import C_HMQC from "./modules/C_HMQC.js";
import C_HSQC from "./modules/C_HSQC.js";
import C_HSQCC from "./modules/C_HSQCC.js";
import C_HSQCC_CLIP from "./modules/C_HSQCC_CLIP.js";
import C_HSQCC_CIA from "./modules/C_HSQCC_CIA.js";
import C_HSQCC_DSE from "./modules/C_HSQCC_DSE.js";
import C_HSQCC_DIA from "./modules/C_HSQCC_DIA.js";
import C_HSQCC_IA from "./modules/C_HSQCC_IA.js";
import C_HSQCJ from "./modules/C_HSQCJ.js";
import C_HSQCJ_K from "./modules/C_HSQCJ_K.js";
import C_HSQCT from "./modules/C_HSQCT.js";
import C_HSQCT_IA from "./modules/C_HSQCT_IA.js";
import C_SEHSQC from "./modules/C_SEHSQC.js";
import C_SEHSQC_DP from "./modules/C_SEHSQC_DP.js";
import C_SEHSQCJ from "./modules/C_SEHSQCJ.js";
import C_SEHSQCJ_K from "./modules/C_SEHSQCJ_K.js";
import C_SEHSQCJ_OR from "./modules/C_SEHSQCJ_OR.js";
import C_SEHSQC_OR from "./modules/C_SEHSQC_OR.js";
import C_SEHSQC_IA from "./modules/C_SEHSQC_IA.js";
import C_SEHSQCT from "./modules/C_SEHSQCT.js";
import C_SEHSQCT_OR from "./modules/C_SEHSQCT_OR.js";
import H_CC_T from "./modules/H_CC_T.js";
import H_CLIP_COSY from "./modules/H_CLIP_COSY.js";
import H_COSY from "./modules/H_COSY.js";
import H_CONO from "./modules/H_CONO.js";
import H_CONO_ST from "./modules/H_CONO_ST.js";
import H_COSY_QF from "./modules/H_COSY_QF.js";
import H_CORO from "./modules/H_CORO.js";
import H_CORO_ST from "./modules/H_CORO_ST.js";
import H_COTO from "./modules/H_COTO.js";
import H_COTO_ST from "./modules/H_COTO_ST.js";
import H_COTO_STDS from "./modules/H_COTO_STDS.js";
import H_DQFCOSY from "./modules/H_DQFCOSY.js";
import H_DQFCOSY_EA from "./modules/H_DQFCOSY_EA.js";
import H_JRES from "./modules/H_JRES.js";
import H_NOESY from "./modules/H_NOESY.js";
import H_PSYCHE from "./modules/H_PSYCHE.js";
import H_PSYCHE_SAP from "./modules/H_PSYCHE_SAP.js";
import H_PSYCHE_TSE from "./modules/H_PSYCHE_TSE.js";
import H_PSYCHE_TSAP from "./modules/H_PSYCHE_TSAP.js";
import H_JRES_PS from "./modules/H_JRES_PS.js";
import H_ROESY from "./modules/H_ROESY.js";
import H_ROESY_AD from "./modules/H_ROESY_AD.js";
import H_R_T from "./modules/H_R_T.js";
import H_TOCSY from "./modules/H_TOCSY.js";
import H_TOCSY_K from "./modules/H_TOCSY_K.js";
import H_TT_DM from "./modules/H_TT_DM.js";
import H_TT_CN from "./modules/H_TT_CN.js";
import H_TT_CR from "./modules/H_TT_CR.js";
import H_ZG from "./modules/H_ZG.js";
import N_HMBC_CF from "./modules/N_HMBC_CF.js";
import N_HMBC_CFIM from "./modules/N_HMBC_CFIM.js";
import N_HMBC_CFQF from "./modules/N_HMBC_CFQF.js";
import N_HMBC_CNF from "./modules/N_HMBC_CNF.js";
import N_HMQC from "./modules/N_HMQC.js";
import N_HSQC from "./modules/N_HSQC.js";
import N_SEHSQC from "./modules/N_SEHSQC.js";
import N_SEHSQC_DP from "./modules/N_SEHSQC_DP.js";
import N_SEHSQC_OR from "./modules/N_SEHSQC_OR.js";
const allModules = new Map([
    [CI_HSQC.name, CI_HSQC],
    [CI_HSQCC.name, CI_HSQCC],
    [CI_HSQCC_CLIP.name, CI_HSQCC_CLIP],
    [CI_HSQCC_DSE.name, CI_HSQCC_DSE],
    [CI_HSQCC_IA.name, CI_HSQCC_IA],
    [CI_HSQCJ.name, CI_HSQCJ],
    [CI_HSQCT.name, CI_HSQCT],
    [C_ADEQ.name, C_ADEQ],
    [C_HMBC_CF.name, C_HMBC_CF],
    [C_HMBC_CF_K.name, C_HMBC_CF_K],
    [C_HMBC_CFDD.name, C_HMBC_CFDD],
    [C_HMBC_CFGA.name, C_HMBC_CFGA],
    [C_HMBC_CFGB.name, C_HMBC_CFGB],
    [C_HMBC_CFGC.name, C_HMBC_CFGC],
    [C_HMBC_CNF.name, C_HMBC_CNF],
    [C_HMBC_NOF.name, C_HMBC_NOF],
    [C_HMQC.name, C_HMQC],
    [C_HSQC.name, C_HSQC],
    [C_HSQCC.name, C_HSQCC],
    [C_HSQCC_IA.name, C_HSQCC_IA],
    [C_HSQCC_CLIP.name, C_HSQCC_CLIP],
    [C_HSQCC_CIA.name, C_HSQCC_CIA],
    [C_HSQCC_DSE.name, C_HSQCC_DSE],
    [C_HSQCC_DIA.name, C_HSQCC_DIA],
    [C_HSQCJ.name, C_HSQCJ],
    [C_HSQCJ_K.name, C_HSQCJ_K],
    [C_HSQCT.name, C_HSQCT],
    [C_HSQCT_IA.name, C_HSQCT_IA],
    [C_SEHSQC.name, C_SEHSQC],
    [C_SEHSQC_DP.name, C_SEHSQC_DP],
    [C_SEHSQCJ.name, C_SEHSQCJ],
    [C_SEHSQCJ_K.name, C_SEHSQCJ_K],
    [C_SEHSQCJ_OR.name, C_SEHSQCJ_OR],
    [C_SEHSQC_OR.name, C_SEHSQC_OR],
    [C_SEHSQC_IA.name, C_SEHSQC_IA],
    [C_SEHSQCT.name, C_SEHSQCT],
    [C_SEHSQCT_OR.name, C_SEHSQCT_OR],
    [H_CC_T.name, H_CC_T],
    [H_CLIP_COSY.name, H_CLIP_COSY],
    [H_COSY.name, H_COSY],
    [H_CONO.name, H_CONO],
    [H_CONO_ST.name, H_CONO_ST],
    [H_COSY_QF.name, H_COSY_QF],
    [H_CORO.name, H_CORO],
    [H_CORO_ST.name, H_CORO_ST],
    [H_COTO.name, H_COTO],
    [H_COTO_ST.name, H_COTO_ST],
    [H_COTO_STDS.name, H_COTO_STDS],
    [H_DQFCOSY.name, H_DQFCOSY],
    [H_DQFCOSY_EA.name, H_DQFCOSY_EA],
    [H_JRES.name, H_JRES],
    [H_NOESY.name, H_NOESY],
    [H_PSYCHE.name, H_PSYCHE],
    [H_PSYCHE_SAP.name, H_PSYCHE_SAP],
    [H_PSYCHE_TSE.name, H_PSYCHE_TSE],
    [H_PSYCHE_TSAP.name, H_PSYCHE_TSAP],
    [H_JRES_PS.name, H_JRES_PS],
    [H_ROESY.name, H_ROESY],
    [H_ROESY_AD.name, H_ROESY_AD],
    [H_R_T.name, H_R_T],
    [H_TOCSY.name, H_TOCSY],
    [H_TOCSY_K.name, H_TOCSY_K],
    [H_TT_DM.name, H_TT_DM],
    [H_TT_CN.name, H_TT_CN],
    [H_TT_CR.name, H_TT_CR],
    [H_ZG.name, H_ZG],
    [N_HMBC_CF.name, N_HMBC_CF],
    [N_HMBC_CFIM.name, N_HMBC_CFIM],
    [N_HMBC_CFQF.name, N_HMBC_CFQF],
    [N_HMBC_CNF.name, N_HMBC_CNF],
    [N_HMQC.name, N_HMQC],
    [N_HSQC.name, N_HSQC],
    [N_SEHSQC.name, N_SEHSQC],
    [N_SEHSQC_DP.name, N_SEHSQC_DP],
    [N_SEHSQC_OR.name, N_SEHSQC_OR],
]);
export default allModules;
