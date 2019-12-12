const padZero = val => val.padStart(2, "0");

const timeout = async ms => {
  return new Promise(resolve => setTimeout(resolve, ms));
};
const getFileNameSuffix = () => {
  const currentDate = new Date();

  const year = currentDate.getFullYear();
  const month = padZero((currentDate.getMonth() + 1).toString());
  const dayOfMonth = padZero(currentDate.getDate().toString());
  const hours = padZero(currentDate.getHours().toString());
  const minutes = padZero(currentDate.getMinutes().toString());

  const time = `${year}${month}${dayOfMonth}${hours}${minutes}`;
  return time;
};

module.exports = { padZero, timeout, getFileNameSuffix };
