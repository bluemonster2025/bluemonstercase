"use client";

interface ProductBannerProps {
  imgUrl?: string;
}

export default function ProductBannerSession({ imgUrl }: ProductBannerProps) {
  if (!imgUrl) return <p>Nenhum banner cadastrado</p>;

  return (
    <div className="pb-10">
      <div
        className="relative w-full h-80 md:h-[327px] bg-cover bg-no-repeat bg-center rounded-3xl"
        style={{ backgroundImage: `url(${imgUrl})` }}
      ></div>
    </div>
  );
}
