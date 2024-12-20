import { useCallback, useEffect } from "react"
import styled from "styled-components"

export const Rainfall = () => {

    const raindropCount = 100

    const changeAnimation = useCallback(() => {
        const raindrops = document.getElementsByClassName('raindrop')
        for (let i = 0; i < raindrops.length; i++) {
            raindrops[i].style.left = `${Math.random() * 100}%`

            // inner
            const inner = raindrops[i].getElementsByClassName('inner')[0]
            inner.style.animationDuration = `${Math.random() * 1.5 + 1}s`
            inner.style.animationDelay = `${Math.random() * 7}s`

            // size
            const size = Math.random() * 0.9 + 0.1
            inner.style.fontSize = `${size}em`

            // blur
            inner.style.textShadow = `0 0 1px rgba(255, 255, 255, ${size * 0.4})`
        }
    }, [])

    useEffect(() => {
        changeAnimation()
    }, [changeAnimation])

    return (
        <StyledSnowfall>
            <div className="raindrops" aria-hidden="true">
                {Array.from({ length: raindropCount }).map((_, index) => (
                    <div className="raindrop" key={index}>
                        <div className="inner">&#x1f4a7;</div>
                    </div>
                ))}
            </div>
        </StyledSnowfall>
    )
}

const StyledSnowfall = styled.div`
    .raindrop, .raindrop .inner {
        animation-iteration-count: infinite;
        animation-play-state: running;
    }
    
    @keyframes raindrops-fall {
        0% { transform: translateY(0); }
        100% { transform: translateY(110vh); }
    }
    
    .raindrop {
        position: fixed;
        top: -10%;
        z-index: -1;
        user-select: none;
        cursor: default;
        color: transparent;
    }
    
    .raindrop .inner {
        animation-name: raindrops-fall;
        animation-timing-function: ease-in-out;
    }
`
