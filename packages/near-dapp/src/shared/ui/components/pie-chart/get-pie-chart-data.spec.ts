import {getPieChartData} from '~/shared/ui/components/pie-chart/get-pie-chart-data';

describe('Get pie chart data', () => {
  test('return right set options', () => {
    const data = [
      {
        value: 26,
        className: 'red',
      },
      {
        value: 16,
        className: 'green',
      },
      {
        value: 36,
        className: 'blue',
      },
      {
        value: 10,
        className: 'yellow',
      },
      {
        value: 20,
        className: 'orange',
      },
      {
        value: 29,
        className: 'purple',
      },
    ];

    expect(getPieChartData({centreX: 50, centreY: 50, radius: 50}, data)).toEqual([
      {
        className: 'red',
        d: 'M50,50 L50,0 A50,50 0 0,1 96.46345553930186,31.529826764555814 Z',
      },
      {
        className: 'green',
        d: 'M50,50 L96.46345553930186,31.529826764555814 A50,50 0 0,1 96.87474834090068,67.3999416084431 Z',
      },
      {
        className: 'blue',
        d: 'M50,50 L96.87474834090068,67.3999416084431 A50,50 0 0,1 28.89795626162143,95.32884015793431 Z',
      },
      {
        className: 'yellow',
        d: 'M50,50 L28.89795626162143,95.32884015793431 A50,50 0 0,1 11.010760110500648,81.30238286199746 Z',
      },
      {
        className: 'orange',
        d: 'M50,50 L11.010760110500648,81.30238286199746 A50,50 0 0,1 1.4423744980037085,38.077038723208084 Z',
      },
      {
        className: 'purple',
        d: 'M50,50 L1.4423744980037085,38.077038723208084 A50,50 0 0,1 49.99999999999999,0 Z',
      },
    ]);
  });
});
