import { useEffect, useState } from "react"
import { getWeather } from "../../data/DBConnect"
import { Confetti } from "../icons/Confetti"
import { Rainfall } from "../icons/Rainfall"
import { Snowfall } from "../icons/Snowfall"

export const Weather = () => {
    const [weather, setWeather] = useState("clear")

    const now = new Date()
    const hour = now.getHours()
    const minute = now.getMinutes()

    useEffect(() => {
        getWeather({Begin: `${hour}:${minute}`, Address: "Rönkhausen", Date: now.toISOString().split('T')[0]})
        .then(data => {
            const weatherMap = {
                0: "clear",
                36: "snow", 37: "snow", 38: "snow", 39: "snow",
                70: "snow", 71: "snow", 72: "snow", 73: "snow", 74: "snow", 75: "snow",
                76: "snow", 77: "snow", 78: "snow", 79: "snow", 85: "snow", 86: "snow",
                50: "rain", 51: "rain", 52: "rain", 53: "rain", 54: "rain", 55: "rain",
                56: "rain", 57: "rain", 58: "rain", 59: "rain", 60: "rain", 61: "rain",
                62: "rain", 63: "rain", 64: "rain", 65: "rain", 66: "rain", 67: "rain",
                68: "rain", 69: "rain", 80: "rain", 81: "rain", 82: "rain", 83: "rain", 84: "rain"
            };
            console.log(data)
            setWeather(weatherMap[data.Weathercode] || "clear");
        })
    })

    if((now.getMonth() === 11 && now.getDate() > 17)){
        return <Snowfall />
    } else if (isCarnivalTime(now)){
        return <Confetti />
    }

    switch(weather){
    default:
    case "clear":
        return <></>
    case "rain":
        return <Rainfall />
    case "snow":
        return <Snowfall />
    }
}

const isCarnivalTime = (date = new Date()) => {
    // computus formula
    const getEasterDate = (year) => {
        const a = year % 19;
        const b = Math.floor(year / 100);
        const c = year % 100;
        const d = Math.floor(b / 4);
        const e = b % 4;
        const f = Math.floor((b + 8) / 25);
        const g = Math.floor((b - f + 1) / 3);
        const h = (19 * a + b - d - g + 15) % 30;
        const i = Math.floor(c / 4);
        const k = c % 4;
        const l = (32 + 2 * e + 2 * i - h - k) % 7;
        const m = Math.floor((a + 11 * h + 22 * l) / 451);
        const month = Math.floor((h + l - 7 * m + 114) / 31);
        const day = ((h + l - 7 * m + 114) % 31) + 1;
        return new Date(year, month - 1, day);
    }

    const year = date.getFullYear();
    const easter = getEasterDate(year);

    const altweiber = new Date(easter);
    altweiber.setDate(easter.getDate() - 52);

    const veilchendienstag = new Date(easter);
    veilchendienstag.setDate(easter.getDate() - 47);

    return date >= altweiber && date <= veilchendienstag;
}
