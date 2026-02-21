import { ApplicationTypes, HOOKS } from '@module/constants';


Hooks.on(HOOKS.PRE_CREATE(ApplicationTypes.Item.Base), async (document: TalentItem, _data, _options, _userId) => {
	if (document.type === 'talent') {
		const parentActor = document.parent as CosmereActor;
		if (parentActor.isAdversary()) {
			debug.log('adversary detected');
			const actionData = {
				img: '',
				name: document.name,
				type: 'action',
				system: {
					description: document.system.description,
					activation: document.system.activation,
					damage: document.system.damage,
					id: document.id,
				} as Partial<ActionItemData>
			} as Partial<ActionItem>;
			await CosmereItem.create(actionData, { parent: parentActor });
			return false;
		}
	}
	return true;
});
