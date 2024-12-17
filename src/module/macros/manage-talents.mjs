import { TalentManagerMenu } from "../applications/talent-manager-menu.mjs"

export default async function TalentManager() {
	const talentManager = new TalentManagerMenu();
	await talentManager.render({ force: true });
}
