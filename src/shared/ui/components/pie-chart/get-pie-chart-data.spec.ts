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
        d: 'M50,50 L100,50 A50,50 0 0,1 68.4701732354442,96.46345553930186 Z',
        className: 'red',
      },
      {
        d: 'M50,50 L68.4701732354442,96.46345553930186 A50,50 0 0,1 32.6000583915569,96.87474834090068 Z',
        className: 'green',
      },
      {
        d: 'M50,50 L32.6000583915569,96.87474834090068 A50,50 0 0,1 4.6711598420657054,28.897956261621413 Z',
        className: 'blue',
      },
      {
        d: 'M50,50 L4.6711598420657054,28.897956261621413 A50,50 0 0,1 18.69761713800257,11.01076011050062 Z',
        className: 'yellow',
      },
      {
        d: 'M50,50 L18.69761713800257,11.01076011050062 A50,50 0 0,1 61.92296127679195,1.4423744980037156 Z',
        className: 'orange',
      },
      {
        d: 'M50,50 L61.92296127679195,1.4423744980037156 A50,50 0 0,1 100,50.000000000000036 Z',
        className: 'purple',
      },
    ]);
  });
});
