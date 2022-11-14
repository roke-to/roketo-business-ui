import React, { FC } from "react";

export interface RowProps {
  className?: string;
}

export const TableRow: FC<RowProps> = ({ children, className }) => (
  <tr className={className}>{children}</tr>
);
