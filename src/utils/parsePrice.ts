export const parsePrice = (price?: string): number => {
  if (!price) return 0;

  // Remove qualquer coisa que não seja número, vírgula ou ponto
  const cleaned = price.replace(/[^0-9,]+/g, "");

  // Substitui vírgula decimal por ponto
  const normalized = cleaned.replace(",", ".");

  // Converte para número
  return parseFloat(normalized) || 0;
};
