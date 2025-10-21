import styled from 'styled-components';
import svg_arm from '../../../icons/arm.svg';
import svg_santa from '../../../icons/rumpf.svg';

const PIVOT_X = 55;
const PIVOT_Y = 60;

export const Advent = ({ className = "", theme, open }) => {

    const adventCount = () => {
        // Calculate how many advent candles should be lit based on the current date
        // Advent Sundays are the four Sundays before Christmas, fifth candle for Sunday after Christmas
        // If 24th Dec is Sunday, thats the 4th Advent
        const now = new Date(); // For testing, replace with new Date() for current date
        const year = now.getFullYear();
        const christmas_eve = new Date(year, 11, 24); // December is month 11
        const day_of_week = christmas_eve.getDay(); // 0 (Sun) to 6 (Sat)

        if (day_of_week === 0) {
            // 24th Dec is Sunday, 4th Advent
            if (now >= new Date(year, 11, 22)) return 4;
            if (now >= new Date(year, 11, 15)) return 3;
            if (now >= new Date(year, 11, 8)) return 2;
            if (now >= new Date(year, 11, 1)) return 1;
            return 0;
        } else {
            // Calculate the date of the fourth Advent Sunday
            const days_to_sunday = (7 - day_of_week) % 7;
            const fourth_advent = new Date(year, 11, 24 - days_to_sunday);
            const third_advent = new Date(fourth_advent);
            third_advent.setDate(fourth_advent.getDate() - 7);
            const second_advent = new Date(third_advent);
            second_advent.setDate(third_advent.getDate() - 7);
            const first_advent = new Date(second_advent);
            first_advent.setDate(second_advent.getDate() - 7);

            // For fun, add fifth advent candle for the Sunday after Christmas
            const fifth_advent = new Date(fourth_advent);
            fifth_advent.setDate(fourth_advent.getDate() + 7);

            // To show the candles one week ahead, add zeroth advent
            const zeroth_advent = new Date(first_advent);
            zeroth_advent.setDate(first_advent.getDate() - 7);

            // Add 1 day to each Advent Sunday to ensure correct calculation
            const nextDay = date => {
                const d = new Date(date);
                d.setDate(d.getDate() + 1);
                return d;
            };

            if (now >= nextDay(fifth_advent)) return 5;
            if (now >= nextDay(fourth_advent)) return 4;
            if (now >= nextDay(third_advent)) return 3;
            if (now >= nextDay(second_advent)) return 2;
            if (now >= nextDay(first_advent)) return 1;
            if (now >= nextDay(zeroth_advent)) return 0;
            return -1; // Before advent period
        }
    }

    return (<>
        <Santa visible={adventCount() >= 0} />
        <Candle className='first' lit={adventCount() >= 1} visible={adventCount() >= 0} />
        <Candle className='second' lit={adventCount() >= 2} visible={adventCount() >= 0} />
        <Candle className='third' lit={adventCount() >= 3} visible={adventCount() >= 0} />
        <Candle className='fourth' lit={adventCount() >= 4} visible={adventCount() >= 0} />
        <Candle className='fifth' lit={adventCount() >= 5} visible={adventCount() >= 4} />
    </>);
}

const Santa = ({ className = "", theme, open, visible = false }) => {
    if (!visible) return null;
    return (
        <StyledSanta
            className={`SantaIcon ${className}`}
            xmlns="http://www.w3.org/2000/svg"
            viewBox="0 0 200 400"
            data-pivot-x={PIVOT_X}
            data-pivot-y={PIVOT_Y}
            data-open={open}
        >
            {/* Pivot-Gruppe legt die Rotationsachse fest */}
            <g className="pivot">
                <g className="arm top">
                    <image href={svg_arm} x="-20" y="-10" />
                </g>
            </g>

            <image href={svg_santa} x="0" y="0" height="100%" className="body" />

            <g className="pivot">
                <g className="arm bottom" style={{ animationDirection: 'reverse' }}>
                    <image href={svg_arm} x="-20" y="-10" />
                </g>
            </g>
        </StyledSanta>
    );
};

export const Candle = ({ className = "", style = {}, lit = false, visible = false }) => {
    if (!visible) return null;
    return (
        <StyledCandle
            className={`CandleIcon ${className}`}
            style={style}
            xmlns="http://www.w3.org/2000/svg"
            viewBox="0 0 40 100"
            width="2rem"
            height="5rem"
        >
            {/* Kerzenkörper */}
            <rect x="15" y="35" width="10" height="50" rx="4" fill="#fffbe6" stroke="#e0cfa9" strokeWidth="2" />
            {/* Docht */}
            <rect x="19" y="30" width="2" height="8" rx="1" fill="#333" />
            {/* Flamme nur wenn lit=true */}
            {lit && (
                <g>
                    <ellipse
                        className="flame"
                        cx="20"
                        cy="28"
                        rx="4"
                        ry="8"
                        fill="url(#flameGradient)"
                    >
                        <animate
                            attributeName="ry"
                            values="8;10;8;7;8"
                            dur="1.2s"
                            repeatCount="indefinite"
                        />
                        <animate
                            attributeName="cx"
                            values="20;21;19;20"
                            dur="1.2s"
                            repeatCount="indefinite"
                        />
                    </ellipse>
                    <ellipse
                        cx="20"
                        cy="32"
                        rx="1.2"
                        ry="2.5"
                        fill="#fffbe6"
                        opacity="0.7"
                    />
                    <defs>
                        <radialGradient id="flameGradient" cx="50%" cy="60%" r="60%">
                            <stop offset="0%" stopColor="#fffbe6" />
                            <stop offset="60%" stopColor="#ffd966" />
                            <stop offset="100%" stopColor="#ff9900" />
                        </radialGradient>
                    </defs>
                </g>
            )}
        </StyledCandle>
    );
};

const StyledCandle = styled.svg`
    position: fixed;
    top: 1rem;
    left: 6rem;
    height: 3rem;

    &.second {
        left: 6.5rem;
    }

    &.third {
        left: 7rem;
    }

    &.fourth {
        left: 7.5rem;
    }

    &.fifth {
        left: 8rem;
    }
`;

const StyledSanta = styled.svg`
    position: fixed;
    top: 0;
    left: 3rem;
    width: 4rem;
    height: 4rem;
    z-index: 1000;
    pointer-events: none;

    .body {
        width: 100%;
        height: 100%;
    }

    .arm image {
        width: 35%;
        height: 35%;
    }

    .arm {
        transform-origin: 0 0;
        transform-box: fill-box;
        animation: wave 2s linear infinite;
    }

    .pivot {
        transform: translate(${PIVOT_X}%, ${PIVOT_Y}%);
    }

    @keyframes wave {
        0%   { transform: rotate(-90deg); }
        25%  { transform: rotate(-105deg); }
        50%  { transform: rotate(-90deg); }
        75%  { transform: rotate(-75deg); }
        100% { transform: rotate(-90deg); }
    }

    &[data-open="true"] {
        transform: scaleX(-1);
        transition: transform 1s ease-in-out;
    }
`;
