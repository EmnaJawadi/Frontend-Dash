import { apiClient } from "@/src/lib/api-client";
import type {
  AddProductImagesPayload,
  Product,
  ProductPayload,
  ProductsListResponse,
  ProductsQuery,
  UploadProductImagePayload,
} from "@/src/types/product";

function toQueryString(query?: Record<string, unknown>) {
  if (!query) return "";

  const params = new URLSearchParams();
  for (const [key, value] of Object.entries(query)) {
    if (value === undefined || value === null || value === "") continue;
    params.set(key, String(value));
  }

  const value = params.toString();
  return value ? `?${value}` : "";
}

export const productsService = {
  list: (query?: ProductsQuery): Promise<ProductsListResponse> =>
    apiClient.get<ProductsListResponse>(
      `/products${toQueryString(query as Record<string, unknown>)}`,
    ),

  getById: (id: string): Promise<Product> =>
    apiClient.get<Product>(`/products/${id}`),

  create: (payload: ProductPayload): Promise<Product> =>
    apiClient.post<Product>("/products", payload),

  update: (id: string, payload: ProductPayload): Promise<Product> =>
    apiClient.patch<Product>(`/products/${id}`, payload),

  deactivate: (id: string): Promise<Product> =>
    apiClient.delete<Product>(`/products/${id}`),

  addImages: (id: string, payload: AddProductImagesPayload): Promise<Product> =>
    apiClient.post<Product>(`/products/${id}/images`, payload),

  uploadImage: (
    id: string,
    payload: UploadProductImagePayload,
  ): Promise<Product> => {
    const formData = new FormData();
    formData.append("file", payload.file);

    if (payload.altText?.trim()) {
      formData.append("altText", payload.altText.trim());
    }

    return apiClient.postForm<Product>(`/products/${id}/images/upload`, formData);
  },

  deleteImage: (
    id: string,
    imageId: string,
  ): Promise<{ deleted: boolean; productId: string; imageId: string }> =>
    apiClient.delete<{ deleted: boolean; productId: string; imageId: string }>(
      `/products/${id}/images/${imageId}`,
    ),
};
