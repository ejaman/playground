export const productQueryKeys = {
  all: () => ["products"] as const,
  list: (category?: string) =>
    [...productQueryKeys.all(), category ?? "all"] as const,
  detail: (id: number) => [...productQueryKeys.all(), id] as const,
};
