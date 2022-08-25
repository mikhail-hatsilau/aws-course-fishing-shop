export interface ProductImage {
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

export interface ProductRow {
  id: string;
  title: string;
  description: string;
  price: number;
  category_id: string;
  count: number;
  image_id: string;
  image_source: string;
  main_image: boolean;
}
