/* 
    @param {string} startDateTime yyyy-mm-ddThh:mm:ss.sssZ
    @param {string} endDateTime yyyy-mm-ddThh:mm:ss.sssZ
    @returns {string} upcoming, live, past
*/

const months = [
  "Jan",
  "Feb",
  "Mar",
  "Apr",
  "May",
  "Jun",
  "Jul",
  "Aug",
  "Sep",
  "Oct",
  "Nov",
  "Dec",
];

export const compareDateTime = (startDateTime, endDateTime) => {
  const now = new Date();
  // subtract 5 hours from above time
  const startDate = new Date(startDateTime);
  startDate.setHours(startDate.getHours() - 5);
  // 1. current time is before the given times
  // 2. current time is between the given times
  // 3. current time is after the given times

  // if startDateTime date has passed, only then it is past
  if (
    // now.getTime() > startDate.getTime() ||
    now.getDate() > startDate.getDate() ||
    now.getMonth() > startDate.getMonth() ||
    now.getFullYear() > startDate.getFullYear()
  ) {
    return "past";
  }

  // Check if startDateTime time has started and date is today
  if (now.getDate() === startDate.getDate() && now >= startDate) {
    return "live";
  }

  // Check if exam is the day after startDateTime or more
  else return "upcoming";
};
/* 
    @param {string} dateString yyyy-mm-ddThh:mm:ss.sssZ
    @param {number} duration in minutes
    @returns {object} start and end time in ISOString format that is yyyy-mm-ddThh:mm:ss.sssZ
*/
export const getPaperDateTime = (dateString, duration, objDuration) => {
  if (!dateString) {
    return {
      start: null,
      end: null,
    };
  }

  const startTime = new Date(dateString);
  const endTime = new Date(startTime.getTime() + duration * 60 * 1000);

  return {
    start: startTime.toISOString(),
    end: endTime.toISOString(),
  };
};

/* 
    @param {string} dateString yyyy-mm-ddThh:mm:ss.sssZ
    @returns {string} formattedDateTime dd/mm/yyyy, hh:mm:ss PM
*/
export const convertDateTimeToStrings = (dateString, withDate) => {
  const date = new Date(dateString);
  const timeDiff = date.getTimezoneOffset();
  date.setMinutes(date.getMinutes() + timeDiff);
  const dateOptions = {
    weekday: "short",
    year: "numeric",
    month: "short",
    day: "numeric",
    hour: "2-digit",
    minute: "2-digit",
  };
  const formattedTime = date.toLocaleString("en-US", dateOptions);
  const formattedDate = date.toDateString(
  );
  return withDate ? formattedDate : formattedTime.slice(-8);
};

/* 
    @param {object} paper
    @returns {string} upcoming, live, past
*/
export const getPaperStatus = (paper) => {
  const { start, end } = getPaperDateTime(paper.date, paper.duration);
  return compareDateTime(start, end);
};

/* 
  Gets the remaining time between the current time and the given end time.
  @param {string} endTime - The end time in the format yyyy-mm-ddThh:mm:ss.sssZ.
  @returns {string} The remaining time in the format hh:mm:ss.
*/
export const getRemainingTime = (endTime) => {
  const now = new Date();
  const time = new Date(endTime);
  const now5 = new Date(now.getTime() + 5 * 60 * 60 * 1000);
  const timeDiff = time - now5;

  if (timeDiff < 0) return "00:00:00";

  const hours = Math.floor(timeDiff / (1000 * 60 * 60));
  const minutes = Math.floor((timeDiff / (1000 * 60)) % 60);
  const seconds = Math.floor((timeDiff / 1000) % 60);

  const remainingTime = `${hours.toString().padStart(2, "0")}:${minutes
    .toString()
    .padStart(2, "0")}:${seconds.toString().padStart(2, "0")}`;
  return remainingTime;
};

export const getTimeInFormat = (minutes) => {
  const hours = Math.floor(minutes / 60);
  const mins = minutes % 60;
  const seconds = Math.floor((minutes / 60) % 60);
  return `${hours.toString().padStart(2, "0")}:${mins
    .toString()
    .padStart(2, "0")}:${seconds.toString().padStart(2, "0")}`;
};

export const returnDateInString = (dateString) => {
  const date = new Date(dateString);
  const day = date.getDate();
  const month = date.getMonth();
  const year = date.getFullYear();

  return `${months[month]} ${day.toString().padStart(2, "0")}, ${year
    .toString()
    .padStart(2, "0")}`;
};
