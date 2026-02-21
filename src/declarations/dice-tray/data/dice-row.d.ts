interface DiceRow extends Record<string, Row> { };

interface Row {
	color?: string,
	img?: string,
	label?: string,
	tooltip?: string,
}
