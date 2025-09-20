import HeaderMain from "./HeaderMain";
import HeaderCategories from "./HeaderCategories";
import HeaderTop from "./HeaderTop";
import { LogoType } from "@/types/home";
import HeaderMobile from "./HeaderMobile";

interface Props {
  logo: LogoType;
}

export default function Header({ logo }: Props) {
  return (
    <header className="w-full">
      {/* Desktop */}
      <div className="hidden lg:block">
        <HeaderTop />
        <HeaderMain data={logo} />
        <HeaderCategories />
      </div>

      {/* Mobile */}
      <HeaderMobile data={logo} />
    </header>
  );
}
