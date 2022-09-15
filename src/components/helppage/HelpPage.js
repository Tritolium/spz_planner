import { StyledHelpPage } from "./HelpPage.styled"

import check from '../../modules/img/check.png'
import deny from '../../modules/img/delete-button.png'
import blank from '../../modules/img/blank.png'

const HelpPage = ({ auth_level }) => {

    const Attendence = () => {
        return (
            <div>
                <h1>Anwesenheiten</h1>
                <h2>Eingabe</h2>
                <p>
                    In diesem Menü können die Abwesenheiten eingetragen werden, einzeln für jeden Termin.
                    Per Klick auf das Symbol kann zwischen einer Zusage <img src={check} alt="Zusage"/> und Absage <img src={deny} alt="Absage"/> gewählt werden.
                    Wird <img src={blank} alt="Ohne Rückmeldung"/> angezeigt, ist noch keine Rückmeldung erfolgt.
                    Nach Änderungen wird das Ergebnis über den Button gespeichert.
                </p>
                {auth_level > 1 ? <>
                    <h2>Übersicht</h2>
                    <p>Hier können die Rückmeldungen eingesehen werden, geordnet nach Benutzergruppen.</p>
                </> : <></>}
                {auth_level > 2 ? <>
                    <h2>manuelle Eingabe</h2>
                    <p>Unter diesem Punkt können für einzelne Termine einzelne Personen an- oder abgemeldet werden.</p>
                </> : <></>}
                
            </div>
        )
    }

    const Absence = () => {
        return (
            <div>
                <h1>Abwesenheiten</h1>
                <p>Eingetragene Abwesenheiten sorgen dafür, dass neue Termine in diesem Zeitraum automatisch als Abwesend eingetragen werden. Auch bei bestehenden Terminen wird die Person auf Abwesend gesetzt.</p>
                <h2>Übersicht</h2>
                <p>Hier werden die eingetragenen persönlichen Abwesenheiten angezeigt. Abgelaufene Zeiten tauchen nicht mehr auf.</p>
                <h2>Eingabe</h2>
                <p>In dieser Ansicht können Abwesenheiten eingetragen werden. Einfach die Felder füllen und speichern. Der Eintrag wird dann auf der linken Seite angezeigt und kann auch hier wieder bearbeitet werden.</p>
                {auth_level > 2 ? <>
                    <h2>Gesamtübersicht</h2>
                    <p>Hier werden alle Anwesenheiten angezeigt.</p>
                </> : <></>}
            </div>
        )
    }

    const Memberadministration = () => {
        return (
            <div>
                <h1>Mitglieder</h1>
                <h2>Übersicht</h2>
                <h2>Stammdaten</h2>
            </div>
        )
    }

    const Dateadministration = () => {
        return (
            <div>
                <h1>Termine</h1>
                <h2>Übersicht</h2>
                <p>Hier werden alle Termine angezeigt, inklusive der Zeiten für Abfahrt, Rückfahrt und Beginn</p>
                {auth_level > 2 ? <>
                    <h2>Details</h2>
                </> : <></>}
            </div>
        )
    }

    const Administration = () => {
        return (
            <div>
                <h1>Verwaltung</h1>
                <h2>Benutzergruppen</h2>
            </div>
        )
    }

    return (
        <StyledHelpPage>
            {auth_level > 0 ? <Attendence /> : <></>}
            {auth_level > 0 ? <Absence /> : <></>}
            {auth_level > 1 ? <Memberadministration /> : <></>}
            {auth_level > 0 ? <Dateadministration /> : <></>}
            {auth_level > 2 ? <Administration /> : <></>}
        </StyledHelpPage>
    )
}

export default HelpPage