import { Logger } from "/lib/log.js";
import { buildNetscriptFlagsArray, buildUsageString } from "/lib/usage.js";
const MANIFEST_URL = "https://github.com/jojotastic777/bitburner-scripts/raw/main/data/http-updater-manifest.json";
const FLAGS = [
    { name: "notext", default: false, description: "Silences text output." },
    { name: "notoast", default: false, description: "Silences toast output." },
    { name: "debug", default: false, description: "Enables debug output. Overrides notext flag." },
    { name: "help", default: false, description: "Display this help output." }
];
const USAGE = buildUsageString("update", FLAGS, []);
export async function main(ns) {
    let flags = { notext: false, notoast: false, debug: false, help: false };
    try {
        flags = ns.flags(buildNetscriptFlagsArray(FLAGS));
    }
    catch (e) {
        ns.tprintf(USAGE);
        ns.exit();
    }
    if (flags.help) {
        ns.tprintf(USAGE);
        ns.exit();
    }
    let logger = new Logger(ns, "update", flags.notext ? "silent" : flags.debug ? "debug" : "info");
    let manifestResponse = (await fetch(MANIFEST_URL));
    logger.debug(`Fetch Response: ${JSON.stringify(manifestResponse)}`);
    if (manifestResponse.status !== 200) {
        logger.error(`Couldn't fetch manifest from '${MANIFEST_URL}'. Error ${manifestResponse.statusText}. (${manifestResponse.status}})`);
        ns.exit();
    }
    logger.info(`Fetched manifest from '${MANIFEST_URL}'.`);
    let manifestRaw = await manifestResponse.text();
    logger.debug(`Raw manifest:\n${manifestRaw}`);
    let manifest = {};
    try {
        manifest = JSON.parse(manifestRaw);
        logger.debug(`Parsed manifest.`);
    }
    catch (e) {
        logger.error(`Failed to parse manifest.`);
        ns.exit();
    }
    let totalDownloaded = 0;
    for (let path of Object.keys(manifest)) {
        let url = manifest[path];
        let itemResponse = await fetch(url);
        if (itemResponse.status !== 200) {
            logger.error(`Failed to fetch '${path}' from '${url}'. Error ${itemResponse.statusText}. (${itemResponse.status})`);
            continue;
        }
        let item = await itemResponse.text();
        logger.debug(`${path}:\n${item}`);
        await ns.write(path, [item]);
        logger.info(`Fetched '${path}' from '${url}'.`);
    }
    logger.info(`Update ${totalDownloaded === Object.keys(manifest).length ? "successful" : "failed"}. Fetched ${totalDownloaded}/${Object.keys(manifest).length} files.`);
}
