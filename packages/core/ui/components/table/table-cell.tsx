import React, { FC } from "react";

export interface CellProps {
  className?: string;
}

export const TableCell: FC<CellProps> = ({ children, className }) => (
  <td className={className}>{children}</td>
);
