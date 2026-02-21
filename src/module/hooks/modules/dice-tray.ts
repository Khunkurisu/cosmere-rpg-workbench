const DICE_TRAY = 'dice-calculator';

const plotDieRow = {
	"1dp": {
		"img": "systems/cosmere-rpg/assets/icons/svg/dice/dp_op.svg",
		"label": "Plot Die",
		"tooltip": "Raise the Stakes!",
		"color": "#ffffff"
	}
} as const;

export async function SetupDiceTray() {
	if (game.modules!.get(DICE_TRAY)?.active) {
		const diceTrayDiceRows = game.settings!.get("dice-calculator", "diceRows") as DiceRow[];
		if (diceTrayDiceRows) {
			const hasPlotDie = diceTrayDiceRows.reduce((plotDice: boolean, row) => {
				return plotDice || !!row["1dp"] || !!row.dp;
			}, false);
			if (!hasPlotDie) {
				diceTrayDiceRows.push(plotDieRow);
				await game.settings!.set("dice-calculator", "diceRows", diceTrayDiceRows);
			}
		}
	}
}
