export type ProductStatus = "ACTIVE" | "INACTIVE" | "ARCHIVED";

export type ProductImage = {
  id: string;
  productId: string;
  imageUrl: string;
  altText?: string | null;
  metadata?: Record<string, unknown> | null;
  createdAt: string;
  updatedAt: string;
};

export type Product = {
  id: string;
  companyId: string;
  name: string;
  description?: string | null;
  category?: string | null;
  price?: number | null;
  currency: string;
  isAvailable: boolean;
  status: ProductStatus;
  keywords: string[];
  variants?: Record<string, unknown> | null;
  metadata?: Record<string, unknown> | null;
  createdAt: string;
  updatedAt: string;
  images: ProductImage[];
};

export type ProductsListResponse = {
  items: Product[];
  meta?: {
    page: number;
    limit: number;
    total: number;
    totalPages: number;
  };
};

export type ProductsQuery = {
  page?: number;
  limit?: number;
  search?: string;
  category?: string;
  status?: ProductStatus;
};

export type ProductPayload = {
  name: string;
  description?: string | null;
  category?: string | null;
  price?: number | null;
  currency?: string;
  isAvailable?: boolean;
  status?: ProductStatus;
  keywords?: string[];
};

export type AddProductImagesPayload = {
  images: Array<{
    imageUrl: string;
    altText?: string | null;
    metadata?: Record<string, unknown> | null;
  }>;
};

export type UploadProductImagePayload = {
  file: File;
  altText?: string | null;
};
