const DateField = ({dateprops}) => {
    return(
        <>{dateprops.Type} {dateprops.Location}<br />{dateprops.Date}<br />{dateprops.Day_of_Week}</>
    )
}

export default DateField