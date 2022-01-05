import { NS } from "/../NetscriptDefinitions.js"

export const doc: Document = eval("document")

export class Indicator {
    public rootElem: HTMLElement
    private labelTextElem: HTMLElement
    private valueTextElem: HTMLElement

    constructor(
        private ns: NS,
        public label: string,
        public value: string
    ) {
        let indic       = doc.createElement("tr")
        indic.className = "MuiTableRow-root css-9k2whp"

        let indicLabel           = doc.createElement("th")
        indicLabel.className     = "jss7 MuiTableCell-root MuiTableCell-body MuiTableCell-sizeMedium css-hadb7u"
        indicLabel.style.borderBottom = "none"
        indic.appendChild(indicLabel)
        let indicLabelText       = doc.createElement("p")
        indicLabelText.className = "jss10 MuiTypography-root MuiTypography-body1 css-muznbz"
        indicLabelText.innerText = label
        indicLabel.appendChild(indicLabelText)

        let indicValue = doc.createElement("th")
        indicValue.className = "jss7 MuiTableCell-root MuiTableCell-body MuiTableCell-alignRight MuiTableCell-sizeMedium css-7v1cxh"
        indicValue.style.borderBottom = "none"
        indic.appendChild(indicValue)
        let indicValueText = doc.createElement("p")
        indicValueText.className = "jss10 MuiTypography-root MuiTypography-body1 css-muznbz"
        indicValueText.innerText = value
        indicValue.appendChild(indicValueText)

        this.rootElem = indic
        this.labelTextElem = indicLabelText
        this.valueTextElem = indicValueText

        //this.ns.atExit(() => this.rootElem.remove())

        const statsBox = doc.getElementById("overview-extra-hook-0")?.parentElement?.parentElement?.parentElement as HTMLElement
        const template = doc.getElementById("overview-extra-hook-0")?.parentElement?.parentElement as HTMLElement
        statsBox.insertBefore(this.rootElem, template)
    }

    public setLabel(text: string) {
        this.labelTextElem.innerText = text
    }

    public setValue(text: string) {
        this.valueTextElem.innerText = text
    }

    public remove() {
        this.rootElem.remove()
    }
}
