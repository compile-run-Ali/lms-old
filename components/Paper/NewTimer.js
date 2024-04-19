import React, { useState, useEffect } from "react";


export default function NewTimer({ time, startTime, objTimeLeft }) {

    const [timeLeft, setTimeLeft] = useState(null);
    const [objectiveTimeLeft, setObjectiveTimeLeft] = useState(null);

    // Total time is 3 hours (in seconds)
    const totalTime = 3 * 60 * 60;
    // Create a new Date object for the start time
    const start = new Date();
    const [hours, minutes] = startTime.split(":");
    // console.log("hours: ", hours)
    // console.log("minutes: ", minutes)
    start.setHours(hours, minutes, '00');
    // console.log("start: ", start)

    useEffect(() => {

        // time is in seconds convert that to hours mins and seconds
        const hours = Math.floor(time / 3600);
        const minutes = Math.floor((time % 3600) / 60);
        const seconds = Math.floor((time % 3600) % 60);
        // console.log("seconds norml: ", seconds)        

        const objHhours = Math.floor(objTimeLeft / 3600);
        const objMinutes = Math.floor((objTimeLeft % 3600) / 60);
        const objSeconds = Math.floor((objTimeLeft % 3600) % 60);

        
        const now = new Date()
        // Calculate the time difference in milliseconds
        const diff = now - start
        // Convert the time difference to seconds
        const diffInSeconds = Math.floor(diff / 1000);
        // Time left is total time minus the time difference
        const timeLeftInSeconds = totalTime - diffInSeconds;

        // Convert the time difference to hours, minutes, and seconds
        const new_hours = Math.floor(timeLeftInSeconds / 3600);
        const new_minutes = Math.floor((timeLeftInSeconds % 3600) / 60);
        const new_seconds = Math.floor((timeLeftInSeconds % 3600) % 60);
        // console.log("new_seconds: ", new_seconds)

        // // set time formatted and padded
        // setTimeLeft(
        //     `${hours.toString().padStart(2, "0")}:${minutes
        //         .toString()
        //         .padStart(2, "0")}:${seconds.toString().padStart(2, "0")}`
        // );

        // set time formatted and padded
        setTimeLeft(
            `${new_hours.toString().padStart(2, "0")}:${new_minutes
                .toString()
                .padStart(2, "0")}:${new_seconds.toString().padStart(2, "0")}`
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
