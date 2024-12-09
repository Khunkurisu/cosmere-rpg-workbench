const templatePath = 'modules/cosmere-rpg-workbench/templates/sheets/parts/actor-plot-die-button.hbs';
export async function InjectPlotDieButton(sheet, html) {
	if (!game.settings.get('cosmere-rpg-workbench', 'plotDieButtonClient') ||
		!game.settings.get('cosmere-rpg-workbench', 'plotDieButtonGlobal')
	) { return; }

	const search = $(html).find('.portrait-info');
	if ($(html).find('#plot-die-button').length > 0) {
		return;
	}

	const plotDieButton = await renderTemplate(templatePath, { config: CONFIG.COSMERE_WORKBENCH });
	$(search).before(plotDieButton);
	$(plotDieButton).click(() => {
		const roll = new foundry.dice.Roll(`1dp`);
		roll.toMessage({
			speaker: ChatMessage.getSpeaker({ actor: sheet }),
			flavor: `${game.i18n.localize('COSMERE_WORKBENCH.actor.button.plot.roll')}`,
			rollMode: game.settings.get('core', 'rollMode'),
		});
	});
}
