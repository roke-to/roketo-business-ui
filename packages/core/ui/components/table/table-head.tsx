import React, { FC } from "react";

export interface HeadProps {
  className?: string;
}

export const TableHead: FC<HeadProps> = ({ children, className }) => (
  <th className={className}>{children}</th>
);
