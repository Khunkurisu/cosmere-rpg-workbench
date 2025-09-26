/* eslint-disable @typescript-eslint/no-unsafe-assignment */
/* eslint-disable @typescript-eslint/no-unsafe-member-access */
/* eslint-disable @typescript-eslint/unbound-method */
import { AnyObject } from "@league-of-foundry-developers/foundry-vtt-types/src/types/utils.mjs";
import { MODULE_ID, SETTINGS } from "../constants";

const { ApplicationV2, HandlebarsApplicationMixin } = foundry.applications.api

export class CustomSkillMenuV2 extends HandlebarsApplicationMixin(
	ApplicationV2<AnyObject>,
) {
	static DEFAULT_OPTIONS = {
		id: 'custom-skill-menu',
		form: {
			handler: CustomSkillMenuV2.onFormEvent,
			closeOnSubmit: false,
		},
		position: {
			width: 640,
			height: "auto" as const,
		},
		actions: {
			create: CustomSkillMenuV2.createEntry,
			remove: CustomSkillMenuV2.removeEntry,
			toggle: CustomSkillMenuV2.toggleEntry,
			cancel: CustomSkillMenuV2.onCancel,
		},
		tag: 'form',
		window: {
			title: 'workbench.settings.customSkillMenu.name',
			contentClasses: ["standard-form", 'cosmere-rpg-workbench'],
		},
	}

	private entries = game.settings!.get(MODULE_ID, SETTINGS.CUSTOM_SKILLS) as CosmereAPI.SkillConfigData[];

	static PARTS = {
		form: {
			template: 'modules/cosmere-rpg-workbench/templates/applications/custom-skills.hbs'
		},
		footer: {
			template: "templates/generic/form-footer.hbs",
		},
	}

	get title() {
		return `Cosmere RPG Workbench: ${game.i18n!.localize(this.options.window?.title ?? "")}`;
	}

	protected _prepareContext() {
		if (this.entries.length === 1) {
			if (!this.entries[0].id) this.entries = [];
		}

		return Promise.resolve({
			entries: [...this.entries],
			buttons: [
				{ type: "submit", icon: "fa-solid fa-save", label: "SETTINGS.Save" },
				{ type: "button", icon: "fa-solid fa-ban", label: "Cancel", action: "cancel" },
			],
			attributes: CONFIG.COSMERE.attributes,
			config: CONFIG,
		});
	}

	private static async onFormEvent(
		this: CustomSkillMenuV2,
		event: Event,
		form: HTMLFormElement,
		formData: FormDataExtended,
	) {
		const data: CosmereAPI.SkillConfigData[] = this.entries;
		let lastChecked: CosmereAPI.SkillConfigData;
		let isValid = true;
		data.every(((skill: CosmereAPI.SkillConfigData) => {
			if (lastChecked) {
				if (skill.id === lastChecked.id) {
					isValid = false;
				}
			}
			lastChecked = skill;
			return isValid;
		}));

		if (isValid) {
			await game.settings!.set(MODULE_ID, SETTINGS.CUSTOM_SKILLS, data);
			await this.close();
		} else {
			// eslint-disable-next-line @typescript-eslint/no-unsafe-call
			ui.notifications.error("Identifiers must be unique.");
		}
	}

	private static async onCancel(this: CustomSkillMenuV2) {
		await this.close();
	}

	private static async createEntry(this: CustomSkillMenuV2, event: PointerEvent, target: HTMLElement) {
		const entries = this.entries;

		entries.push({
			id: 'ncs',
			label: 'New Skill',
			attribute: 'str',
			core: false,
			priority: 1
		});

		await this.render(false);
	}

	private static async removeEntry(this: CustomSkillMenuV2, event: PointerEvent, target: HTMLElement): Promise<void> {
		const dataset = target.dataset;
		const entries = this.entries;
		const index = dataset.index;
		if (!index) return;

		entries.splice(parseInt(index), 1);

		await this.render(false);
	}

	private static async toggleEntry(this: CustomSkillMenuV2, event: PointerEvent, target: HTMLElement) {
		const dataset = target.dataset;
		const entries = this.entries;
		const index = dataset.index;
		if (!index) return;

		entries[parseInt(index)].core = !(entries[parseInt(index)].core);

		await this.render(false);
	}

	protected _onRender(this: CustomSkillMenuV2) {
		const html = $(this.element);

		html.on("change", ".entry-input", this.onEntryChange.bind(this));
		html.on("change", ".entry-attribute", this.onAttributeChange.bind(this));
	}

	private async onEntryChange(event: Event) {
		event.preventDefault();
		const element = event.currentTarget as HTMLFormElement;
		if (!element) return;
		const dataset = element.dataset;
		const entries = this.entries;
		const index = dataset.index;
		if (!index) return;
		const key = dataset.key;
		if (!key) return;

		entries[parseInt(index)][key] = element.value;

		await this.render(false);
	}

	private async onAttributeChange(event: Event) {
		event.preventDefault();
		const element = event.currentTarget as HTMLFormElement;
		if (!element) return;
		const dataset = element.dataset;
		const entries = this.entries;
		const index = dataset.index;
		if (!index) return;

		entries[parseInt(index)].attribute = element.value;

		await this.render(false);
	}
}
