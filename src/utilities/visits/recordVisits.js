
// Helper function to check if the time difference between two dates is at least 1 hour
const  isTimeDifferenceGreaterThanOneHour=(date1, date2) =>{
    const timeDifference = Math.abs(date1 - date2);
    const oneHourInMilliseconds = 60 * 60 * 1000; // 1 hour in milliseconds
    return timeDifference >= oneHourInMilliseconds;
  }

  module.exports = {
    isTimeDifferenceGreaterThanOneHour
}