import { ApplicationTypes, HOOKS } from "@module/constants";
import { InjectEncumbranceCounter } from "@module/sheets/actor-sheet-encumbrance-bar.mjs";

Hooks.on(
	HOOKS.RENDER_SHEET(ApplicationTypes.Actor.Base),
	async (application: ActorSheet,
		element: HTMLElement,
		_context: { tabs?: Record<string, foundry.applications.api.ApplicationV2.Tab> },
		_options: foundry.applications.api.ApplicationV2.RenderOptions,
	) => {
	await InjectEncumbranceCounter(application, element);
	return true;
});
