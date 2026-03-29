import dayjs from "dayjs";
import advancedFormat from "dayjs/plugin/advancedFormat";
import "dayjs/locale/en"; // make sure English locale is loaded
import isSameOrAfter from "dayjs/plugin/isSameOrAfter";

dayjs.extend(isSameOrAfter);
dayjs.extend(advancedFormat);
dayjs.locale("en"); // set English locale

// Format a date
export function formatDate(date, format = "DD MMM, YYYY") {
  return dayjs(date).format(format);
}

// Get today's date
export function today(format = "YYYY-MM-DD") {
  return dayjs().format(format);
}

export function joinDateTime(date, time) {
  const [hours, minutes, seconds] = time.split(":").map(Number);

  // create local datetime
  const localDateTime = dayjs(date)
    .set("hour", hours)
    .set("minute", minutes)
    .set("second", seconds);

  // Return as ISO string with local offset
  return localDateTime.format();
}

export function formatDateRange(startDate, endDate) {
  const start = dayjs(startDate);
  const end = dayjs(endDate);

  const startDay = start.format("Do"); // Correctly gives "5th"
  const endDay = end.format("Do"); // Correctly gives "9th"
  const month = end.format("MMM"); // "Sep"

  return `${startDay} - ${endDay} ${month}`;
}

export function getDaysDifference(startDate, endDate) {
  const start = dayjs(startDate);
  const end = dayjs(endDate);

  // difference in days
  const diff = end.diff(start, "day") + 1; // +1 if you want to include both start & end
  return `${diff} day${diff > 1 ? "s" : ""}`;
}

// get out time
export const formatTo12Hour = (time24) => {
  if (!time24) return "";
  return dayjs(`1970-01-01 ${time24}`, "YYYY-MM-DD HH:mm:ss").format("h:mm A");
};

// Get the hour (24-hour format)
export function getHour(date) {
  return dayjs(date).hour(); // 0 - 23
}

// Get the hour in 12-hour format with AM/PM
export function getHour12(date) {
  return dayjs(date).format("h A"); // e.g., "3 PM"
}

// Get minutes (0 - 59)
export function getMinutes(date) {
  return dayjs(date).minute();
}

// ******************************************************
/**
 * Checks if endDate is same or after startDate
 * @param startDate - string or Date
 * @param endDate - string or Date
 * @returns true if valid, otherwise false
 */
export const isValidEndDate = (startDate, endDate) => {
  if (!startDate || !endDate) return true;
  return dayjs(endDate).isSameOrAfter(dayjs(startDate), "day");
};

/**
 * Checks if endTime is after startTime when dates are same
 * @param startDate - string or Date
 * @param endDate - string or Date
 * @param startTime - string (HH:mm:ss)
 * @param endTime - string (HH:mm:ss)
 * @returns true if valid, otherwise false
 */

export const isValidEndTime = (startDate, endDate, startTime, endTime) => {
  if (!startDate || !endDate || !startTime || !endTime) return true;

  // Only check if start and end are on the same day
  if (dayjs(startDate).isSame(endDate, "day")) {
    // Use joinDateTime to create proper datetime objects
    const start = dayjs(joinDateTime(startDate, startTime));
    const end = dayjs(joinDateTime(endDate, endTime));

    return end.isAfter(start); // strictly after
  }

  return true; // different days always valid
};
