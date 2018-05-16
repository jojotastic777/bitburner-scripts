/**
 * Run (A derivative of the Cascade script.)
 * 
 * This script goes through all the servers you can currently get root access to,
 * and runs a specified script on them.
 * 
 * The script will run scripts with only one thread. Do not try to specify more.
 * If you do try to specify more, there will be terrible and near-irreversible
 * consequences.
 * 
 * USAGE: run run.script some-script.script
 * ! DO NOT RUN WITH ANY ADDITIONAL ARGUMENTS, OR YOU WILL BE MET WITH A TERRIBLE FATE. !
 */

neighbors = scan(getHostname());

if (args.length === 0) {
    args[0] = "";
    args[1] = [getHostname()];
}

if (args.length === 1) {
    args[1] = [getHostname()]
}

for (i = 0; i < neighbors.length; ++i) {
    if (neighbors[i] != getHostname() && !args[1].includes(neighbors[i])) {
        if (hasRootAccess(neighbors[i]) === false && getServerNumPortsRequired(neighbors[i]) <= 2) {
            brutessh(neighbors[i]);
            ftpcrack(neighbors[i]);
            nuke(neighbors[i]);
        }
        if (hasRootAccess(neighbors[i]) === true) {
            scp("run.script", neighbors[i]);
            exec("run.script", neighbors[i], 1, args[0], args[1]);
            if (neighbors[i] !== "home" && isRunning(args[0], neighbors[i]) === false) {
                scp(args[0], neighbors[i]);
                exec(args[0], neighbors[i], 1);
            }
        }
    }
    args[1].push(neighbors[i]);
}