import "./table.module.scss";
import clsx from "clsx";
import React, { FC } from "react";

export interface TableProps {
  className?: string;
}

export const Table: FC<TableProps> = ({ children, className }) => (
  <table className={clsx(className)}>{children}</table>
);
