import { StyledHelpPage } from "./HelpPage.styled"
import { hasAnyPermission, hasPermission } from '../../modules/helper/Permissions'

import check from '../../modules/img/check.png'
import deny from '../../modules/img/delete-button.png'
import blank from '../../modules/img/blank.png'

const HelpPage = ({ auth_level }) => {

    const Privacypolicy = () => {
        return (
            <article>
                <h1>Datenschutz</h1>
                <p>Die Anwendung speichert hauptsächlich Daten, die für den Betrieb notwendig sind. Dazu gehören:</p>
                <ul>
                    <li>Vor- und Nachname</li>
                    <li>Geburtsdatum</li>
                    <li>eingetragene sowie tatsächliche Anwesenheit bei Terminen</li>
                    <li>eingetragene Abwesenheiten</li>
                    <li>eingetragene Bestellungen</li>
                </ul>
                <p>Zusätzlich werden folgende Daten erhoben:</p>
                <ul>
                    <li>Loginzeiten</li>
                    <li>Anzeige (Browser/installiert)</li>
                    <li>Auflösung</li>
                    <li>UserAgent</li>
                    <li>eindeutige Geräte-ID (bleibt auch nach installieren der App gleich)</li>
                    <li>Verwendung von Farbmodi (Dark/Light/forced)</li>
                    <li>Verwendung der Module abseits der Startseite (Anwesenheiten/Urlaub/....), siehe Menü</li>
                </ul>
                <p>Diese zusätzlichen Daten dienen ausschließlich dazu, die Benutzbarkeit der App zu verbessern und um eventuelle Fehler nachzuvollziehen.</p>
                <p>Die Daten werden nicht an Dritte weitergegeben und nur für den Betrieb der Anwendung verwendet. Die Daten werden auf einem Server in Deutschland gespeichert und sind nur für den Administrator einsehbar.</p>
            </article>
        )
    }

    const Attendence = () => {
        return (
            <article>
                <h1>Anwesenheiten</h1>
                <h2>Eingabe</h2>
                <p>
                    In diesem Menü können die Abwesenheiten eingetragen werden, einzeln für jeden Termin.
                    Per Klick auf das Symbol kann zwischen einer Zusage <img src={check} alt="Zusage"/> und Absage <img src={deny} alt="Absage"/> gewählt werden.
                    Wird <img src={blank} alt="Ohne Rückmeldung"/> angezeigt, ist noch keine Rückmeldung erfolgt.
                    Nach Änderungen wird das Ergebnis über den Button gespeichert.
                </p>
                {hasPermission(7) ? <>
                    <h2>Übersicht</h2>
                    <p>Hier können die Rückmeldungen eingesehen werden, geordnet nach Benutzergruppen.</p>
                </> : <></>}
                {hasPermission(6) ? <>
                    <h2>manuelle Eingabe</h2>
                    <p>Unter diesem Punkt können für einzelne Termine einzelne Personen an- oder abgemeldet werden.</p>
                </> : <></>}
                
            </article>
        )
    }

    const Absence = () => {
        return (
            <article>
                <h1>Urlaub/Abmeldung</h1>
                <p>Eingetragene Abwesenheiten sorgen dafür, dass neue Termine in diesem Zeitraum automatisch als Abwesend eingetragen werden. Auch bei bestehenden Terminen wird die Person auf Abwesend gesetzt.</p>
                <h2>Übersicht</h2>
                <p>Hier werden die eingetragenen persönlichen Abwesenheiten angezeigt. Abgelaufene Zeiten tauchen nicht mehr auf.</p>
                <h2>Eingabe</h2>
                <p>In dieser Ansicht können Abwesenheiten eingetragen werden. Einfach die Felder füllen und speichern. Der Eintrag wird dann auf der linken Seite angezeigt und kann auch hier wieder bearbeitet werden.</p>
                <p>Über die Wochentage kann ausgewählt werden, an welchen Tagen diese Abwesenheit gelten soll, gleiches gilt für die Auswahl von geraden und ungeraden Wochen.</p>
                {auth_level > 2 ? <>
                    <h2>Gesamtübersicht</h2>
                    <p>Hier werden alle Anwesenheiten angezeigt.</p>
                </> : <></>}
            </article>
        )
    }

    const Memberadministration = () => {
        return (
            <article>
                <h1>Mitglieder</h1>
                <h2>Übersicht</h2>
                <p>Simple Übersicht aller Nutzer mit Name und Geburtsdatum</p>
                {hasPermission(2) && <><h2>Stammdaten</h2>
                    <p>Hier können die Stammdaten der Nutzer angepasst werden</p></>
                }
            </article>
        )
    }

    const Dateadministration = () => {
        return (
            <article>
                <h1>Termine</h1>
                <h2>Übersicht</h2>
                <p>Hier werden alle Termine angezeigt, inklusive der Zeiten für Abfahrt, Rückfahrt und Beginn</p>
                {auth_level > 2 ? <>
                    <h2>Details</h2>
                    <p>Unter Details können die Termine bearbeitet werden, Datum, Uhrzeit, Bekleidung, sowie ob Partner mit angegeben werden können.</p>
                </> : <></>}
            </article>
        )
    }

    const Administration = () => {
        return (
            <article>
                <h1>Verwaltung</h1>
                <h2>Benutzergruppen</h2>
            </article>
        )
    }

    const Upcoming = () => {
        return (
            <article>
                <h1>Geplante Funktionen:</h1>
                <ul>
                    <li>verbesserte Marschübersicht</li>
                    <li>Terminprotokoll zum Nachvollziehen sowie für die Chronik</li>
                    <li>Aufstellung fürs Marschieren</li>
                </ul>
                
            </article>
        )
    }

    return (
        <StyledHelpPage>
            <Privacypolicy />
            <Attendence />
            <Absence />
            {hasAnyPermission([1, 2]) && <Memberadministration />}
            {auth_level > 0 ? <Dateadministration /> : <></>}
            {auth_level > 2 ? <Administration /> : <></>}
            <Upcoming />
        </StyledHelpPage>
    )
}

export default HelpPage