import { t as src_default } from "./src.mjs";
import { cancel, confirm, groupMultiselect, isCancel, note, select, text } from "@clack/prompts";
//#region src/utils/cli-utilities.ts
async function cancelable(task) {
	const result = await task();
	if (isCancel(result)) {
		cancel("Canceled... 👋 ");
		process.exit(0);
	}
	return result;
}
function importantWarning(message) {
	note(message.trim(), src_default.yellow("IMPORTANT"), { format: src_default.white });
}
async function askMultiselect(message, values, options) {
	return cancelable(async () => groupMultiselect({
		selectableGroups: true,
		required: false,
		...options,
		message,
		options: values
	}));
}
async function askQuestion(message, { placeholder, notEmpty } = {}) {
	return cancelable(() => text({
		message,
		placeholder,
		validate: (input = "") => notEmpty && input.length === 0 ? `Can't be empty.` : void 0
	}));
}
async function askConfirm(message, initialValue = true) {
	return cancelable(() => confirm({
		message,
		initialValue
	}));
}
async function askList(message, choices) {
	return cancelable(() => {
		return select({
			message,
			options: choices.map((choice) => typeof choice === "string" ? { value: choice } : choice)
		});
	});
}
//#endregion
export { importantWarning as a, askQuestion as i, askList as n, askMultiselect as r, askConfirm as t };
