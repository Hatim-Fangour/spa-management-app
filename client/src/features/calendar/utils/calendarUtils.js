import { differenceInDays, parse } from "date-fns";
import dayjs from "dayjs";
import moment from "moment";
import { momentLocalizer } from "react-big-calendar";

export const localizer = momentLocalizer(moment);

export const appointmnetType = ["Service", "Time Off", "Reminder"];
export const THERAPIST_ROLE_ID = 159;

export const initNewAppointmentData = {
  concerned: "",
  reason: "",
  note: "",

  type: "Service",
  interval: {
    allDay: false,
    start: {
      date: dayjs().format("DD/MM/YYYY"),
      // time: { from: "", to: "" }
      time: "",
    },
    end: {
      date: dayjs().format("DD/MM/YYYY"),
      time: "",
    },
  },
};

export const initTimeSlots = [
  "00:00",
  "00:15",
  "00:30",
  "00:45",
  "01:00",
  "01:15",
  "01:30",
  "01:45",
  "02:00",
  "02:15",
  "02:30",
  "02:45",
  "03:00",
  "03:15",
  "03:30",
  "03:45",
  "04:00",
  "04:15",
  "04:30",
  "04:45",
  "05:00",
  "05:15",
  "05:30",
  "05:45",
  "06:00",
  "06:15",
  "06:30",
  "06:45",
  "07:00",
  "07:15",
  "07:30",
  "07:45",
  "08:00",
  "08:15",
  "08:30",
  "08:45",
  "09:00",
  "09:15",
  "09:30",
  "09:45",
  "10:00",
  "10:15",
  "10:30",
  "10:45",
  "11:00",
  "11:15",
  "11:30",
  "11:45",
  "12:00",
  "12:15",
  "12:30",
  "12:45",
  "13:00",
  "13:15",
  "13:30",
  "13:45",
  "14:00",
  "14:15",
  "14:30",
  "14:45",
  "15:00",
  "15:15",
  "15:30",
  "15:45",
  "16:00",
  "16:15",
  "16:30",
  "16:45",
  "17:00",
  "17:15",
  "17:30",
  "17:45",
  "18:00",
  "18:15",
  "18:30",
  "18:45",
  "19:00",
  "19:15",
  "19:30",
  "19:45",
  "20:00",
  "20:15",
  "20:30",
  "20:45",
  "21:00",
  "21:15",
  "21:30",
  "21:45",
  "22:00",
  "22:15",
  "22:30",
  "22:45",
  "23:00",
];

export const eventPropGetter = (event) => {
  return {
    ...(event.type === "Service" && {
      className: "serviceEvent",
    }),
    ...(event.type === "Reminder" && {
      className: "reminderEvent",
    }),
    ...(event.type === "Time Off" && {
      className: "timeOffEvent",
    }),
  };
};

export const formats = {
  timeGutterFormat: "HH:mm", // 24-hour format for the time gutter
  eventTimeRangeFormat: ({ start, end }, culture, localizer) =>
    `${localizer.format(start, "HH:mm", culture)} - ${localizer.format(
      end,
      "HH:mm",
      culture
    )}`, // 24-hour format for event time ranges
};

export const isToday = (dateString) => {
  const today = new Date(); // Get today's date
  const [day, month, year] = dateString.split("/"); // Split the date string into day, month, year

  // Create a Date object for the event date
  const eventDate = new Date(`${year}-${month}-${day}`);

  return (
    eventDate.getDate() === today.getDate() &&
    eventDate.getMonth() === today.getMonth() &&
    eventDate.getFullYear() === today.getFullYear()
  );
};

export const calculateDurationInDays = (startDate, endDate) => {
  const start = parse(startDate, "dd/MM/yyyy", new Date());
  const end = parse(endDate, "dd/MM/yyyy", new Date());

  // Calculate the difference in milliseconds

  return differenceInDays(end, start);
};

export const formatedTodayDate = () => {
  const today = new Date();

  // Get the month name (e.g., "December")
  const month = today.toLocaleString("default", { month: "long" });

  // Get the day of the month (e.g., 22)
  const day = today.getDate();

  // Get the weekday name (e.g., "Sunday")
  const weekday = today.toLocaleString("default", { weekday: "long" });

  // Combine into the desired format
  return `${month} ${day}, ${weekday}`;
};

// Function to calculate duration in minutes
export const calculateDuration = (from, to, allDay) => {
  // Parse the timestamps into Date objects

  const date1 = new Date(from);
  const date2 = new Date(to);

  // Convert milliseconds to hours and minutes
  const diffInMinutes = (date2 - date1) / (1000 * 60);
  const hours = Math.floor(diffInMinutes / 60);
  const minutes = Math.floor(diffInMinutes % 60);

  // Format the duration as "Xh Ymin"
  const formattedDuration = `
    ${
      hours > 0
        ? `${minutes > 0 ? `${hours}h  ${minutes}min` : `${hours}h`}`
        : `${minutes}min`
    }`;

  if (allDay) {
    return "All Day";
  }
  return formattedDuration;
};

