import { useEffect, useMemo, useRef, useState } from 'react';
import * as ss from 'simple-statistics';

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
    /* if (seconds === 1) { */
    /*   return `${seconds} second ago`; */
    /* } else { */
    /*   return `${seconds} seconds ago`; */
    /* } */
    /* if (seconds < 10) { */
    /*   return 'just now'; */
    /* } else { */
    /*   return 'less than a minute ago'; */
    /* } */
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


/**
 * Predicts when tempreature will go bad based on user
 * defined threshold
 *
 */
export const predictTempTrend = (
  data,
  highThreshold,
  lowThreshold,
  timeoutThreshold=45 //timeout in minutes
) => {

  const points = useMemo(() => {
    // since the data is prepended
    return data.map((d) => [d.time, d.temp]).reverse();
  }, [data]);

  // Calculate linear regression
  const regression = ss.linearRegression(points);

  const slope = regression.m;
  const intercept = regression.b;

  let seconds = 0;
  if (slope > 0) {
    // trending upwards temp
    seconds = slope * (highThreshold) + intercept;
  } else if (slope < 0) {
    // trending downwards temp
    seconds = slope * (lowThreshold) + intercept;
  }

  const now = Date.now();
  const diff = seconds - now;
  if (diff <  (1 + timeoutThreshold) * 60 * 1000
    && diff > (1 - timeoutThreshold) * 60 * 1000
  ) {
    // TODO:
    // insulin will go bad in less than 45 minutes
    // placeholder for now
    return true;
  } else {
    return false;
  }

};
