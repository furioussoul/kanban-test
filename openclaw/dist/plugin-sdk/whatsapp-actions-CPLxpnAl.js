import { i as resolveWhatsAppAccount } from "./accounts-yrtVsn_Y.js";
import "./paths-DVWx7USN.js";
import "./github-copilot-token-Cg0YPPSu.js";
import "./config-VBpsqf75.js";
import "./subsystem-C2adF5U4.js";
import "./command-format-DgW0zcnY.js";
import "./agent-scope-C3RYg0D_.js";
import "./message-channel-ChlcDAOp.js";
import "./plugins-BHd2rsCe.js";
import "./bindings-DbarLVcw.js";
import "./path-alias-guards-CAudg7_g.js";
import "./fs-safe-CxjGkiDa.js";
import "./image-ops-DKimSo4o.js";
import "./ssrf-D07_rJxG.js";
import "./fetch-guard-CYsbL_HO.js";
import "./local-roots-NYln5Dx5.js";
import "./ir-B3Qk3Uv3.js";
import "./chunk-D8C5VsxR.js";
import "./markdown-tables-BtcNK4JI.js";
import "./render-Dk3zVolZ.js";
import "./tables-DF5sPSng.js";
import "./tool-images-lPqzUCM0.js";
import { a as createActionGate, c as jsonResult, d as readReactionParams, i as ToolAuthorizationError, m as readStringParam } from "./target-errors-BVZnOXh3.js";
import { t as resolveWhatsAppOutboundTarget } from "./resolve-outbound-target-COIZw6UN.js";
import { r as sendReactionWhatsApp } from "./outbound-DUXxfIFo.js";

//#region src/agents/tools/whatsapp-target-auth.ts
function resolveAuthorizedWhatsAppOutboundTarget(params) {
	const account = resolveWhatsAppAccount({
		cfg: params.cfg,
		accountId: params.accountId
	});
	const resolution = resolveWhatsAppOutboundTarget({
		to: params.chatJid,
		allowFrom: account.allowFrom ?? [],
		mode: "implicit"
	});
	if (!resolution.ok) throw new ToolAuthorizationError(`WhatsApp ${params.actionLabel} blocked: chatJid "${params.chatJid}" is not in the configured allowFrom list for account "${account.accountId}".`);
	return {
		to: resolution.to,
		accountId: account.accountId
	};
}

//#endregion
//#region src/agents/tools/whatsapp-actions.ts
async function handleWhatsAppAction(params, cfg) {
	const action = readStringParam(params, "action", { required: true });
	const isActionEnabled = createActionGate(cfg.channels?.whatsapp?.actions);
	if (action === "react") {
		if (!isActionEnabled("reactions")) throw new Error("WhatsApp reactions are disabled.");
		const chatJid = readStringParam(params, "chatJid", { required: true });
		const messageId = readStringParam(params, "messageId", { required: true });
		const { emoji, remove, isEmpty } = readReactionParams(params, { removeErrorMessage: "Emoji is required to remove a WhatsApp reaction." });
		const participant = readStringParam(params, "participant");
		const accountId = readStringParam(params, "accountId");
		const fromMeRaw = params.fromMe;
		const fromMe = typeof fromMeRaw === "boolean" ? fromMeRaw : void 0;
		const resolved = resolveAuthorizedWhatsAppOutboundTarget({
			cfg,
			chatJid,
			accountId,
			actionLabel: "reaction"
		});
		const resolvedEmoji = remove ? "" : emoji;
		await sendReactionWhatsApp(resolved.to, messageId, resolvedEmoji, {
			verbose: false,
			fromMe,
			participant: participant ?? void 0,
			accountId: resolved.accountId
		});
		if (!remove && !isEmpty) return jsonResult({
			ok: true,
			added: emoji
		});
		return jsonResult({
			ok: true,
			removed: true
		});
	}
	throw new Error(`Unsupported WhatsApp action: ${action}`);
}

//#endregion
export { handleWhatsAppAction };