"use client";

import { useEffect, useState } from "react";
import { useParams } from "next/navigation";

interface Subcategory {
  _id: string;
  name: string;
}

interface Category {
  _id: string;
  name: string;
}

export default function SubcategoriesPage() {
  const { id } = useParams(); 
  const [subcategories, setSubcategories] = useState<Subcategory[]>([]);
  const [category, setCategory] = useState<Category | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function fetchCategoryAndSubcategories() {
      try {
 
        const catRes = await fetch(`https://ecommerce.routemisr.com/api/v1/categories/${id}`);
        const catData = await catRes.json();
        setCategory(catData.data || null);

    
        const subRes = await fetch(`https://ecommerce.routemisr.com/api/v1/subcategories?category=${id}`);
        const subData = await subRes.json();
        setSubcategories(subData.data || []);
      } catch  {
       
      } finally {
        setLoading(false);
      }
    }

    fetchCategoryAndSubcategories();
  }, [id]);

  if (loading) return <div className="flex justify-center items-center h-64">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-emerald-600"></div>
      </div>;


  return (
    <div className="container mx-auto my-8">
      <h1 className="text-3xl font-bold text-green-500 text-center mb-8">
        {category?.name || "Category"} - Subcategories
      </h1>

      {subcategories.length === 0 ? (
        <p className="text-center text-red-500">No subcategories found!</p>
      ) : (
        <div className=" px-5 grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
          {subcategories.map((sub) => (
            <div
              key={sub._id}
              className="border rounded-lg shadow p-6 text-center text-lg font-semibold transition transform hover:scale-105 hover:text-green-400 cursor-pointer"
              
            >
              {sub.name}
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
