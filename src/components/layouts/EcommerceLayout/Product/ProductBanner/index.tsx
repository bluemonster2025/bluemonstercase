export default function ProductBanner({ imgUrl }: { imgUrl?: string }) {
  return (
    <div className="pb-10">
      {imgUrl ? (
        <div
          className="relative w-full h-80 md:h-[327px] bg-cover bg-no-repeat bg-center rounded-3xl"
          style={{ backgroundImage: `url(${imgUrl})` }}
        />
      ) : (
        <p>Nenhum banner cadastrado</p>
      )}
    </div>
  );
}
