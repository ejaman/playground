import {
  useQuery,
  useSuspenseQuery,
} from "@tanstack/react-query";
import { productQueryKeys } from "../lib/productQueryKeys";
import { fetchProduct, fetchProducts } from "../lib/products";

export const productQueries = {
  all: () => ({ queryKey: productQueryKeys.all() }) as const,

  list: (category?: string) => ({
    queryKey: productQueryKeys.list(category),
    queryFn: () => fetchProducts(category),
  }),

  detail: (id: number) => ({
    queryKey: productQueryKeys.detail(id),
    queryFn: () => fetchProduct(id),
    enabled: !!id,
  }),
};

export const useProducts = (category?: string) =>
  useQuery(productQueries.list(category));

/** Suspense와 함께 사용. 데이터 로드 전까지 suspend. */
export const useProductsSuspense = (category?: string) =>
  useSuspenseQuery(productQueries.list(category));

export const useProduct = (id: number) => useQuery(productQueries.detail(id));
