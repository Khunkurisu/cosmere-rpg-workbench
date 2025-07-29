import fs from 'fs';
import path from 'path';
import { compilePack } from "@foundryvtt/foundryvtt-cli";

// Constants
const PACK_SRC = path.join('src', 'packs');
const PACK_DEST = path.join('build', 'packs');

async function compilePacks() {
	if (!fs.existsSync(PACK_SRC)) { fs.mkdirSync(PACK_SRC); }
	if (!fs.existsSync(PACK_DEST)) { fs.mkdirSync(PACK_DEST); }
	const folders = fs.readdirSync(PACK_SRC, { withFileTypes: true })
		.filter(file => file.isDirectory());

	for (const folder of folders) {
		const src = path.join(PACK_SRC, folder.name);
		const dest = path.join(PACK_DEST, folder.name);

		console.log(`Compiling pack ${folder.name}`);
		await compilePack(src, dest, { recursive: true, log: true });
	}
}

function cleanPackEntry(data, { clearSourceId = true, ownership = 0 } = {}) {
	if (data.ownership) data.ownership = { default: ownership };
	if (clearSourceId) {
		delete data._stats?.compendiumSource;
		delete data.flags?.core?.sourceId;
	}
	delete data.flags?.importSource;
	delete data.flags?.exportSource;

	// Remove empty entries in flags
	if (!data.flags) data.flags = {};
	Object.entries(data.flags).forEach(([key, contents]) => {
		if (Object.keys(contents).length === 0) delete data.flags[key];
	});
}

await compilePacks();
