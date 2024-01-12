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
            {!(read || clicked) ? 
                <>
                    <h2 className="New">Neu in {version}:</h2>
                    <ul>
                        <li>
                            <i>Startseite/Anwesenheiten: </i>
                            Auf der Startseite und unter Anwesenheiten können jetzt für freigeschaltete Termine Partner mit angegeben werden. Das soll die Planung für Busse etc. erleichtern.
                        </li>
                        <li>
                            <i>Startseite: </i>
                            Am Ende der Startseite wird eine kleine Nutzungsstatistik angezeigt.
                        </li>
                        <li>
                            <i>Benachrichtigungen: </i>
                            Benachrichtigungen können jetzt auch für die neue Terminkategorie "Sonstige Termine" aktiviert/deaktiviert werden. Siehe Einstellungen.
                        </li>
                        <li>
                            <i>Termine: </i>
                            Die Termine können jetzt auch nach Kategorien gefiltert werden. Vorher passierte dies nur über den Titel Üben/Probe.
                        </li>
                    </ul>
                    Darüber hinaus wurden einge Dinge im Hintergrund angepasst, damit die App in Zukunft noch besser funktioniert.
                    Kleine Aussicht für die Zukunft: Passwörter werden demnächst notwendig, damit z.B. Bildergalerien nur für Mitglieder sichtbar sind. Wer die App bereits installiert hat, wird davon wenig mitbekommen, da ein Login nicht jedes Mal notwendig ist.
                    <br/>
                    Einige neue Funktionen werden daher auch nur für installierte Apps verfügbar sein.
                    <div className="Previous">
                        <h2>Neu in v0.11:</h2>
                        <ul>
                            <li>
                                <i>Startseite: </i>
                                Für die Termine auf der Startseite können weitere Informationen hinterlegt werden. Einfach auf den Termin tippen, um das Fenster zu öffnen.<br/>
                                Außerdem werden die Termine jetzt in drei Kategorien eingeteilt und angezeigt: Proben, Auftritte und sonstige Termine.
                            </li>
                            <li>
                                <i>Allgemein: </i>
                                Benachrichtigungen können an- & abgeschaltet werden, entweder über die Glocke, oder über die Einstellungen. Dort ist auch die Unterscheidung zwischen Üben und Auftritt möglich.
                            </li>
                        </ul>
                    </div>
                </>
                : <></>
            }
            {!(read || clicked) ? <Button onClick={onClick}>Änderungen verbergen</Button> : <></>}
        </StyledChangelog>
    )
}