export const getSQLDateString = (date) => {
    const monthNames = ["Jan", "Feb", "Mär", "Apr", "Mai", "Jun", "Jul", "Aug", "Sep", "Okt", "Nov", "Dez"]

    let year, month, day, splitdate

    if (Object.is(date, null) || Object.is(date, undefined) || date === "" || date === "0000-00-00")
        return ""

    splitdate = date.split('-')

    year = splitdate[0]
    month = splitdate[1]
    day = splitdate[2]

    return `${day}. ${monthNames[parseInt(month)-1]} ${year}`
}

export const getWeeknumber = (date) => {
    let _date = new Date(date);
    
    // calculate the monday of the current week (if _date.getDay() === 0, it is sunday)
    let dayOfWeek = _date.getDay() || 7; // sunday should be 7
    let _week = new Date(_date.getFullYear(), _date.getMonth(), _date.getDate() - dayOfWeek + 1);
    
    // Calculate the difference in days between the current monday and the 1st of January of the year
    let startOfYear = new Date(_week.getFullYear(), 0, 1);
    let daysDiff = Math.floor((_week - startOfYear) / 86400000);
    
    // Calculate the calendar week
    return Math.ceil((daysDiff + startOfYear.getDay() + 1) / 7);
}

export const groupConsecutiveDates = (dates) => {
    // sort the dates
    dates.sort((a, b) => new Date(a) - new Date(b));

    const result = [];
    let tempGroup = [];

    for (let i = 0; i < dates.length; i++) {
        const currentDate = new Date(dates[i]);

        // if the group is empty, add the current date
        if (tempGroup.length === 0) {
            tempGroup.push(dates[i]);
        } else {
            const lastDateInGroup = new Date(tempGroup[tempGroup.length - 1]);

            // check if the current date is the next day after the last date in the group
            const nextDay = new Date(lastDateInGroup);
            nextDay.setDate(lastDateInGroup.getDate() + 1);

            if (currentDate.getTime() === nextDay.getTime()) {
                // if it follows, add it to the group
                tempGroup.push(dates[i]);
            } else {
                // if it doesn't follow, add the current group to the result and start a new group
                result.push([...tempGroup]);
                tempGroup = [dates[i]];
            }
        }
    }

    // Letzte Gruppe hinzufügen, falls sie nicht leer ist
    if (tempGroup.length > 0) {
        result.push(tempGroup);
    }

    return result;
}

export const sqlToString = (sqlDate) => {

    if (sqlDate === null || sqlDate === undefined || sqlDate === "")
        return "---"

    let date = new Date(sqlDate)
    let day = date.getDate()
    let month = date.getMonth() + 1
    let year = date.getFullYear()

    return `${day < 10 ? '0' : ''}${day}.${month < 10 ? '0' : ''}${month}.${year}`
}
