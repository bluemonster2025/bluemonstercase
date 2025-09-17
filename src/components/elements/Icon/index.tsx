import * as Fa from "react-icons/fa";
import * as Ci from "react-icons/ci";
import * as Fa6 from "react-icons/fa6";
import * as Bs from "react-icons/bs";
import * as Io from "react-icons/io";

export const AllIcons = {
  ...Fa,
  ...Ci,
  ...Fa6,
  ...Bs,
  ...Io,
};

interface IconProps {
  name: string;
  size?: number;
  color?: string;
  fill?: string;
  stroke?: string;
  hoverColor?: string;
}

export const Icon = ({ name, size, color = "", ...rest }: IconProps) => {
  const RIcon =
    AllIcons[name as keyof typeof AllIcons] || AllIcons.FaRegWindowClose;

  return <RIcon size={size} color={color} {...rest} />;
};

export const getAllIcons = (searchName = "") => {
  const icons: string[] = [];

  if (searchName.length <= 2) return [];

  for (const key in AllIcons) {
    if (searchName) {
      const { name = "" } = AllIcons[key as keyof typeof AllIcons];
      if (name.toLowerCase().includes(searchName.toLowerCase())) {
        icons.push(AllIcons[key as keyof typeof AllIcons].name);
      }
    } else {
      icons.push(AllIcons[key as keyof typeof AllIcons].name);
    }
  }

  return icons;
};

export default Icon;
