interface ProductImage {
  id: string;
  main?: boolean;
  source: string;
}

export interface Product {
  id: string;
  title: string;
  description: string;
  price: number;
  categoryId: string;
  count: number;
  images: ProductImage[];
}
