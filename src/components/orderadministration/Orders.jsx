import { BsFillCheckCircleFill } from 'react-icons/bs'
import { MdPendingActions } from 'react-icons/md'
import { TbTruckDelivery } from 'react-icons/tb'
import Button from '../../modules/components/button/Button'
import { host } from '../../modules/data/DBConnect'

const Orders = ({ orders, reload, own }) => {

    let auth_level = localStorage.getItem('auth_level')

    return(orders.map(order => {
            return(<tr key={`order_${order.Order_ID}`}>
                {!own ? <td>{order.Forename} {order.Surname[0]}.</td> : <></>}
                <td>{order.Article}</td>
                <td>{order.Size}</td>
                <td>{order.Count}</td>
                <td>{order.Placed}</td>
                <td>{order.Ordered}</td>
                <td>{order.Info}</td>
                <td><OrderState state={order.Order_State}/></td>
                {auth_level > 1 ? <UpdateOrder order={order} reload={reload}/> : <></>}
            </tr>)
        })
    )
}

const OrderState = ({ state }) => {
    switch(state){
    default:
    case 0:
        return <MdPendingActions />
    case 1:
        return <TbTruckDelivery />
    case 2:
        return <BsFillCheckCircleFill />
    }
}

const UpdateOrder = ({ order, reload }) => {

    const update = async () => {
        let token = localStorage.getItem('api_token')
        await fetch(`${host}/api/order.php?api_token=${token}&id=${order.Order_ID}`,
        {
            method: 'PUT',
            body: JSON.stringify({
                Order_State: order.Order_State
            })
        })
        reload()
    }

    const deleteOrder = async () => {
        let token = localStorage.getItem('api_token')
        await fetch(`${host}/api/order.php?api_token=${token}&id=${order.Order_ID}`,
        {
            method: 'DELETE'
        })
        reload()
    }

    switch(order.Order_State){
    case 0:
        return(<td><Button onClick={update}>bestellt?</Button><br/><Button onClick={deleteOrder}>stornieren</Button></td>)
    case 1:
        return(<td><Button onClick={update}>geliefert?</Button></td>)
    default:
        return(<></>)
    }
}

export default Orders