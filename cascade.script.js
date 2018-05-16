/**
 * Cascade
 * 
 * This script goes through all the servers you can currently get root access to,
 * and runs a specified script on them.
 * 
 * The script will run scripts with the maximum number of threads that the server
 * can have in order for Cascade to still run.
 * 
 * USAGE: run cascade.script some-script.script
 * ! DO NOT RUN WITH ANY ADDITIONAL ARGUMENTS, OR YOU WILL FACE A TERRIBLE FATE !
 */

neighbors = scan(getHostname());

if (args.length === 0) {
    args[0] = ""; // Replace this line with a default script, if you want.
    args[1] = [getHostname()];
}

if (args.length === 1) {
    args[1] = [getHostname()]
}

for (i = 0; i < neighbors.length; ++i) {
    if (neighbors[i] != getHostname() && !args[1].includes(neighbors[i])) {
        // Replace "2" in the following line with the number of port openers you have access to.
        if (hasRootAccess(neighbors[i]) === false && getServerNumPortsRequired(neighbors[i]) <= 2) {
            // Replace the following lines with all the port openers you have access to in the following format:
            // portopener(neighbors[i]);
            // Using that exact format is very important.
            brutessh(neighbors[i]);
            ftpcrack(neighbors[i]);
            nuke(neighbors[i]);
        }
        if (hasRootAccess(neighbors[i]) === true) {
            scp("cascade.script", neighbors[i]);
            exec("cascade.script", neighbors[i], 1, args[0], args[1]);
            if (neighbors[i] !== "home" && isRunning(args[0], neighbors[i]) === false) {
                scp(args[0], neighbors[i]);
                maxCount = Math.floor((getServerRam(neighbors[i])[0]-getScriptRam("cascade.script"))/getScriptRam(args[0]))
                if ((maxCount > 0) === true) {
                    exec(args[0], neighbors[i], maxCount);
                }
            }
        }
    }
    args[1].push(neighbors[i]);
}