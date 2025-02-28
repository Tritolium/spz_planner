import { useCallback, useEffect } from "react"
import styled from "styled-components"

export const Confetti = () => {

    const confettiCount = 100


    const changeAnimation = useCallback(() => {
        const colors = [
            "red",
            "orange",
            "yellow",
            "green",
            "blue",
            "purple"
        ]

        const confettis = document.getElementsByClassName('confetti')
        for (let i = 0; i < confettis.length; i++) {
            confettis[i].style.left = `${Math.random() * 100 - 10}%`
            confettis[i].style.animationDuration = `${Math.random() * 3 + 4}s`
            confettis[i].style.opacity = Math.random() * 0.5 + 0.5

            // inner
            const inner = confettis[i].getElementsByClassName('inner')[0]

            inner.style.color = colors[Math.floor(Math.random() * colors.length)]

            inner.style.animationDuration = `${Math.random() * 6 + 1}s`
            inner.style.animationDelay = `${Math.random() * 7}s`

            // size
            const size = Math.random() * 1.75 + 0.25
            inner.style.fontSize = `${size}em`
        }
    }, [])

    useEffect(() => {
        changeAnimation()
    }, [changeAnimation])

    return (
        <StyledConfetti>
            <div className="confettis" aria-hidden="true">
                {Array.from({ length: confettiCount }).map((_, index) => (
                    <div className="confetti" key={index}>
                        <div className="inner">&#x1d11e;</div>
                    </div>
                ))}
            </div>
        </StyledConfetti>
    )
}

const StyledConfetti = styled.div`
    .confetti, .confetti .inner {
        animation-iteration-count: infinite;
        animation-play-state: running;
    }
    
    @keyframes confetti-fall {
        0% { transform: translateY(0); }
        100% { transform: translateY(110vh); }
    }
    
    @keyframes confetti-shake {
        0%, 100% { transform: translateX(0); }
        50% { transform: translateX(20vw); }
    }
    
    .confetti {
        position: fixed;
        top: -10%;
        z-index: -1;
        user-select: none;
        cursor: default;
        animation-name: confetti-shake;
        animation-timing-function: ease-in-out;
    }
    
    .confetti .inner {
        animation-name: confetti-fall;
        animation-timing-function: ease-in-out;
    }
`