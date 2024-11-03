import { useEffect, useState } from 'react';

const REFRESH_INTERVAL = 30 * 1000; // 30 seconds

// convert time to seconds ago, minutes ago, hours, ago,
export const timeAgoString = (time) => {
  const [currentTime, setCurrentTime] = useState(Date.now());

  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentTime(Date.now());
    }, REFRESH_INTERVAL);

    return () => clearInterval(interval);
  });

  const diff = currentTime - time;
  const seconds = Math.floor(diff / 1000);
  const minutes = Math.floor(seconds / 60);
  const hours = Math.floor(minutes / 60);

  if (seconds < 60) {
    return 'just now';
  } else if (minutes < 60) {
    if (minutes === 1) {
      return `${minutes} minute ago`;
    } else {
      return `${minutes} minutes ago`;
    }
  } else {
    if (hours === 1) {
      return `${hours} hour ago`;
    } else {
      return `${hours} hours ago`;
    }
  }
};
