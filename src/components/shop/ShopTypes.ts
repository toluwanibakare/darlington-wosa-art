export interface ShopCategory {
  id: number;
  name: string;
  slug: string;
  description: string | null;
  image: string | null;
  item_count: number;
}

export interface ShopItem {
  id: number;
  name: string;
  slug: string;
  description: string | null;
  price: number | null;
  width: number | null;
  height: number | null;
  is_negotiable: boolean;
  images: string[];
  category: { id: number; name: string; slug: string } | null;
  is_sold: boolean;
}

export interface CartItem {
  id: number;
  quantity: number;
  item: {
    id: number;
    name: string;
    price: number | null;
    is_negotiable: boolean;
    images: string[];
    category: string | null;
    width: number | null;
    height: number | null;
  } | null;
}
