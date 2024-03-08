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
