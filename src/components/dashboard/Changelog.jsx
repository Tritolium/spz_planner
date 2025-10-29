import { Fragment, useState } from "react"
import { StyledChangelog } from "./Dashboard.styled"
import Button from "../../modules/components/button/Button"

import changeData from "./logs.json"

export const Changelog = ({ read, version }) => {
    const [clicked, setClicked] = useState(false)

    let major = version.split(".")[0]
    let minor = version.split(".")[1]

    const onClick = () => {
        setClicked(true)
        localStorage.setItem("changelogRead", version)
    }

    return(
        <StyledChangelog id="changelog">
            {!(read || clicked) ? 
                changeData[major][minor]?.map((change, index) => {
                    return(
                        <ChangelogVersion key={index} change={change} majmin={major + "." + minor}/>
                    )
                })
                : <></>
            }
            {!(read || clicked) ? <Button onClick={onClick}>Änderungen verbergen</Button> : <></>}
        </StyledChangelog>
    )
}

const ChangelogVersion= ({ change, majmin }) => {
    return(
        <div className={"Current"}>
            <h2>{majmin}{change.patch > 0 ? "." + change.patch : ""}</h2>
            <ul>
                {change.entries?.map((entry, index) => {
                    return(
                        <ChangelogEntry key={`${change.version}_${index}`} entry={entry} />
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