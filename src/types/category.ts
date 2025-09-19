// Tipo básico de categoria do frontend
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

// types/category.ts
export type WooCategory = {
  id: number;
  name: string;
  slug: string;
  description: string;
  count: number;
  parent: number;
  image?: {
    id: number;
    src: string;
    alt: string;
  } | null;
  acf?: {
    category_cover_desktop?: {
      url: string;
    };
    category_cover_mobile?: {
      url: string;
    };
    category_cover_video?: { url: string };
  };
};

export type WooCategoryWithCovers = WooCategory & {
  cover_desktop?: string;
  cover_mobile?: string;
  cover_video?: string;
};
