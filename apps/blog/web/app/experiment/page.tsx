import {
  CartLink,
  CategoryFilter,
  ProductList,
  ProductListFallback,
} from "@/entities/experiment";
import { Suspense } from "react";
// import { CartLink } from "@/entities/experiment";
// import { CartLink } from "../../src/entities/experiment/ui/CartLink";

interface ExperimentPageProps {
  searchParams: Promise<{ [key: string]: string | string[] | undefined }>;
}

export default async function ExperimentPage({
  searchParams,
}: ExperimentPageProps) {
  const params = await searchParams;
  const category = (params.category as string | undefined) ?? "all";

  return (
    <div className="max-w-5xl mx-auto p-6">
      <div className="flex justify-between items-center mb-8">
        <h1 className="text-2xl font-bold">쇼핑몰</h1>
        <CartLink />
      </div>

      <CategoryFilter category={category} />

      <Suspense fallback={<ProductListFallback />}>
        <ProductList category={category} />
      </Suspense>
    </div>
  );
}
