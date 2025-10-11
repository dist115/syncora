function formatZero(v: number) {
  return v < 10 ? '0' + v : v;
}

export function formatTime(time: number) {
  if (isNaN(time)) {
    return '00:00';
  }

  const date = new Date(time * 1000);
  const hours = date.getUTCHours();
  const minutes = date.getUTCMinutes();
  const seconds = date.getUTCSeconds().toString().padStart(2, '0');
  if (hours) {
    //if video have hours
    return `${hours}:${minutes.toString().padStart(2, '0')} `;
  } else return `${formatZero(minutes)}:${seconds}`;
}
