import clsx from 'clsx';
import React from 'react';

import {getPieChartData} from '~/shared/ui/components/pie-chart/get-pie-chart-data';

import styles from './pie-chart.module.css';

const DEFAULT_SVG_OPTIONS = {
  viewBox: '0 0 100 100',
};

const DEFAULT_PIE_CHART_OPTIONS = {
  centreX: 50,
  centreY: 50,
  radius: 50,
  innerRadius: 30,
};

interface PartProps extends React.SVGAttributes<SVGPathElement> {
  value: number;
}

export interface PieChartProps {
  parts: PartProps[];
  centreX?: number;
  centreY?: number;
  radius?: number;
  innerRadius?: number;
  className?: string;
}

export const PieChart = ({
  parts,
  centreX = DEFAULT_PIE_CHART_OPTIONS.centreX,
  centreY = DEFAULT_PIE_CHART_OPTIONS.centreY,
  radius = DEFAULT_PIE_CHART_OPTIONS.radius,
  innerRadius = DEFAULT_PIE_CHART_OPTIONS.innerRadius,
  className,
}: PieChartProps) => (
  <svg className={clsx(styles.root, className)} {...DEFAULT_SVG_OPTIONS}>
    {getPieChartData({centreX, centreY, radius}, parts).map(({...props}) => (
      <path key={props.d} {...props} />
    ))}

    <circle cx={centreX} cy={centreY} r={innerRadius} className={styles.innerCircle} />
  </svg>
);
