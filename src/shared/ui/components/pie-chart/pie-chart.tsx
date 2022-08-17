import clsx from 'clsx';

import styles from './pie-chart.module.css';

export const PieChart = ({parts, className}: {parts: number[]; className?: string}) => (
  <svg className={clsx(styles.root, className)}>
    {parts.map((part) => (
      <path key={part} />
    ))}
  </svg>
);
