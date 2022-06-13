const DateField = ({dateprops}) => {
    const date = new Date(dateprops.Date)
    const dayOfWeek = getDayOfWeek(date.getDay())

    const day = date.getDate()
    const month = date.getMonth()
    const year = date.getFullYear()

    return(
        <>{dateprops.Type} {dateprops.Location}<br />{day}. {getMonthString(month)} {year}<br />{dayOfWeek}</>
    )
}

const getDayOfWeek = (d_o_w) => {
    switch(d_o_w){
    default:
        return ""
    case 0:
        return "Sonntag"
    case 1:
        return "Montag"
    case 2:
        return "Dienstag"
    case 3:
        return "Mittwoch"
    case 4:
        return "Donnerstag"
    case 5:
        return "Freitag"
    case 6:
        return "Samstag"
    }
}

const getMonthString = (month) => {
    switch(month){
    default:
        return ""
    case 0:
        return "Januar"
    case 1:
        return "Februar"
    case 2:
        return "März"
    case 3:
        return "April"
    case 4:
        return "Mai"
    case 5:
        return "Juni"
    case 6:
        return "Juli"
    case 7:
        return "August"
    case 8:
        return "September"
    case 9:
        return "Oktober"
    case 10:
        return "November"
    case 11:
        return "Dezember"
    }
}

export default DateField