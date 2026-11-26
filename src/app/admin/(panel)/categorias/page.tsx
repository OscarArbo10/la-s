import { getCategories } from "@/lib/data";
import { CategoriesManager } from "@/components/admin/CategoriesManager";

export default async function AdminCategoriesPage() {
  const categories = await getCategories(true);
  return <CategoriesManager initialCategories={categories} />;
}
