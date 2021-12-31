/**
 * Build a basic usage information string for a terminal command.
 * @param name The name of the command.
 * @param flags A list of command flags.
 * @param args A list of positional arguments.
 */
export function buildUsageString(name, flags, args) {
    let longestFlagName = flags.map(flag => flag.name.length).reduce((acc, cur) => Math.max(acc, cur));
    let longestFlagDesc = flags.map(flag => flag.description.length).reduce((acc, cur) => Math.max(acc, cur));
    return [
        `Usage ${name} [options...] ${args.map(arg => `${arg.optional ? "[" : "<"}${arg.name}${arg.optional ? "]" : ">"}`).join(" ")}`,
        ...flags.map(flag => `  --${flag.name.padEnd(longestFlagName, " ")} ${flag.description.padEnd(longestFlagDesc, " ")}`)
    ].join("\n");
}
/**
 * Turn a list of Flag objects into something `ns.flags` can understand.
 * @param flags A list of flag objects.
 */
export function buildNetscriptFlagsArray(flags) {
    return flags.map(flag => [flag.name, flag.default]);
}
