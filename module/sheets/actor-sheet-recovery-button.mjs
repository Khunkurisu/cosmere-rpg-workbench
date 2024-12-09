export async function InjectRecoveryButton(sheet, html) {
	const recoveryDie = GetData(sheet);

	const search = $(html).find('.recovery');
	if ($(search).onclick) {
		return;
	}
	$(search).click(() => {
		const roll = new foundry.dice.Roll(`1${recoveryDie}`);
		roll.toMessage({
			speaker: ChatMessage.getSpeaker({ actor: sheet }),
			flavor: 'Recovery Roll',
			rollMode: game.settings.get('core', 'rollMode'),
		});
	});
}

function GetData(sheet) {
	const recovery = sheet.actor.system.recovery.die;

	return recovery.useOverride ? recovery.override : recovery.value;
}
