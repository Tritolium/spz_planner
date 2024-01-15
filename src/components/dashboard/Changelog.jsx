import { Fragment, useState } from "react"
import { StyledChangelog } from "./Dashboard.styled"
import Button from "../../modules/components/button/Button"

import changeData from "./logs.json"

export const Changelog = ({ read, version }) => {
    const [clicked, setClicked] = useState(false)

    const onClick = () => {
        setClicked(true)
        localStorage.setItem("changelogRead", version)
    }

    return(
        <StyledChangelog id="changelog">
            {!(read || clicked) ? 
                changeData.map((change, index) => {
                    const major = change.version.split(".")[0] === version.split(".")[0]
                    const ispatch = change.version.split(".")[1] === version.split(".")[1]
                    return (
                        <ChangelogVersion key={`changelog_${index}`} change={change} ispatch={ispatch && major} />
                    )
                })
                : <></>
            }
            {!(read || clicked) ? <Button onClick={onClick}>Änderungen verbergen</Button> : <></>}
        </StyledChangelog>
    )
}

const ChangelogVersion= ({ change, ispatch }) => {    
    return(
        <div className={ispatch ? "Current" : "Previous"}>
            <h2>{change.version}</h2>
            <ul>
                {change.entries?.map((entry, index) => {
                    return(
                        <ChangelogEntry key={`${change.version}_${index}`}entry={entry} />
                    )
                })}
            </ul>
        </div>
    )
}

const ChangelogEntry = ({ entry }) => {
    return(
        <li>
            <h3>{entry.page}</h3>
            {entry.changes?.map((change, index) => {
                return(<Fragment key={index}>
                    {index !== 0 ? <br /> : <></>}
                    <span key={index}>{change}</span>
                </Fragment>
                )
            })}
        </li>
    )
}