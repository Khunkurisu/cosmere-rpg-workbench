/**
 * Define a set of template paths to pre-load
 * Pre-loaded templates are compiled and cached for fast access when rendering
 * @return {Promise}
 */
export const preloadHandlebarsTemplates = async function () {
	return loadTemplates([
		'modules/cosmere-rpg-workbench/templates/sheets/parts/actor-encumbrance-bar.hbs',
	]);
};
