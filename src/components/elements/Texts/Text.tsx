"use client";

import { CSSProperties, ReactNode } from "react";

interface Props {
  children: ReactNode;
  className?: string;
  style?: CSSProperties;
}

export const Text = ({ children, style, className = "" }: Props) => {
  const getClassName = () => `${className} block text-sm`;

  return (
    <span className={getClassName()} style={style}>
      {children}
    </span>
  );
};
