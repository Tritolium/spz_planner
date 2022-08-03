export const mockDB = {
    events: [
        {
            Event_ID: 1,
            Type: "Freundschaftstreffen",
            Location: "Oelinghauserheide",
            Date: "2022-05-14",
            Begin: "14:30:00",
            Departure: "14:00:00",
            Leave_dep: "12:34:56",
            Accepted: 1
        },
        {
            Event_ID: 2,
            Type: "Schützenfest",
            Location: "Ennest",
            Date: "2022-07-17",
            Begin: "12:34:56",
            Departure: "12:34:56",
            Leave_dep: "12:34:56",
            Accepted: 0
        }
    ],
    members: [
        {
            Member_ID: 1,
            Forename: "Max",
            Surname: "Mustermann",
            Auth_level: 0
        },
        {
            Member_ID: 2,
            Forename: "Erika",
            Surname: "Musterfrau",
            Auth_level: 1
        },
        {
            Member_ID: 3,
            Forename: "Otto",
            Surname: "Normalverbraucher",
            Auth_level: 2
        },{
            Member_ID: 4,
            Forename: "Lieschen",
            Surname: "Müller",
            Auth_level: 3
        }
    ],
    attendences: [
        {
            Attendence: 0,
            Event_ID: 4,
            Type: "Tag der offenen Tür",
            Location: "OGS Rönkhausen",
            Date: "2022-06-15"
        },
        {
            Attendence: 1,
            Event_ID: 5,
            Type: "Heimspiel",
            Location: "Rönksen!",
            Date: "2022-07-02"
        },
        {
            Attendence: 2,
            Event_ID: 3,
            Type: "Schützenfest",
            Location: "Endorf",
            Date: "2022-07-10"
        },
        {
            Attendence: 0,
            Event_ID: 4,
            Type: "Tag der offenen Tür",
            Location: "OGS Rönkhausen",
            Date: "2022-06-15"
        },
        {
            Attendence: 1,
            Event_ID: 5,
            Type: "Heimspiel",
            Location: "Rönksen!",
            Date: "2022-07-02"
        },
        {
            Attendence: 2,
            Event_ID: 3,
            Type: "Schützenfest",
            Location: "Endorf",
            Date: "2022-07-10"
        }
    ],
    allAttendences: [
        {
            Type: "Schützenfest",
            Location: "Dingenskirchen",
            Date: "2022-08-25",
            Attendences: [
                {
                    Fullname: "Max Mustermann",
                    Attendence: -1
                },
                {
                    Fullname: "Madita Mustermann",
                    Attendence: 0
                },
                {
                    Fullname: "Madita Mustermann",
                    Attendence: 0
                },
                {
                    Fullname: "Madita Mustermann",
                    Attendence: 0
                },
                {
                    Fullname: "Madita Mustermann",
                    Attendence: 0
                },
                {
                    Fullname: "Madita Mustermann",
                    Attendence: 0
                },
                {
                    Fullname: "Madita Mustermann",
                    Attendence: 0
                },
                {
                    Fullname: "Madita Mustermann",
                    Attendence: 0
                },
                {
                    Fullname: "Madita Mustermann",
                    Attendence: 0
                },
                {
                    Fullname: "Madita Mustermann",
                    Attendence: 0
                },
                {
                    Fullname: "Madita Mustermann",
                    Attendence: 0
                },
                {
                    Fullname: "Madita Mustermann",
                    Attendence: 0
                },
                {
                    Fullname: "Madita Mustermann",
                    Attendence: 0
                },
                {
                    Fullname: "Madita Mustermann",
                    Attendence: 0
                },
                {
                    Fullname: "Madita Mustermann",
                    Attendence: 0
                },
                {
                    Fullname: "Madita Mustermann",
                    Attendence: 0
                },
                {
                    Fullname: "Madita Mustermann",
                    Attendence: 0
                },
                {
                    Fullname: "Madita Mustermann",
                    Attendence: 0
                },
                {
                    Fullname: "Madita Mustermann",
                    Attendence: 0
                },
                {
                    Fullname: "Madita Mustermann",
                    Attendence: 0
                },
                {
                    Fullname: "Madita Mustermann",
                    Attendence: 0
                },
                {
                    Fullname: "Madita Mustermann",
                    Attendence: 0
                },
                {
                    Fullname: "Madita Mustermann",
                    Attendence: 0
                },
                {
                    Fullname: "Madita Mustermann",
                    Attendence: 0
                },
                {
                    Fullname: "Madita Mustermann",
                    Attendence: 0
                },
                {
                    Fullname: "Tobi Mustermann",
                    Attendence: 1
                }
            ]
        }
    ],
    evaluation: [
        {
            Event_ID: 1,
            Type: "Schützenfest",
            Location: "Lenhausen",
            Date: "2022-08-06",
            Consent: "26",
            Refusal: "12",
            Maybe: "2",
            Missing: "0"
        }
    ],
    absenceOwn: [
        {
            from: '2022-05-10',
            until: '2022-12-31',
            info: 'Information'
        }
    ],
    absences: [
        {
            Member_ID: 1,
            Absences: [
                {
                    from: '2022-05-10',
                    until: '2022-12-31',
                    info: 'Information'
                },
                {
                    from: '2022-05-15',
                    until: '2022-12-31',
                    info: 'Information'
                }
            ]
        }
    ]
}