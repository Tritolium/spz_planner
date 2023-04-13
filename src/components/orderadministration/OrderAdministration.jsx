import { useCallback, useEffect, useState } from "react"
import { BsCalendarDate, BsCalendarDateFill, BsFillPersonFill, BsFillQuestionCircleFill, BsHash } from "react-icons/bs"
import { GiMatterStates } from "react-icons/gi"
import { IoIosResize } from "react-icons/io"
import { TbNote } from "react-icons/tb"
import Button from "../../modules/components/button/Button"
import Filter from "../../modules/components/Filter"
import Form from "../../modules/components/form/Form"
import FormBox from "../../modules/components/form/FormBox"
import { StyledOrderAdministration } from "./OrderAdministration.styled"
import Orders from "./Orders"

const OrderAdministration = () => {

    const options = [
        {value: "own", label: "Eigen"},
        {value: "all", label: "Alle"}
    ]

    let host = (process.env.NODE_ENV !== 'production') ? 'http://localhost' : ''
    let token = localStorage.getItem('api_token')
    let auth_level = localStorage.getItem('auth_level')

    const [orders, setOrders] = useState(new Array(0))
    const [filter, setFilter] = useState(options[0].value)

    const fetchOrders = useCallback(async () => {
        let url = (filter === 'own') ? `${host}/api/order.php?api_token=${token}&own` : `${host}/api/order.php?api_token=${token}`
        fetch(url)
            .then(response => {
                if (!response.ok)
                    throw new Error(response.status)
                return response.json()
            }).then(json => {
                setOrders(json)
            }, () => {
                setOrders(new Array(0))
            }).catch(error => {
                //alert(error.message)
            })
    }, [host, token, filter])

    const onFilterChange = useCallback((e) => {
        setFilter(e.target.value)
    }, [setFilter])

    const reload = useCallback(() => {
        fetchOrders()
    }, [fetchOrders])

    useEffect(() => {
        fetchOrders()
    }, [fetchOrders])

    return(<StyledOrderAdministration>
        {auth_level > 1 ? <Filter options={options} onChange={onFilterChange}/> : <></>}
        {orders.length ? <OrderList orders={orders} reload={reload} own={(filter === 'own')}/> : <></>}
        <OrderForm reload={reload}/>
    </StyledOrderAdministration>)
}

const OrderList = ({ orders, reload, own }) => {
    return(<table>
        <thead id="thead-desktop">
            <tr>
                {!own ? <th>Name</th> : <></>}
                <th>Artikel</th>
                <th>Größe</th>
                <th>Anzahl</th>
                <th>Angefordert am</th>
                <th>Bestellt am</th>
                <th>Notiz</th>
                <th>Status</th>
            </tr>
        </thead>
        <thead id="thead-mobile">
            <tr>
                {!own ? <th><BsFillPersonFill /></th> : <></>}
                <th><BsFillQuestionCircleFill /></th>
                <th><IoIosResize /></th>
                <th><BsHash /></th>
                <th><BsCalendarDate /></th>
                <th><BsCalendarDateFill /></th>
                <th><TbNote /></th>
                <th><GiMatterStates /></th>
            </tr>
        </thead>
        <tbody>
            <Orders orders={orders} reload={reload} own={own}/>
        </tbody>
    </table>)
}

const OrderForm = ({ reload }) => {

    let host = (process.env.NODE_ENV !== 'production') ? 'http://localhost' : ''
    let token = localStorage.getItem('api_token')

    const cancel = (e) => {
        e.preventDefault()
        document.getElementById('order_form').reset()
    }

    const submit = (e) => {
        e.preventDefault()
        let article = document.getElementById('article').value
        let size = document.getElementById('size').value
        let count = document.getElementById('count').value
        let info = document.getElementById('info').value

        fetch(`${host}/api/order.php?api_token=${token}`,
        {
            method: "POST",
            body: JSON.stringify({
                Article: article,
                Size: size,
                Count: count,
                Info: info
            })
        }
        )
        .then(response => {
            if (!response.ok)
                throw new Error(response.status)
            reload()
            alert("Bestellung eingereicht")
            document.getElementById('order_form').reset()
        }).catch(error => {
            alert(error)
        })
    }

    return(<div>
        <Form id="order_form" onsubmit={submit}>
            <FormBox>
                <label htmlFor="article">Was?</label>
                <input type="text" name="article" id="article" />
            </FormBox>
            <FormBox>
                <label htmlFor="size">Größe?</label>
                <input type="text" name="size" id="size" />
            </FormBox>
            <FormBox>
                <label htmlFor="count">Anzahl?</label>
                <input type="number" name="count" id="count" />
            </FormBox>
            <FormBox>
                <label htmlFor="info">Notiz</label>
                <input type="text" name="info" id="info" />
            </FormBox>
            <div>
                <Button onClick={cancel}>Abbrechen</Button>
                <Button onClick={submit}>Anfragen</Button>
            </div>
        </Form>
    </div>)
}

export default OrderAdministration