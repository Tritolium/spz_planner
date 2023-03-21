import { StyledOrderAdministration } from "./OrderAdministration.styled"

const OrderAdministration = () => {
    return(<StyledOrderAdministration>
        <OrderList />
        <OrderForm />
    </StyledOrderAdministration>)
}

const OrderList = () => {
    return(<div>
        Artikel, Größe, Anzahl, Angefordert am, Bestellt am, Notiz, Status
    </div>)
}

const OrderForm = () => {
    return(<div>
        Artikel, Größe, Anzahl, Notiz
    </div>)
}

export default OrderAdministration