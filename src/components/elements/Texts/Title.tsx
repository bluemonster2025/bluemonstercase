import { CSSProperties, ReactNode, ElementType, forwardRef } from "react";

interface Props {
  as?: ElementType;
  children: ReactNode;
  className?: string;
  style?: CSSProperties;
}

export const Title = forwardRef<HTMLElement, Props>(
  ({ children, className = "", as: Element = "h1", style }, ref) => {
    const getClassName = () => `${className}`;

    return (
      <Element className={getClassName()} style={style} ref={ref}>
        {children}
      </Element>
    );
  }
);

Title.displayName = "Title";
