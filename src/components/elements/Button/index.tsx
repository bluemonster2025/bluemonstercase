import { ButtonBase, IButtonBase } from "./ButtonBase";

export const ButtonPrimary = ({
  children,
  onClick,
  href,
  type,
  id,
  target,
}: Omit<IButtonBase, "className">) => {
  return (
    <ButtonBase
      className="bg-white text-black text-sm h-12 flex justify-center w-full rounded-lg border border-grayscale-100 items-center"
      onClick={onClick}
      href={href}
      type={type}
      id={id}
      target={target}
    >
      {children}
    </ButtonBase>
  );
};

export const ButtonSecondary = ({
  children,
  onClick,
  href,
  type,
  id,
  target,
}: Omit<IButtonBase, "className">) => {
  return (
    <ButtonBase
      className="bg-black text-white h-[52px] rounded-lg flex justify-center w-full items-center transition-all"
      onClick={onClick}
      href={href}
      type={type}
      id={id}
      target={target}
    >
      {children}
    </ButtonBase>
  );
};
