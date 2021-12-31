/**
 * A program flag.
 */
export type Flag = {
    /**
     * The name of the flag.
     */
    name: string

    /**
     * A description of what the flag does.
     */
    description: string

    /**
     * The default value of the flag.
     */
    default: (string | number | boolean | string[])
}

/**
 * A positional argument.
 */
export type Argument = {
    /**
     * The name of the argument.
     */
    name: string

    /**
     * Whether or not the argument is optional.
     */
    optional: boolean
}

/**
 * Build a basic usage information string for a terminal command.
 * @param name The name of the command.
 * @param flags A list of command flags.
 * @param args A list of positional arguments.
 */
export function buildUsageString(name: string, flags: Flag[], args: Argument[]): string {
    let longestFlagName = flags.map(flag => flag.name.length).reduce((acc, cur) => Math.max(acc, cur))
    let longestFlagDesc = flags.map(flag => flag.description.length).reduce((acc, cur) => Math.max(acc, cur))

    return [
        `Usage: ${name} [options...] ${args.map(arg => `${arg.optional ? "[" : "<"}${arg.name}${arg.optional ? "]" : ">"}`).join(" ")}`,
        ...flags.map(flag => `  --${flag.name.padEnd(longestFlagName, " ")} ${flag.description.padEnd(longestFlagDesc, " ")}`)
    ].join("\n")
}

/**
 * Turn a list of Flag objects into something `ns.flags` can understand.
 * @param flags A list of flag objects.
 */
export function buildNetscriptFlagsArray(flags: Flag[]): [ string, string | number | boolean | string[] ][] {
    return flags.map(flag => [ flag.name, flag.default ])
}