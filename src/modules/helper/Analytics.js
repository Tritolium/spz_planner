import { getItem, setItem } from "./IndexedDB"

export const buttonPressed = (button_id) => {
    getItem('button_analytics')
        .then((data) => {
            if(data === undefined)
                data = {}
            if(data[button_id] === undefined)
                data[button_id] = 0
            data[button_id]++
            return data
        })
        .then((data) => {
            setItem('button_analytics', data)
        })
}