export const getDaysRemaining = (endDate) => {
  const today = new Date();
  const end = parse(endDate, "dd/MM/yyyy", new Date());
  return Math.max(0, differenceInDays(end, today)); // Handles negative values
};

export // To add 15 minutes to a Date object (startDate)
const add15MinutesToDate = (date) => {
  const newDate = new Date(date);

  newDate.setMinutes(newDate.getMinutes() + 15);
  return newDate;
};

export const parseDateTime = (dateStr, timeStr, appointmentType) => {
  const [day, month, year] = dateStr.split("/").map(Number); // Split and convert to numbers

  if (appointmentType === "Time Off") {
    timeStr = "00:00";
    const [hours, minutes] = timeStr.split(":").map(Number); // Split and convert to numbers
    return new Date(year, month - 1, day, hours, minutes);
  }
  // JavaScript months are 0-indexed (0 = January, 1 = February, etc.)
  else {
    const [hours, minutes] = timeStr.split(":").map(Number); // Split and convert to numbers
    return new Date(year, month - 1, day, hours, minutes);
  }
};

export const getTitleByService = (appointment, concerned, isEditMode) => {
  let eventTitle = "";

  if (appointment.type === "Service") {
    eventTitle = `${concerned.fullName} - ${appointment?.reason?.name} / ${appointment?.room}`;
  }
  if (appointment.type === "Time Off") {
    eventTitle = isEditMode
      ? `${`${concerned.fullName}`} - ${appointment?.reason?.name}`
      : `${`${concerned.details.firstName} ${concerned.details.lastName}`} - ${
          appointment?.reason?.name
        }`;
  }
  if (appointment.type === "Reminder") {
    eventTitle = "Reminder";
  }
  return eventTitle;
};

export const getEventColor = (type) => {
  switch (type?.toLowerCase()) {
    case "service":
      return "#5eb0f8"; // or 'after:bg-blue-500' for pseudo-elements
    case "time off":
      return "#da3a00";
    case "reminder":
      return "#fffb00";
    default:
      return "#0987654"; // default color
  }
};

export const generateTimeSlots = (startTime, endTime) => {
  let times = [];
  let current = dayjs(startTime, "HH:mm");

  while (
    current.isBefore(dayjs(endTime, "HH:mm")) ||
    current.isSame(dayjs(endTime, "HH:mm"))
  ) {
    times.push(current.format("HH:mm")); // Format: 08:00 AM, 08:15 AM, etc.
    current = current.add(15, "minute");
  }

  return times;
};

export const timeSlots = generateTimeSlots("00:00", "23:00"); // 0

export const processAppointment = (newAppointmentData, user, isEditMode) => {
  const { concerned, interval, note, ...restData } = newAppointmentData;

  let endDate = null;
  let allDay = false;

  let concernedOne = {};

  const startDate = parseDateTime(
    interval.start.date,
    interval.start.time,
    newAppointmentData.type
  );

  if (newAppointmentData.type === "Service") {
    endDate = parseDateTime(
      interval.end.date,
      interval.end.time,
      interval.allDay,
      true
    );
    concernedOne = {
      id: concerned.id,
      address: concerned.address,
      email: concerned.email,
      fullName: concerned.fullName,
      phone: concerned.phone,
    };
    // allDay: false;
  }
  if (newAppointmentData.type === "Time Off") {
    endDate = parseDateTime(
      interval.end.date,
      interval.end.time,
      newAppointmentData.type
    );
    // Fix for all-day events: Add 1 day to the end date
    if (interval.allDay) {
      endDate.setDate(endDate.getDate() + 1);

      // Update interval.end.date to match the new end date (DD/MM/YYYY format)
      const adjustedDay = endDate.getDate();
      const adjustedMonth = endDate.getMonth() + 1; // Months are 0-indexed
      const adjustedYear = endDate.getFullYear();

      interval.end.date = `${adjustedDay
        .toString()
        .padStart(2, "0")}/${adjustedMonth
        .toString()
        .padStart(2, "0")}/${adjustedYear}`;
    }
    endDate = endDate;
    concernedOne = {
      id: concerned.id,
      fullName: isEditMode
        ? concerned.fullName
        : `${concerned.details.firstName} ${concerned.details.lastName}`,
      phone: isEditMode ? concerned.phone : concerned.details?.phone || "",
    };
    allDay = interval.allDay;
  }

  if (newAppointmentData.type === "Reminder") {
    endDate = add15MinutesToDate(startDate);
    concernedOne = {
      id: user.uid,
      fullName: user.displayName,
    };
    allDay = false;
  }

  const duration = calculateDuration(startDate, endDate);
  const newAddedAppointment = {
    ...restData,

    concerned: concernedOne,
    interval: {
      ...interval,
      allDay: allDay, // Ensure interval.allDay is updated
    },
    duration: restData.type !== "Reminder" ? duration : "15min",
    title: getTitleByService(newAppointmentData, concerned, isEditMode),
    start: new Date(startDate),
    end:
      restData.type !== "Reminder"
        ? new Date(endDate)
        : add15MinutesToDate(startDate),
    allDay: allDay,
    desc: restData?.desc?.trim(),
  };

  return newAddedAppointment;
};
