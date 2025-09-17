export type Hero = {
  title: string;
  subtitle: string;
  image: string;
};

export type Section1Item = {
  title: string;
  slug: string;
  products: { id: number }[];
};

export type Acf = {
  hero: Hero;
  section1: Section1Item[];
};

export type Page = {
  id: number;
  acf: Acf;
};

export type AdminHomeEditorProps = {
  initialPage?: Page;
};
