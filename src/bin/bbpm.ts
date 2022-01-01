/**
 * @name BBPM (BitBurner Package Manager)
 * @description A proof-of-concept package manager for Bitburner.
 */

import { NS } from "/../NetscriptDefinitions.js"

type PackageList = Package[]

/**
 * A BPPM package. Essentially instructions on how to install a bitburner script (or collection thereof).
 */
type Package = {
    /**
     * The name of the package.
     */
    name: string

     /**
      * A brief description of what the package includes.
      */
    description: string
 
     /**
      * The current version of the package.
      */
    version: string
 
     /**
      * The author of the package.
      */
    author: string

     /**
     * A list of other packages that this package depends on.
     */
    dependencies: string[]

    /**
     * A manifest indicating what files should be downloaded from where when installing the package.
     */
    manifest: Manifest
}

/**
 * A manifest of files to be included in a package. Takes the form of `{ "/bitburner/file.js": "file download URL" }`
 * @example { "/example/script.js": "https://example.com/example.js" }
 */
type Manifest = {
    [scriptName: string]: string
}

const PACKAGE_LIST_URL = "https://raw.githubusercontent.com/jojotastic777/bitburner-scripts/main/bppm/example-package-list.json"

function printPackage(pkg: Package) {
    return [
        `Name: ${pkg.name}`,
        `Description: ${pkg.description}`,
        `Version: ${pkg.version}`,
        `Author: ${pkg.author}`,
        `Dependencies:`,
        pkg.dependencies.map(dep => `    ${dep}`).join("\n"),
        `Manifest:`,
        Object.keys(pkg.manifest).map(file => `    ${file}: ${pkg.manifest[file]}`).join("\n")
    ].join("\n")
}

type InstallPackageFailure = "PACKAGE_NOT_FOUND"
type InstallPackageSuccess = "OK"
type InstallPackageStatus  = { status: InstallPackageFailure | InstallPackageSuccess, packageName: string }

function normalizeFilename(filename: string): string {
    return filename[0] === "/" && !filename.slice(1).includes("/") ? filename.slice(1) : filename
}

async function installPackage(ns: NS, packageName: string, packageList: PackageList): Promise<InstallPackageStatus> {
    let pkg = packageList.find(p => p.name === packageName)

    if (pkg === undefined) {
        return { status: "PACKAGE_NOT_FOUND", packageName }
    }

    let depInstallStatusList: InstallPackageStatus[] = []

    for (let dep of pkg.dependencies) {
        depInstallStatusList.push(await installPackage(ns, dep, packageList))
    }

    if (depInstallStatusList.filter(s => s.status !== "OK").length > 0) {
        return depInstallStatusList.filter(s => s.status !== "OK")[0]
    }

    for (let fileName of Object.keys(pkg.manifest)) {
        let fileUrl = pkg.manifest[fileName]

        let wgetStatus = await ns.wget(fileUrl, normalizeFilename(fileName))
        
        if (wgetStatus) {
            ns.tprintf(`Successfully downloaded ${fileName} from ${fileUrl}`)
        } else {
            ns.tprintf(`Failed to download ${fileName} from ${fileUrl}`)
        }
    }

    return { status: "OK", packageName }
}

const USAGE_TEXT = [
    `Usage: bppm <command>`,
    ``,
    `Commands:`,
    `    bppm help                    Display this help menu.`,
    `    bppm list                    List available packages.`,
    `    bppm install <package name>  Install a package.`,
    // `    bppm remove <package name>   Remove a package.`
].join("\n")

export async function main(ns: NS) {
    let packageList: PackageList = await (await fetch(PACKAGE_LIST_URL)).json()

    if (ns.args[0] === undefined || ns.args[0] === "help") {
        ns.tprintf(USAGE_TEXT)
    }

    if (ns.args[0] === "list") {
        packageList.forEach(pkg => {
            ns.tprintf("Package:")
            ns.tprintf(printPackage(pkg).split("\n").map(line => `    ${line}`).join("\n"))
        })
        ns.exit()
    }

    if (ns.args[0] === "install") {
        let pkgName: string = ns.args[1] as string

        if (pkgName === undefined) {
            ns.tprintf(USAGE_TEXT)
            ns.exit()
            return
        }

        await installPackage(ns, pkgName, packageList)
    }
}