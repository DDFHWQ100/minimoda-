import { parseJsonArray, type ColorOption } from "@/lib/format";

export type ProductFormInitial = {
  id?: number;
  name: string;
  description: string;
  price: string;
  discountPrice: string;
  stock: string;
  categoryId: string;
  sizes: string;
  colors: string;
  images: string[];
  isNew: boolean;
  isOffer: boolean;
  isFeatured: boolean;
};

export const EMPTY_PRODUCT_FORM: ProductFormInitial = {
  name: "", description: "", price: "", discountPrice: "", stock: "10",
  categoryId: "", sizes: "2-3, 4-5, 6-7, 8-9",
  colors: "صورتی,#f2a7c3\nآبی,#4a6fa5",
  images: [],
  isNew: true, isOffer: false, isFeatured: false,
};

export function initialFromProduct(p: {
  id: number; name: string; description: string; price: number; discountPrice: number | null;
  stock: number; categoryId: number | null; sizes: string; colors: string; images: string;
  isNew: boolean; isOffer: boolean; isFeatured: boolean;
}): ProductFormInitial {
  return {
    id: p.id,
    name: p.name,
    description: p.description,
    price: String(p.price),
    discountPrice: p.discountPrice !== null ? String(p.discountPrice) : "",
    stock: String(p.stock),
    categoryId: p.categoryId !== null ? String(p.categoryId) : "",
    sizes: parseJsonArray<string>(p.sizes).join(", "),
    colors: (() => {
      try {
        return (JSON.parse(p.colors) as ColorOption[]).map((c) => `${c.name},${c.hex}`).join("\n");
      } catch { return ""; }
    })(),
    images: parseJsonArray<string>(p.images),
    isNew: p.isNew,
    isOffer: p.isOffer,
    isFeatured: p.isFeatured,
  };
}
