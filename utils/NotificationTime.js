export const getNotificationTime =(dateInString) => {
    // date is in format   "2021-05-20T18:30:00.000Z"
    const date = new Date(dateInString);

    const dateNow = new Date();

    const timeDiff = dateNow.getTime() - date.getTime();
    
    const timeDiffInMinutes = timeDiff / (1000 * 60);

    const timeDiffInHours = timeDiffInMinutes / 60;

    if (timeDiffInHours > 24) {
        return Math.floor(timeDiffInHours / 24) + "d";
    }
    else if (timeDiffInHours > 1) {
        return Math.floor(timeDiffInHours) + "h";
    } else {
        return Math.floor(timeDiffInMinutes) + "m";
    }
}
    