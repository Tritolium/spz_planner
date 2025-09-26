import { useCallback, useEffect, useMemo, useState } from 'react'
import { ImSpinner10 } from 'react-icons/im'
import {
    Canvas,
    CanvasHeader,
    ControlGroup,
    Controls,
    CustomColumnsInput,
    EmptyState,
    FormationControls,
    FormationOption,
    FormationOptions,
    HelperText,
    Label,
    LineupArea,
    LineupRow,
    LoadingState,
    PersonCard,
    PersonMeta,
    PersonName,
    PlannerWrapper,
    Placeholder,
    Pool,
    PoolColumn,
    PoolColumnTitle,
    PoolColumns,
    PoolEmptyText,
    PoolHeader,
    RowGrid,
    RowLabel,
    SectionTitle,
    Select,
    Slot,
    SmallButton,
    StatusTag
} from './LineupPlanner.styled'
import { getAllAttendences, getOwnUsergroups } from '../../modules/data/DBConnect'
import { hasPermission } from '../../modules/helper/Permissions'

const EVENT_CATEGORY = 'event'
const EVENT_STATE = {
    PENDING: 0,
    CONFIRMED: 1,
    DECLINED: 2,
    CANCELED: 3
}

const FORMATION_OPTIONS = [
    { label: '4er-Reihen', value: '4' },
    { label: '5er-Reihen', value: '5' },
    { label: 'Benutzerdefiniert', value: 'custom' }
]

const STATUS_LABELS = {
    confirmed: 'Zusage',
    probable: 'Vermutete Zusage',
    maybe: 'Vielleicht'
}

const formatter = new Intl.DateTimeFormat('de-DE', {
    weekday: 'long',
    day: '2-digit',
    month: 'long',
    year: 'numeric'
})

const sortByName = (a, b) => a.localeCompare(b, 'de', { sensitivity: 'base' })

