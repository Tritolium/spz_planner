import { MdOutlineClose } from "react-icons/md"
import Button from "../../modules/components/button/Button"
import { StyledBlogEntry, StyledEventInfo, StyledOwnBlogEntry } from "./EventInfo.styled"
import { IconContext } from "react-icons"
import { useCallback, useEffect } from "react"
import { useStateWithCallbackLazy } from 'use-state-with-callback'

export const host = (process.env.NODE_ENV !== 'production') ? 'http://localhost' : ''

const EventInfo = ({ hideEventInfo, eventInfoData, fullname }) => {

    const [entries, setEntries] = useStateWithCallbackLazy(Array(0))

    const updateEventInfo = useCallback(() => {
        let token = localStorage.getItem('api_token')
        fetch(`${host}/api/eventinfo.php?api_token=${token}&event_id=${eventInfoData.Event_ID}`).then(
            response => {
                if(response.status === 200){
                    response.json().then(json => {
                        setEntries(json, (oldEntries) => {
                            if(JSON.stringify(oldEntries) !== JSON.stringify(entries)){
                                document.getElementById('chat').scrollTo({top:10000,left:0,behaviour:"smooth"})
                            }
                        })
                    })
                }
            }
        )
    }, [entries, setEntries, eventInfoData])

    const submit = (e) => {
        e.preventDefault()
        let input = document.getElementById("chatinput")
        if(input.value === "")
            return
        let now = new Date()
        let entry = {
            Fullname: fullname,
            Timestamp: `${now.getFullYear()}-${now.getMonth() + 1}-${now.getDate()} ${now.toLocaleTimeString("de-DE")}`,
            Content: input.value
        }

        let token = localStorage.getItem('api_token')
        fetch(`${host}/api/eventinfo.php?api_token=${token}&event_id=${eventInfoData.Event_ID}`, {
            method: "POST",
            body: JSON.stringify({
                Timestamp: `${now.getFullYear()}-${now.getMonth() + 1}-${now.getDate()} ${now.toLocaleTimeString("de-DE")}`,
                Content: input.value
            })
        }).then(response => {
            if(response.status === 201){
                input.value = ""
                setEntries([...entries, entry])
                updateEventInfo()
            }
        }, reason => {
            alert(`Netzwerkfehler ${reason}`)
        })
    }

    useEffect(() => {
        let token = localStorage.getItem('api_token')
        fetch(`${host}/api/eventinfo.php?api_token=${token}&event_id=${eventInfoData.Event_ID}`).then(
            response => {
                if(response.status === 200){
                    response.json().then(json => {
                        setEntries(json, () => {
                            document.getElementById('chat').scrollTo({top:10000,left:0,behaviour:"smooth"})
                        })
                    })
                }
            }
        )
    }, [setEntries, eventInfoData])

    useEffect(() => {
        const interval = setInterval(() => {
            updateEventInfo()
        }, 5000);
        return () => clearInterval(interval);
      }, [updateEventInfo]);

    return(<StyledEventInfo>
        <div id="chatheader">
            {eventInfoData?.Type} {eventInfoData?.Location}
            <IconContext.Provider value={{className: "IconWrapper"}}>
                <MdOutlineClose onClick={hideEventInfo} size="100%"/>
            </IconContext.Provider>
        </div>
        <div id="chat">
            {entries.map(entry => {
                if(entry.Fullname !== fullname)
                    return <BlogEntry key={entry.Timestamp} content={entry.Content} name={entry.Fullname} timestamp={entry.Timestamp}/>
                else
                return <OwnBlogEntry key={entry.Timestamp} content={entry.Content} timestamp={entry.Timestamp}/>
            })}
        </div>
        <form onSubmit={submit}>
            <textarea id="chatinput"/>
            <Button >Senden</Button>
        </form>
    </StyledEventInfo>)
}

const BlogEntry = ({ name, timestamp, content}) => {

    let date = new Date(timestamp)
    const monthNames = ['Jan', 'Feb', 'Mär', 'Apr', 'Mai', 'Jun', 'Jul', 'Aug', 'Sep', 'Okt', 'Nov', 'Dez']

    return(<StyledBlogEntry>
        <div className="content">
            {content}
        </div>
        <div className="tags">
            <div>
                {name}
            </div>
            <div>
                {date.getDate()}. {monthNames[date.getMonth()]} {date.getHours()}:{date.getMinutes()} Uhr
            </div>
        </div>
    </StyledBlogEntry>)
}

const OwnBlogEntry = ({ timestamp, content}) => {

    let date = new Date(timestamp)
    const monthNames = ['Jan', 'Feb', 'Mär', 'Apr', 'Mai', 'Jun', 'Jul', 'Aug', 'Sep', 'Okt', 'Nov', 'Dez']

    return(<StyledOwnBlogEntry>
        <div className="content">
            {content}
        </div>
        <div className="tags">
            <div>
                Ich
            </div>
            <div>
                {date.getDate()}. {monthNames[date.getMonth()]} {date.getHours()}:{date.getMinutes()} Uhr
            </div>
        </div>
    </StyledOwnBlogEntry>)
}

export default EventInfo