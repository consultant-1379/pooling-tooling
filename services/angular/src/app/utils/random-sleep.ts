export const randomSleep = async (maxSleepSeconds = 1) => {
  const randomTime = Math.random() * maxSleepSeconds * 1000;
  setTimeout(() => {}, randomTime);
};
