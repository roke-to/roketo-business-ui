import {getPieSliceData} from './get-pie-slice-data';

export const getPieChartData = (
  {centreX, centreY, radius}: {centreX: number; centreY: number; radius: number},
  data: {
    value: number;
    className?: string;
  }[],
) => {
  const total = data.reduce((totalValue, {value: b}) => totalValue + b, 0);
  const radiansPerUnit = (2 * Math.PI) / total;

  let startAngleRadians = -Math.PI / 2;
  let sweepAngleRadians = null;

  return data.map(({value, ...props}) => {
    sweepAngleRadians = value * radiansPerUnit;
    const slice = {
      d: getPieSliceData({centreX, centreY, radius, startAngleRadians, sweepAngleRadians}),
      ...props,
    };

    startAngleRadians += sweepAngleRadians;

    return slice;
  });
};
