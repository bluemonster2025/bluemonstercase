export type Category = {
  id: number;
  name: string;
  slug: string;
  display: string;
  image?: {
    src: string;
    alt: string;
  } | null;
  cover?: string;
};
