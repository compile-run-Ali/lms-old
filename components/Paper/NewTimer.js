import React, { useState, useEffect } from "react";


export default function NewTimer({ time, startTime, objTimeLeft }) {

    const [timeLeft, setTimeLeft] = useState(null);
    const [objectiveTimeLeft, setObjectiveTimeLeft] = useState(null);
    
    useEffect(() => {

        // time is in seconds convert that to hours mins and seconds
        const hours = Math.floor(time / 3600);
        const minutes = Math.floor((time % 3600) / 60);
        const seconds = Math.floor((time % 3600) % 60);

        const objHhours = Math.floor(objTimeLeft / 3600);
        const objMinutes = Math.floor((objTimeLeft % 3600) / 60);
        const objSeconds = Math.floor((objTimeLeft % 3600) % 60);

        // set time formatted and padded
        setTimeLeft(
            `${hours.toString().padStart(2, "0")}:${minutes
                .toString()
                .padStart(2, "0")}:${seconds.toString().padStart(2, "0")}`
        );

        setObjectiveTimeLeft(
            `${objHhours.toString().padStart(2, "0")}:${objMinutes
                .toString()
                .padStart(2, "0")}:${objSeconds.toString().padStart(2, "0")}`
        );

    }, [time,objTimeLeft]);
    return (
        <div className="flex flex-col justify-center text-lg">
            <div>
                Start Time:
                {" " + startTime}
            </div>
            {objTimeLeft &&
                <div>Time Left:{" " + objectiveTimeLeft}</div>
            }
            {!objTimeLeft &&
                <div>Time Left:{" " + timeLeft}</div>
            }
        </div>
    );
}
