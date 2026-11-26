import { getCategories, getProducts } from "@/lib/data";
import { ProductsManager } from "@/components/admin/ProductsManager";

export default async function AdminProductsPage({
  searchParams,
}: {
  searchParams: Promise<{ new?: string }>;
}) {
  const params = await searchParams;
  const [products, categories] = await Promise.all([
    getProducts(true),
    getCategories(true),
  ]);

  return (
    <ProductsManager
      initialProducts={products}
      categories={categories}
      openNewInitially={params.new === "1"}
    />
  );
}
