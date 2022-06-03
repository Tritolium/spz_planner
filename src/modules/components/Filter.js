import { useCallback } from "react"

const Filter = (props) => {

    const onChange = useCallback((e) => {
        props.onChange(e)
    }, [props])

    return(
        <select onChange={onChange}>
            {props.options.map((option, index) => {
                return(
                    <option value={option.value} key={index}>{option.label}</option>
                )
            })}
        </select>
    )
}

export default Filter