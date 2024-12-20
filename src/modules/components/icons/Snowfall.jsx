import { useCallback, useEffect } from "react"
import styled from "styled-components"

export const Snowfall = () => {

    const snowflakeCount = 60

    const changeAnimation = useCallback(() => {
        const snowflakes = document.getElementsByClassName('snowflake')
        for (let i = 0; i < snowflakes.length; i++) {
            snowflakes[i].style.left = `${Math.random() * 100 - 10}%`
            snowflakes[i].style.animationDuration = `${Math.random() * 3 + 4}s`

            // inner
            const inner = snowflakes[i].getElementsByClassName('inner')[0]
            inner.style.animationDuration = `${Math.random() * 5 + 3}s`
            inner.style.animationDelay = `${Math.random() * 7}s`

            // size
            const size = Math.random() * 1.75 + 0.25
            inner.style.fontSize = `${size}em`

            // blur
            inner.style.textShadow = `0 0 1px rgba(255, 255, 255, ${size * 0.5})`
        }
    }, [])

    useEffect(() => {
        changeAnimation()
    }, [changeAnimation])

    return (
        <StyledSnowfall>
            <div className="snowflakes" aria-hidden="true">
                {Array.from({ length: snowflakeCount }).map((_, index) => (
                    <div className="snowflake" key={index}>
                        <div className="inner">{'\u2744'}</div>
                    </div>
                ))}
            </div>
        </StyledSnowfall>
    )
}

const StyledSnowfall = styled.div`
    .snowflake, .snowflake .inner {
        animation-iteration-count: infinite;
        animation-play-state: running;
    }
    
    @keyframes snowflakes-fall {
        0% { transform: translateY(0); }
        100% { transform: translateY(110vh); }
    }
    
    @keyframes snowflakes-shake {
        0%, 100% { transform: translateX(0); }
        50% { transform: translateX(20vw); }
    }
    
    .snowflake {
        position: fixed;
        top: -10%;
        z-index: -1;
        user-select: none;
        cursor: default;
        animation-name: snowflakes-shake;
        animation-timing-function: ease-in-out;
        color: transparent;
        opacity: 0.8;
    }
    
    .snowflake .inner {
        animation-name: snowflakes-fall;
        animation-timing-function: ease-in-out;
    }
`
