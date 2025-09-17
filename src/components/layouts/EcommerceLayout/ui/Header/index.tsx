import HeaderMain from "./HeaderMain";
import HeaderCategories from "./HeaderCategories";
import HeaderTop from "./HeaderTop";
import { Logo } from "@/types/home";

interface Props {
  logo: Logo;
}

export default function Header({ logo }: Props) {
  return (
    <header className="w-full">
      <HeaderTop />

      <HeaderMain data={logo} />

      <HeaderCategories />
    </header>
  );
}
