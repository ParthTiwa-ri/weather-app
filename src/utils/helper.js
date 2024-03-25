export function formatTimestamp(timestamp) {
  const date = new Date(timestamp * 1000); // Convert seconds to milliseconds

  // Define month names array
  const monthNames = [
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

  // Get the day of the week, the day of the month, and the month
  const dayOfWeek = date.toLocaleString("en-US", { weekday: "long" });
  const dayOfMonth = date.getDate();
  const month = monthNames[date.getMonth()];

  // Construct the formatted date string
  const formattedDate = `${dayOfWeek} ${dayOfMonth}, ${month}`;

  return formattedDate;
}

export function timestampToTime(timestamp) {
  // Create a new Date object using the timestamp
  var date = new Date(timestamp * 1000);

  // Get the hours and minutes from the Date object
  var hours = date.getHours();
  var minutes = date.getMinutes();

  // Convert hours to 12-hour format and determine AM/PM
  var ampm = hours >= 12 ? "PM" : "AM";
  hours = hours % 12;
  hours = hours ? hours : 12; // Handle midnight (0 hours) as 12 AM

  // Add leading zero to minutes if less than 10
  minutes = minutes < 10 ? "0" + minutes : minutes;

  // Construct the time string
  var timeString = hours + ":" + minutes + " " + ampm;

  return timeString;
}

export function groupByDate(data) {
  if (!data) return;
  const groupedData = {};

  // Iterate over each item in the list
  data.list.forEach((item) => {
    // Extract date from dt_txt
    const date = item.dt_txt.split(" ")[0];

    // If date is not already in the groupedData object, add it
    if (!groupedData[date]) {
      groupedData[date] = [];
    }

    // Append item to the corresponding date
    groupedData[date].push(item);
  });

  return groupedData;
}

// export function (weatherData) {
//   if (!weatherData) return;
//   const dailyTemperatures = {};

//   // Iterate through each forecast entry
//   weatherData.list.forEach((entry) => {
//     // Extract date without time
//     const date = entry.dt_txt.split(" ")[0];

//     // If date not in dailyTemperatures, add it with the temperature
//     if (!dailyTemperatures[date]) {
//       dailyTemperatures[date] = {
//         temp: entry.main.temp,
//       };
//     } else {
//       // If date already exists, update temperature to the maximum temperature of the day
//       if (entry.main.temp > dailyTemperatures[date].temp) {
//         dailyTemperatures[date].temp = entry.main.temp;
//       }
//     }
//   });

//   return dailyTemperatures;
// }

export function extractDailyTemperatures(weatherData) {
  if (!weatherData) return;
  const firstEntries = [];

  // Iterate through each forecast entry
  weatherData.list.forEach((entry) => {
    // Check if the current entry is the first entry for its date
    const isFirstEntry = !firstEntries.some((existingEntry) => {
      return (
        new Date(existingEntry.dt_txt).toDateString() ===
        new Date(entry.dt_txt).toDateString()
      );
    });

    // If it is the first entry for its date, push it to the array
    if (isFirstEntry) {
      firstEntries.push(entry);
    }
  });

  return firstEntries;
}

export function formatDateMonth(timestamp) {
  // Convert Unix timestamp to milliseconds
  const milliseconds = timestamp * 1000;

  // Create a Date object using the milliseconds
  const date = new Date(milliseconds);

  // Array of month names
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

  // Extract day and month from the Date object
  const day = date.getDate();
  const month = months[date.getMonth()];

  // Format and return the date string
  return `${day} ${month}`;
}

export function formatDay(timestamp) {
  // Convert Unix timestamp to milliseconds
  const milliseconds = timestamp * 1000;

  // Create a Date object using the milliseconds
  const date = new Date(milliseconds);

  // Array of day names
  const days = [
    "Sunday",
    "Monday",
    "Tuesday",
    "Wednesday",
    "Thursday",
    "Friday",
    "Saturday",
  ];

  // Get the day of the week from the Date object
  const dayOfWeek = days[date.getDay()];

  return dayOfWeek;
}