const LineupPlanner = () => {
    const [usergroups, setUsergroups] = useState([])
    const [selectedUsergroupId, setSelectedUsergroupId] = useState()

    const [events, setEvents] = useState([])
    const [selectedEventId, setSelectedEventId] = useState()

    const [loadingGroups, setLoadingGroups] = useState(true)
    const [loadingEvents, setLoadingEvents] = useState(false)

    const [formationType, setFormationType] = useState('4')
    const [customColumns, setCustomColumns] = useState(6)
    const [rows, setRows] = useState(3)

    const [assignments, setAssignments] = useState({})
    const [unassigned, setUnassigned] = useState([])

    const [activeSlot, setActiveSlot] = useState(null)

    const columns = formationType === 'custom' ? Math.max(1, customColumns) : parseInt(formationType, 10)

    const slotIds = useMemo(() => Array.from({ length: rows * columns }, (_, index) => `slot-${index}`), [rows, columns])

    const sortMemberIds = useCallback((ids, membersById) => {
        const unique = Array.from(new Set(ids.filter(id => membersById[id])))
        return unique.sort((a, b) => sortByName(membersById[a].name, membersById[b].name))
    }, [])

    useEffect(() => {
        let active = true
        const fetchUsergroups = async () => {
            setLoadingGroups(true)
            try {
                const data = await getOwnUsergroups()
                if (!active) return
                const accessible = (data ?? []).filter(group => hasPermission(7, group.Association_ID))
                setUsergroups(accessible)
            } finally {
                if (active) setLoadingGroups(false)
            }
        }
        fetchUsergroups()
        return () => {
            active = false
        }
    }, [])

    useEffect(() => {
        if (usergroups.length === 0) {
            setSelectedUsergroupId(undefined)
            return
        }
        if (!selectedUsergroupId || !usergroups.some(group => group.Usergroup_ID === selectedUsergroupId)) {
            setSelectedUsergroupId(usergroups[0].Usergroup_ID)
        }
    }, [usergroups, selectedUsergroupId])

    useEffect(() => {
        if (!selectedUsergroupId) {
            setEvents([])
            return
        }

        let active = true
        const fetchEvents = async () => {
            setLoadingEvents(true)
            try {
                const data = await getAllAttendences(selectedUsergroupId)
                if (!active) return
                setEvents(data ?? [])
            } finally {
                if (active) setLoadingEvents(false)
            }
        }
        fetchEvents()

        return () => {
            active = false
        }
    }, [selectedUsergroupId])

    const upcomingEvents = useMemo(() => {
        const today = new Date()
        today.setHours(0, 0, 0, 0)

        return events
            .filter(event => event.Category === EVENT_CATEGORY)
            .filter(event => event.State !== EVENT_STATE.CANCELED)
            .filter(event => {
                const eventDate = new Date(event.Date)
                eventDate.setHours(0, 0, 0, 0)
                return eventDate >= today
            })
            .sort((a, b) => new Date(a.Date) - new Date(b.Date))
    }, [events])

    useEffect(() => {
        if (upcomingEvents.length === 0) {
            setSelectedEventId(undefined)
            return
        }

        if (!selectedEventId || !upcomingEvents.some(event => event.Event_ID === selectedEventId)) {
            setSelectedEventId(upcomingEvents[0].Event_ID)
        }
    }, [upcomingEvents, selectedEventId])

    const selectedEvent = useMemo(
        () => upcomingEvents.find(event => event.Event_ID === selectedEventId),
        [upcomingEvents, selectedEventId]
    )

    const members = useMemo(() => {
        if (!selectedEvent) return []

        return (selectedEvent.Attendences ?? [])
            .map(att => ({
                id: att.Member_ID,
                name: att.Fullname,
                instrument: att.Instrument || '',
                attendence: att.Attendence,
                prediction: att.Prediction,
                status: resolveStatus(att)
            }))
            .filter(member => member.status !== null)
            .sort((a, b) => sortByName(a.name, b.name))
    }, [selectedEvent])

    const membersById = useMemo(() => {
        const map = {}
        for (const member of members) {
            map[member.id] = member
        }
        return map
    }, [members])

    useEffect(() => {
        if (!selectedEvent) {
            setAssignments({})
            setUnassigned([])
            return
        }

        const ids = members.map(member => member.id)
        const suggestedRows = Math.max(1, Math.ceil(ids.length / columns))
        setAssignments({})
        setRows(suggestedRows)
        setUnassigned(sortMemberIds(ids, membersById))
    }, [selectedEvent, members, columns, membersById, sortMemberIds])

    useEffect(() => {
        const validSlots = new Set(slotIds)
        const removedMembers = []
        setAssignments(prev => {
            const updated = {}
            Object.entries(prev).forEach(([slotId, memberId]) => {
                if (!memberId) return
                if (validSlots.has(slotId)) {
                    updated[slotId] = memberId
                } else {
                    removedMembers.push(memberId)
                }
            })
            return updated
        })
        if (removedMembers.length > 0) {
            setUnassigned(prev => sortMemberIds([...prev, ...removedMembers], membersById))
        }
    }, [slotIds, membersById, sortMemberIds])

    useEffect(() => {
        const assignedCount = Object.values(assignments).filter(Boolean).length
        const totalSlots = rows * columns
        if (assignedCount > totalSlots) {
            setRows(Math.ceil(assignedCount / columns))
        }
    }, [assignments, rows, columns])

    const poolMembers = useMemo(() => {
        const grouped = {
            confirmed: [],
            probable: [],
            maybe: []
        }
        for (const memberId of unassigned) {
            const member = membersById[memberId]
            if (!member) continue
            grouped[member.status].push(member)
        }
        return grouped
    }, [membersById, unassigned])

    const counts = useMemo(() => {
        const result = {
            confirmed: 0,
            probable: 0,
            maybe: 0
        }
        for (const member of members) {
            result[member.status] += 1
        }
        return result
    }, [members])

    const handleUsergroupChange = useCallback((event) => {
        setSelectedUsergroupId(parseInt(event.target.value, 10))
    }, [])

    const handleEventChange = useCallback((event) => {
        setSelectedEventId(parseInt(event.target.value, 10))
    }, [])

    const handleFormationChange = useCallback((event) => {
        setFormationType(event.target.value)
    }, [])

    const handleCustomColumnsChange = useCallback((event) => {
        const parsed = parseInt(event.target.value, 10)
        if (Number.isNaN(parsed)) {
            setCustomColumns(1)
        } else {
            setCustomColumns(Math.min(Math.max(parsed, 1), 12))
        }
    }, [])

    const handleAddRow = useCallback(() => {
        setRows(prev => prev + 1)
    }, [])

    const handleRemoveRow = useCallback(() => {
        if (rows <= 1) return
        const startIndex = (rows - 1) * columns
        const slotsToRemove = slotIds.slice(startIndex)
        const removed = []
        setAssignments(prev => {
            const updated = { ...prev }
            for (const slotId of slotsToRemove) {
                if (updated[slotId]) {
                    removed.push(updated[slotId])
                }
                delete updated[slotId]
            }
            return updated
        })
        if (removed.length > 0) {
            setUnassigned(prev => sortMemberIds([...prev, ...removed], membersById))
        }
        setRows(prev => prev - 1)
    }, [rows, columns, slotIds, membersById, sortMemberIds])

    const handleClearLineup = useCallback(() => {
        const assignedMembers = Object.values(assignments).filter(Boolean)
        if (assignedMembers.length === 0) return
        setAssignments({})
        setUnassigned(prev => sortMemberIds([...prev, ...assignedMembers], membersById))
    }, [assignments, membersById, sortMemberIds])

    const handleDragStart = useCallback((event, memberId, source) => {
        const payload = JSON.stringify({ memberId, source })
        if (event.dataTransfer) {
            event.dataTransfer.setData('application/json', payload)
            event.dataTransfer.setData('text/plain', payload)
            event.dataTransfer.setDragImage(event.currentTarget, 10, 10)
            event.dataTransfer.effectAllowed = 'move'
        }
    }, [])

    const handleSlotDragStart = useCallback((event, memberId, slotId) => {
        const payload = JSON.stringify({ memberId, source: 'slot', slotId })
        if (event.dataTransfer) {
            event.dataTransfer.setData('application/json', payload)
            event.dataTransfer.setData('text/plain', payload)
            event.dataTransfer.setDragImage(event.currentTarget, 10, 10)
            event.dataTransfer.effectAllowed = 'move'
        }
    }, [])

    const allowDrop = useCallback((event) => {
        event.preventDefault()
        if (event.dataTransfer) {
            event.dataTransfer.dropEffect = 'move'
        }
    }, [])

    const handleSlotDrop = useCallback((event, slotId) => {
        event.preventDefault()
        const payload = event.dataTransfer.getData('application/json') || event.dataTransfer.getData('text/plain')
        if (!payload) return

        try {
            const data = JSON.parse(payload)
            const { memberId, source, slotId: sourceSlot } = data
            if (!membersById[memberId]) return

            setAssignments(prev => {
                const updated = { ...prev }
                const targetMember = updated[slotId]

                if (source === 'slot') {
                    if (sourceSlot === slotId) return prev
                    const currentMember = prev[sourceSlot]
                    if (!currentMember) return prev

                    updated[slotId] = memberId
                    if (targetMember && targetMember !== memberId) {
                        updated[sourceSlot] = targetMember
                    } else {
                        delete updated[sourceSlot]
                    }
                } else {
                    updated[slotId] = memberId
                    setUnassigned(prev => {
                        let next = prev.filter(id => id !== memberId)
                        if (targetMember && targetMember !== memberId) {
                            next = [...next, targetMember]
                        }
                        return sortMemberIds(next, membersById)
                    })
                }

                return updated
            })
        } catch {
            // ignore invalid drops
        } finally {
            setActiveSlot(null)
        }
    }, [membersById, sortMemberIds])

    const handlePoolDrop = useCallback((event) => {
        event.preventDefault()
        const payload = event.dataTransfer.getData('application/json') || event.dataTransfer.getData('text/plain')
        if (!payload) return

        try {
            const data = JSON.parse(payload)
            if (data.source !== 'slot') return
            const memberId = data.memberId
            const slotId = data.slotId
            if (!memberId || !slotId) return

            setAssignments(prev => {
                if (!prev[slotId]) return prev
                const updated = { ...prev }
                delete updated[slotId]
                setUnassigned(existing => sortMemberIds([...existing, memberId], membersById))
                return updated
            })
        } catch {
            // ignore invalid drops
        }
    }, [membersById, sortMemberIds])

    const handleSlotDragEnter = useCallback((event, slotId) => {
        event.preventDefault()
        setActiveSlot(slotId)
    }, [])

    const handleSlotDragLeave = useCallback((event, slotId) => {
        event.preventDefault()
        if (activeSlot === slotId) {
            setActiveSlot(null)
        }
    }, [activeSlot])

    const clearSlot = useCallback((slotId) => {
        setAssignments(prev => {
            if (!prev[slotId]) return prev
            const updated = { ...prev }
            const memberId = updated[slotId]
            delete updated[slotId]
            setUnassigned(prevIds => sortMemberIds([...prevIds, memberId], membersById))
            return updated
        })
    }, [membersById, sortMemberIds])

    if (loadingGroups) {
        return (
            <LoadingState>
                <ImSpinner10 />
                <span>Benutzergruppen werden geladen…</span>
            </LoadingState>
        )
    }

    if (usergroups.length === 0) {
        return (
            <EmptyState>
                <SectionTitle>Aufstellung planen</SectionTitle>
                <p>Für deine Rolle sind keine Gruppen verfügbar, die Aufstellungen unterstützen.</p>
            </EmptyState>
        )
    }

    return (
        <PlannerWrapper>
            <Controls>
                <SectionTitle>Aufstellung planen</SectionTitle>
                <ControlGroup>
                    <Label htmlFor='lineup-usergroup'>Gruppe</Label>
                    <Select id='lineup-usergroup' value={selectedUsergroupId ?? ''} onChange={handleUsergroupChange}>
                        {usergroups.map(group => (
                            <option key={group.Usergroup_ID} value={group.Usergroup_ID}>{group.Title}</option>
                        ))}
                    </Select>
                </ControlGroup>
                <ControlGroup>
                    <Label htmlFor='lineup-event'>Auftritt</Label>
                    {loadingEvents ? (
                        <LoadingState>
                            <ImSpinner10 />
                            <span>Termine werden geladen…</span>
                        </LoadingState>
                    ) : (
                        <Select id='lineup-event' value={selectedEventId ?? ''} onChange={handleEventChange}>
                            {upcomingEvents.map(event => (
                                <option key={event.Event_ID} value={event.Event_ID}>
                                    {`${event.Type} – ${event.Location}`}
                                </option>
                            ))}
                        </Select>
                    )}
                    {upcomingEvents.length === 0 && !loadingEvents && (
                        <HelperText>Es sind aktuell keine zukünftigen Auftritte verfügbar.</HelperText>
                    )}
                </ControlGroup>
                <ControlGroup>
                    <Label>Formation</Label>
                    <FormationOptions>
                        {FORMATION_OPTIONS.map(option => (
                            <FormationOption key={option.value} $active={formationType === option.value}>
                                <input
                                    type='radio'
                                    name='formation'
                                    value={option.value}
                                    checked={formationType === option.value}
                                    onChange={handleFormationChange}
                                />
                                {option.label}
                            </FormationOption>
                        ))}
                        {formationType === 'custom' && (
                            <CustomColumnsInput
                                type='number'
                                min={1}
                                max={12}
                                value={customColumns}
                                onChange={handleCustomColumnsChange}
                            />
                        )}
                    </FormationOptions>
                    <FormationControls>
                        <SmallButton type='button' onClick={handleAddRow}>Reihe hinzufügen</SmallButton>
                        <SmallButton type='button' onClick={handleRemoveRow} disabled={rows <= 1}>Letzte Reihe entfernen</SmallButton>
                        <SmallButton type='button' onClick={handleClearLineup}>Aufstellung leeren</SmallButton>
                    </FormationControls>
                    <HelperText>{columns} Plätze pro Reihe · {rows} Reihen</HelperText>
                </ControlGroup>
                <Pool onDragOver={allowDrop} onDrop={handlePoolDrop}>
                    <PoolHeader>
                        <h3>Verfügbare Personen</h3>
                        <span>{unassigned.length} von {members.length} Personen unplatziert</span>
                    </PoolHeader>
                    <PoolColumns>
                        {Object.entries(poolMembers).map(([status, membersForStatus]) => (
                            <PoolColumn key={status}>
                                <PoolColumnTitle>{STATUS_LABELS[status]} ({counts[status]})</PoolColumnTitle>
                                {membersForStatus.length === 0 ? (
                                    <PoolEmptyText>Keine Personen verfügbar</PoolEmptyText>
                                ) : (
                                    membersForStatus.map(member => (
                                        <PersonCard
                                            key={member.id}
                                            $status={member.status}
                                            draggable
                                            onDragStart={(event) => handleDragStart(event, member.id, 'pool')}
                                        >
                                            <StatusTag $status={member.status}>{STATUS_LABELS[member.status]}</StatusTag>
                                            <PersonName>{member.name}</PersonName>
                                            <PersonMeta>{member.instrument || 'Instrument unbekannt'}</PersonMeta>
                                        </PersonCard>
                                    ))
                                )}
                            </PoolColumn>
                        ))}
                    </PoolColumns>
                    <HelperText>Ziehe Personen auf die gewünschte Position oder zurück in diesen Bereich.</HelperText>
                </Pool>
            </Controls>
            <Canvas>
                <CanvasHeader>
                    <h3>{selectedEvent ? `${selectedEvent.Type} – ${selectedEvent.Location}` : 'Keine Auswahl'}</h3>
                    {selectedEvent && (
                        <span>{formatter.format(new Date(selectedEvent.Date))}</span>
                    )}
                </CanvasHeader>
                {selectedEvent ? (
                    <LineupArea>
                        {Array.from({ length: rows }, (_, rowIndex) => (
                            <LineupRow key={`row-${rowIndex}`}>
                                <RowLabel>Reihe {rowIndex + 1}</RowLabel>
                                <RowGrid $columns={columns}>
                                    {Array.from({ length: columns }, (_, columnIndex) => {
                                        const slotId = slotIds[rowIndex * columns + columnIndex]
                                        const memberId = assignments[slotId]
                                        const member = memberId ? membersById[memberId] : null

                                        return (
                                            <Slot
                                                key={slotId}
                                                onDrop={(event) => handleSlotDrop(event, slotId)}
                                                onDragOver={allowDrop}
                                                onDragEnter={(event) => handleSlotDragEnter(event, slotId)}
                                                onDragLeave={(event) => handleSlotDragLeave(event, slotId)}
                                                data-active={activeSlot === slotId}
                                                onDoubleClick={() => clearSlot(slotId)}
                                            >
                                                {member ? (
                                                    <PersonCard
                                                        $status={member.status}
                                                        draggable
                                                        onDragStart={(event) => handleSlotDragStart(event, member.id, slotId)}
                                                    >
                                                        <StatusTag $status={member.status}>{STATUS_LABELS[member.status]}</StatusTag>
                                                        <PersonName>{member.name}</PersonName>
                                                        <PersonMeta>{member.instrument || 'Instrument unbekannt'}</PersonMeta>
                                                    </PersonCard>
                                                ) : (
                                                    <Placeholder>Platz {columnIndex + 1}</Placeholder>
                                                )}
                                            </Slot>
                                        )
                                    })}
                                </RowGrid>
                            </LineupRow>
                        ))}
                    </LineupArea>
                ) : (
                    <EmptyState>
                        <p>Bitte wähle einen Auftritt aus, um die Aufstellung zu planen.</p>
                    </EmptyState>
                )}
            </Canvas>
        </PlannerWrapper>
    )
}

const resolveStatus = (attendence) => {
    if (attendence.Attendence === 1 || attendence.Attendence === 3) return 'confirmed'
    if (attendence.Attendence === 2) return 'maybe'
    if (attendence.Attendence === -1 && attendence.Prediction === 0) return 'probable'
    return null
}

export default LineupPlanner

