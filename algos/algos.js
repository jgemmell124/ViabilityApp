import * as ss from 'simple-statistics';

// Convert data into points for regression
export const calculateTrend = (data) => {
  const points = data.map((value, index) => [index, value]);

  // Calculate linear regression
  const regression = ss.linearRegression(points);

  const slope = regression.m;
  const threshold = 0.08;

  if (slope > threshold) {
    // since we prepend temps, we need to flip it based on slope (most recent is first)
    return 'down';
  } else if (slope < -threshold) {
    return 'up';
  } else  {
    return 'neutral';
  }
};
