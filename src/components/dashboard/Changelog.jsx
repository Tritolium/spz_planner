import { useState } from "react"
import { StyledChangelog } from "./Dashboard.styled"
import Button from "../../modules/components/button/Button"

export const Changelog = ({ read, version }) => {
    const [clicked, setClicked] = useState(false)

    const onClick = () => {
        setClicked(true)
        localStorage.setItem("changelogRead", version)
    }

    return(
        <StyledChangelog id="changelog">
            {!(read || clicked) ? <Button onClick={onClick}>Änderungen verbergen</Button> : <></>}
            {!(read || clicked) ? 
                <>
                    <h2>Neu in {version}:</h2>
                    <ul>
                        <li>
                            <i>Startseite:</i>
                            Für die Termine auf der Startseite können weitere Informationen hinterlegt werden. Einfach auf den Termin tippen, um das Fenster zu öffnen.<br/>
                            Außerdem werden die Termine jetzt in drei Kategorien eingeteilt und angezeigt: Proben, Auftritte und sonstige Termine.
                        </li>
                        <li>
                            <i>Allgemein:</i> Benachrichtigungen können an- & abgeschaltet werden, entweder über die Glocke, oder über die Einstellungen. Dort ist auch die Unterscheidung zwischen Üben und Auftritt möglich.
                        </li>
                    </ul>
                </>
                : <></>
            }
        </StyledChangelog>
    )
}