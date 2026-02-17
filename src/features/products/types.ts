export type Product = {
  id: number;
  title: string;
  description: string;
  price: number;
  stock: number;
  category: string;
  brand?: string;
  rating?: number;
  thumbnail?: string;
};

export type ProductsResponse = {
  products: Product[];
  total: number;
  skip: number;
  limit: number;
};

export type SortBy = "price" | "stock";
export type SortOrder = "asc" | "desc";
