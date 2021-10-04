// solution taken from
// https://stackoverflow.com/a/28705478/16001266
function format(uptimeAsNumber: number): string {
  function pad(s: number) {
    return (s < 10 ? '0' : '') + s;
  }
  const hours = Math.floor(uptimeAsNumber / (60 * 60));
  const minutes = Math.floor((uptimeAsNumber % (60 * 60)) / 60);
  const seconds = Math.floor(uptimeAsNumber % 60);

  return `${pad(hours)}:${pad(minutes)}:${pad(seconds)}`;
}

function getUptime(): string {
  const uptime = process.uptime();
  return format(uptime);
}

export default getUptime;
