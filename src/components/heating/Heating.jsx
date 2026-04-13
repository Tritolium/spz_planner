import { useEffect, useState } from "react";
import { host } from "../../modules/data/DBConnect";
import { StyledHeating } from "./Heating.styled";
import FullCalendar from "@fullcalendar/react";
import resourceTimeGridPlugin from "@fullcalendar/resource-timegrid";
import { IoIosFlame, IoIosSnow, IoIosSunny } from "react-icons/io";

const HEATING_STATE = {
    OFF: 0,
    UPCOMING: 1,
    ON: 2
}

export const Heating = () => {

    const rooms = {
        1: "Proberaum",
        2: "Theke",
        3: "Lager"
    };

    const [heatingEvents, setHeatingEvents] = useState([]);

    const [active_1, setActive_1] = useState(HEATING_STATE.OFF);
    const [active_2, setActive_2] = useState(HEATING_STATE.OFF);
    const [active_3, setActive_3] = useState(HEATING_STATE.OFF);

    useEffect(() =>{
        fetchHeatingEvents();
        fetchCurrentHeatingEvents();
    }, []);

    useEffect(() => {
        const interval = setInterval(() => {
            fetchCurrentHeatingEvents();
        }, 10000); // every 10 seconds

        return () => clearInterval(interval);
    }, []);

    const fetchHeatingEvents = async () => {
        const response = await fetch(`${host}/api/v0/heatevent?api_token=${localStorage.getItem('api_token')}`);
        const data = await response.json();

        setHeatingEvents(data);
    };

    const fetchCurrentHeatingEvents = async () => {
        const response = await fetch(`${host}/api/v0/heatevent?current&api_token=${localStorage.getItem('api_token')}`);
        const data = await response.json();

        // go through upcoming heating events, set state accordingly
        for (const upcomingEvent of data.upcoming) {
            if (upcomingEvent.room_id === 1) {
                setActive_1(HEATING_STATE.UPCOMING);
            } else if (upcomingEvent.room_id === 2) {
                setActive_2(HEATING_STATE.UPCOMING);
            } else if (upcomingEvent.room_id === 3) {
                setActive_3(HEATING_STATE.UPCOMING);
            }
        }

        //  go through active heating events, set state accordingly
        for (const activeEvent of data.current) {
            if (activeEvent.room_id === 1) {
                setActive_1(HEATING_STATE.ON);
            } else if (activeEvent.room_id === 2) {
                setActive_2(HEATING_STATE.ON);
            } else if (activeEvent.room_id === 3) {
                setActive_3(HEATING_STATE.ON);
            }
        }
    }

    const formatDateTimeLocal = (date) => {
            const pad = (n) => n.toString().padStart(2, '0');
            return `${date.getFullYear()}-${pad(date.getMonth() + 1)}-${pad(date.getDate())}T${pad(date.getHours())}:${pad(date.getMinutes())}`;
        };

    const createEvent = async (e) => {
        e.preventDefault();
        const form = e.target;
        const newEvent = {
            title: form.title.value,
            begin: form.begin.value,
            end: form.end.value,
            room_id: parseInt(form.room_id.value)
        };

        const response = await fetch(`${host}/api/v0/heatevent?api_token=${localStorage.getItem('api_token')}`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(newEvent)
        });

        if (response.ok) {
            const createdEvent = await response.json();
            setHeatingEvents([...heatingEvents, createdEvent]);
            form.reset();
        } else {
            alert('Error creating heating event');
        }
    }

    const createManualEvent = (room_id) => async (e) => {
        e.preventDefault();
        const now = new Date();
        const end = new Date(now.getTime() +  4 * 60 * 60 * 1000); // 4 hours later

        const newEvent = {
            title: 'Manuell gestartet',
            begin: formatDateTimeLocal(now),
            end: formatDateTimeLocal(end),
            room_id: room_id
        };

        const response = await fetch(`${host}/api/v0/heatevent?api_token=${localStorage.getItem('api_token')}`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(newEvent)
        });

        if (response.ok) {
            const createdEvent = await response.json();
            setHeatingEvents([...heatingEvents, createdEvent]);
        } else {
            alert('Error creating heating event');
        }

        fetchCurrentHeatingEvents();
    }

    const stopCurrentEvent = async (room_id) => {
        const response = await fetch(`${host}/api/v0/heatevent?current&api_token=${localStorage.getItem('api_token')}`);
        const data = await response.json();
        const currentEvent = data.current.find(event => event.room_id === room_id);

        if (!currentEvent) {
            alert('No active heating event found for this room');
            return;
        }

        // update the end time of the current event to now
        const updatedEvent = {
            ...currentEvent,
            end: formatDateTimeLocal(new Date())
        };

        const updateResponse = await fetch(`${host}/api/v0/heatevent/${currentEvent.heatevent_id}?api_token=${localStorage.getItem('api_token')}`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(updatedEvent)
        });

        if (updateResponse.ok) {
            fetchHeatingEvents();
            fetchCurrentHeatingEvents();
            switch (room_id) {
                case 1:
                    setActive_1(HEATING_STATE.OFF);
                    break;
                case 2:
                    setActive_2(HEATING_STATE.OFF);
                    break;
                case 3:
                    setActive_3(HEATING_STATE.OFF);
                    break;
                default:
                    break;
            }
        } else {
            alert('Error stopping heating event');
        }
    }

    const deleteEvent = async (id) => {
        const response = await fetch(`${host}/api/v0/heatevent/${id}?api_token=${localStorage.getItem('api_token')}`, {
            method: 'DELETE'
        });

        if (response.ok) {
            setHeatingEvents(heatingEvents.filter(event => event.heatevent_id !== id));
        } else {
            alert('Error deleting heating event');
        }
    }

    return (
        <StyledHeating>
            <div>
                <h2>Heizung Alte Schule</h2>
                <h3>Schnellzugriff</h3>
                <div className="quick_action">
                    <HeatingSymbol state={active_1} />
                    Proberaum {active_1 === HEATING_STATE.UPCOMING ? '(startet demnächst)' : ''}
                    <button onClick={createManualEvent(1)} disabled={active_1 === HEATING_STATE.ON}>{active_1 === HEATING_STATE.ON ? 'aktiv' : 'An'}</button>
                    <button onClick={() => stopCurrentEvent(1)} disabled={active_1 !== HEATING_STATE.ON}>Aus</button>
                    <HeatingSymbol state={active_2} />
                    Theke {active_2 === HEATING_STATE.UPCOMING ? '(startet demnächst)' : ''}
                    <button onClick={createManualEvent(2)} disabled={active_2 === HEATING_STATE.ON}>{active_2 === HEATING_STATE.ON ? 'aktiv' : 'An'}</button>
                    <button onClick={() => stopCurrentEvent(2)} disabled={active_2 !== HEATING_STATE.ON}>Aus</button>
                    <HeatingSymbol state={active_3} />
                    Lager {active_3 === HEATING_STATE.UPCOMING ? '(startet demnächst)' : ''}
                    <button onClick={createManualEvent(3)} disabled={active_3 === HEATING_STATE.ON}>{active_3 === HEATING_STATE.ON ? 'aktiv' : 'An'}</button>
                    <button onClick={() => stopCurrentEvent(3)} disabled={active_3 !== HEATING_STATE.ON}>Aus</button>
                </div>
                <h3>Aktuelle Termine</h3>
                <ul>
                    {heatingEvents
                    .filter(event => new Date(event.end) > new Date())
                    .map(event => (
                        <li key={event.heatevent_id}>
                            {event.title} - {event.begin} to {event.end} ({rooms[event.room_id]})
                            <button onClick={() => deleteEvent(event.heatevent_id)}>Delete</button>
                        </li>
                    ))}
                </ul>
                <FullCalendar
                    schedulerLicenseKey="CC-Attribution-NonCommercial-NoDerivatives"
                    resources={[
                        { id: '1', title: 'Proberaum' },
                        { id: '2', title: 'Theke' },
                        { id: '3', title: 'Lager' }
                    ]}
                    plugins={[
                        resourceTimeGridPlugin
                    ]}
                    initialView="resourceTimeGridDay"
                    allDaySlot={false}
                    events={heatingEvents.map(event => ({
                        id: event.heatevent_id,
                        title: event.title,
                        start: event.begin,
                        end: event.end,
                        resourceId: event.room_id
                    }))}
                    slotDuration={"01:00:00"}
                    slotMinTime={"10:00:00"}
                    slotMaxTime={"22:00:00"}
                    
                />
            </div>
            <div>
                <h2>Termin hier hinzufügen</h2>
                <form onSubmit={createEvent}>
                    <label>
                        Title:
                        <input type="text" name="title" />
                    </label>
                    <br />
                    <label>
                        Begin:
                        <input type="datetime-local" name="begin" />
                    </label>
                    <br />
                    <label>
                        End:
                        <input type="datetime-local" name="end" />
                    </label>
                    <br />
                    <label>
                        Room ID:
                        <select name="room_id">
                            <option value="1">Proberaum</option>
                            <option value="2">Theke</option>
                            <option value="3">Lager</option>
                        </select>
                    </label>
                    <br />
                    <button type="submit">Add Heating Event</button>
                </form>
            </div>
        </StyledHeating>
    )
}

const HeatingSymbol = ({ state }) => {
    switch (state) {
        case HEATING_STATE.OFF:
            return <div className="heating_symbol off"><IoIosSnow /></div>;
        case HEATING_STATE.UPCOMING:
            return <div className="heating_symbol upcoming"><IoIosFlame /></div>;
        case HEATING_STATE.ON:
            return <div className="heating_symbol on"><IoIosSunny /></div>;
        default:
            return null;
    }
}
