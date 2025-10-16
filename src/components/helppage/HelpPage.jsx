import { StyledHelpPage } from "./HelpPage.styled"
import { hasAnyPermission, hasPermission } from '../../modules/helper/Permissions'

import { Alert, Blank, Check, Delayed, Deny } from "../dateplanner/attendenceInput/Terminzusage"

const HelpPage = ({ auth_level, theme }) => {

    const Section = ({ title, id, children }) => (
        <article id={id}>
            <h1>{title}</h1>
            {children}
        </article>
    )

    const QuickStart = () => (
        <Section title="Erste Schritte" id="quickstart">
            <p>Das Dashboard fasst die nächsten Termine, Statistiken und Neuigkeiten zusammen. Tippe auf eine Karte, um Detailinformationen zu öffnen.</p>
            <ul>
                <li>Über das Menü oben links erreichst du sämtliche Module. Auf mobilen Geräten hilft zusätzlich die Leiste am unteren Bildschirmrand beim schnellen Wechsel.</li>
                <li>Die Glocke rechts oben steuert Push-Benachrichtigungen – sie zeigt dir direkt an, ob Meldungen aktiv sind.</li>
                <li>Das Versionslabel unten rechts verrät, welche App-Version installiert ist. Bei Problemen kannst du diese Angabe weitergeben.</li>
            </ul>
            <p>Auf der Startseite findest du außerdem das Feedback-Formular sowie das Änderungsprotokoll. So bleibst du über neue Funktionen informiert und kannst Anregungen loswerden.</p>
        </Section>
    )

    const Notifications = () => (
        <Section title="Benachrichtigungen" id="notifications">
            <p>Die App unterstützt Push-Benachrichtigungen für Auftritte, Proben und sonstige Termine.</p>
            <ul>
                <li>Aktiviere oder deaktiviere Benachrichtigungen über die Glocke auf der Startseite. Beim ersten Aktivieren fragt dein Browser nach der Berechtigung.</li>
                <li>In den <b>Einstellungen</b> kannst du genau auswählen, für welche Kategorien du Nachrichten erhalten möchtest.</li>
                <li>Sollte dein Gerät keine Benachrichtigungen unterstützen, informiert dich die App automatisch.</li>
            </ul>
        </Section>
    )

    const PrivacyPolicy = () => (
        <Section title="Datenschutz" id="privacy">
            <p>Für den Betrieb der Anwendung werden die folgenden Daten gespeichert:</p>
            <ul>
                <li>Vor- und Nachname sowie Geburtsdatum</li>
                <li>An- und Abmeldungen zu Terminen sowie tatsächliche Teilnahmen</li>
                <li>Abwesenheiten und Bestellungen</li>
            </ul>
            <p>Zur Verbesserung der Stabilität und Nutzbarkeit erheben wir zusätzlich technische Informationen:</p>
            <ul>
                <li>Loginzeiten und verwendetes Gerät (Browser/App, Auflösung, User-Agent, Geräte-ID)</li>
                <li>Berechtigungsstatus für Benachrichtigungen sowie gewählter Darstellungsmodus</li>
                <li>Verwendung der einzelnen Module abseits der Startseite</li>
                <li>Historie deiner Rückmeldungen zu Terminen</li>
            </ul>
            <p>Diese Daten dienen ausschließlich dem Betrieb der Anwendung und der Fehleranalyse. Sie werden auf einem Server in Deutschland gespeichert, sind nicht öffentlich einsehbar und werden nicht an Dritte weitergegeben. Bei Fragen oder Löschwünschen wende dich an den Administrator.</p>
        </Section>
    )

    const Attendance = () => (
        <Section title="Anwesenheiten" id="attendance">
            <h2>Rückmeldung geben</h2>
            <p>
                Unter <b>Anwesenheiten</b> kannst du deine Teilnahme für jeden Termin festlegen. Per Klick auf die Symbole wechselst du zwischen <i>Zusage</i> <Check theme={theme} />, <i>Absage</i> <Deny theme={theme} />, <i>Vielleicht</i> <Alert theme={theme} /> oder <i>verspäteter Teilnahme</i> <Delayed theme={theme} />. Ein <Blank theme={theme} /> bedeutet, dass noch keine Rückmeldung vorliegt. Speichere deine Änderungen über den Button am Ende der Liste.
            </p>
            <p>Die Terminliste ist nach Veranstaltungstyp gegliedert. Filter und Suchfeld helfen dir, schnell den passenden Termin zu finden.</p>
            {hasPermission(7) && <>
                <h2>Übersicht</h2>
                <p>Mit der passenden Berechtigung erhältst du einen Überblick über die Rückmeldungen aller Gruppen. So erkennst du Engpässe bereits vor dem Termin.</p>
            </>}
            {hasPermission(6) && <>
                <h2>Manuelle Eingabe</h2>
                <p>Dieser Bereich erlaubt es dir, Rückmeldungen im Namen einzelner Personen zu korrigieren oder nachzutragen – praktisch, wenn kurzfristig Änderungen notwendig sind.</p>
            </>}
        </Section>
    )

    const Absence = () => (
        <Section title="Urlaub &amp; Abmeldungen" id="absence">
            <p>Trage geplante Abwesenheiten ein, damit neue Termine in diesem Zeitraum automatisch als „abwesend“ markiert werden. Bereits bestehende Termine werden beim Speichern mit aktualisiert.</p>
            <h2>Persönliche Übersicht</h2>
            <p>Die Liste zeigt alle zukünftigen Abwesenheiten. Vergangene Einträge verschwinden automatisch, damit du die Übersicht behältst.</p>
            <h2>Eingabe</h2>
            <p>Fülle die Felder für Zeitraum, betroffene Wochentage und optional geradzahlige/ungerade Wochen aus. Mit einem Klick auf <i>Speichern</i> erscheint der Eintrag links und lässt sich jederzeit bearbeiten.</p>
            {auth_level > 2 && <>
                <h2>Gesamtübersicht &amp; Verwaltung</h2>
                <p>Administratoren können in der <b>Gesamtübersicht</b> alle Abwesenheiten durchsuchen und unter <b>manuelle Eingabe</b> Abmeldungen direkt für andere Personen erstellen.</p>
            </>}
        </Section>
    )

    const MemberAdministration = () => (
        <Section title="Mitglieder" id="members">
            <h2>Übersicht</h2>
            <p>Die Mitgliederliste enthält Namen und Geburtsdaten aller Nutzer. Such- und Filtermöglichkeiten unterstützen dich beim schnellen Auffinden einzelner Personen.</p>
            {hasPermission(2) && <>
                <h2>Stammdaten</h2>
                <p>Mit erweiterter Berechtigung bearbeitest du Stammdaten wie Kontaktinformationen oder Rollen direkt im Formular. Änderungen werden nach dem Speichern sofort übernommen.</p>
            </>}
        </Section>
    )

    const DateAdministration = () => (
        <Section title="Termine" id="dates">
            <h2>Übersicht</h2>
            <p>Hier findest du alle Termine inklusive Treffpunkt, Abfahrt, Rückfahrt und Kleiderordnung. Sortier- und Filteroptionen erleichtern die Planung.</p>
            {auth_level > 2 && <>
                <h2>Details</h2>
                <p>Über den Bereich <b>Details</b> legst du neue Termine an oder bearbeitest bestehende Daten wie Zeiten, Treffpunkte oder ob Begleitpersonen erlaubt sind.</p>
            </>}
        </Section>
    )

    const EvaluationHelp = () => (
        <Section title="Auswertungen" id="evaluation">
            <p>Die Auswertungen zeigen dir persönliche und gruppenweite Statistiken zu Anwesenheiten.</p>
            <ul>
                <li><b>Meine Übersicht</b> fasst deine eigenen Rückmeldungen und Teilnahmequoten zusammen.</li>
                {hasPermission(8) && <li><b>Übersicht</b> vergleicht Gruppen miteinander und hebt Auffälligkeiten hervor.</li>}
                {hasPermission(9) && <li><b>Auswertung</b> erlaubt das Exportieren und Weiterverarbeiten der Daten.</li>}
            </ul>
        </Section>
    )

    const ScoreboardHelp = () => (
        <Section title="Notenarchiv" id="scoreboard">
            <p>Im Notenarchiv findest du digitale Partituren. Nutze das Suchfeld, um schnell nach Titeln zu filtern.</p>
            <ul>
                <li>Wähle einen Eintrag aus der Liste, um die Noten direkt im integrierten Viewer zu öffnen.</li>
                <li>Über den Link „In neuem Fenster anzeigen“ öffnest du die Datei separat – ideal zum Drucken oder für große Bildschirme.</li>
            </ul>
        </Section>
    )

    const OrderAdministrationHelp = () => (
        <Section title="Bestellungen" id="orders">
            <p>Hier verwaltest du Kleider- und Materialbestellungen.</p>
            <ul>
                <li>Die Tabelle zeigt Status, Größen und Anmerkungen der Anfragen. Mit dem Filter wechselst du zwischen eigenen und allen Bestellungen.</li>
                <li>Das Formular unten reicht neue Wünsche ein. Pflichtfelder sind Artikel, Größe und Anzahl.</li>
                <li>Nach dem Speichern werden erfolgreiche Bestellungen bestätigt und erscheinen in der Liste.</li>
            </ul>
        </Section>
    )

    const SettingsHelp = () => (
        <Section title="Einstellungen" id="settings">
            <p>Die Einstellungen bündeln persönliche Informationen und Sicherheitsfunktionen.</p>
            <ul>
                <li>Ändere dein Passwort über das Formular. Sobald du es speicherst, gilt es sofort für den nächsten Login.</li>
                <li>Verwalte deine Benachrichtigungskategorien. Die App aktiviert nur die Kategorien, die du hier freigibst.</li>
                <li>Falls du aus Sicherheitsgründen auf die Einstellungsseite weitergeleitet wurdest, findest du dort eine kurze Erklärung.</li>
            </ul>
        </Section>
    )

    const AdministrationHelp = () => (
        <Section title="Verwaltung" id="administration">
            <p>Der Verwaltungsbereich richtet sich an Administratoren und Redakteure.</p>
            <ul>
                <li>Verwalte Vereine, Benutzergruppen und ihre Zuordnungen.</li>
                {hasAnyPermission([3, 4]) && <li>Mit zusätzlicher Berechtigung kannst du Rollen definieren und zuweisen.</li>}
                <li>Nutze Terminvorlagen, um wiederkehrende Veranstaltungen schneller anzulegen.</li>
                <li>Im Bereich „Noten“ pflegst du das digitale Archiv für das Scoreboard.</li>
            </ul>
        </Section>
    )

    const Roadmap = () => (
        <Section title="Geplante Funktionen" id="roadmap">
            <ul>
                <li>Verbesserte Marschübersicht</li>
                <li>Terminprotokoll zur Dokumentation und für die Chronik</li>
                <li>Digitale Aufstellungsplanung fürs Marschieren</li>
            </ul>
        </Section>
    )

    return (
        <StyledHelpPage>
            <QuickStart />
            <Notifications />
            <PrivacyPolicy />
            <Attendance />
            <Absence />
            {hasAnyPermission([1, 2]) && <MemberAdministration />}
            {auth_level > 0 && <DateAdministration />}
            <EvaluationHelp />
            <ScoreboardHelp />
            <OrderAdministrationHelp />
            <SettingsHelp />
            {auth_level > 2 && <AdministrationHelp />}
            <Roadmap />
        </StyledHelpPage>
    )
}

export default HelpPage
