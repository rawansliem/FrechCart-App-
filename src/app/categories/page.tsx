"use client";
import { useEffect, useState } from "react";
import Link from "next/link";
import Image from "next/image";


type Category = {
  _id: string;
  name: string;
  slug: string;
  image: string;
  createdAt: string;
  updatedAt: string;
};


type CategoriesApiResponse = {
  results: number;
  data: Category[];
  metadata?: Record<string, unknown>;
};

export default function CategoriesPage() {
  const [categories, setCategories] = useState<Category[]>([]);
  const [loading, setLoading] = useState<boolean>(true);

  useEffect(() => {
    async function fetchCategories() {
      try {
        const res = await fetch("https://ecommerce.routemisr.com/api/v1/categories");
        const data: CategoriesApiResponse = await res.json();

        if (Array.isArray(data.data)) {
          setCategories(data.data);
        } else {
          setCategories([]);
        }
      } catch  {
      } finally {
        setLoading(false);
      }
    }

    fetchCategories();
  }, []);

  if (loading)
    return (
      <div className="flex justify-center items-center h-64">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-emerald-600"></div>
      </div>
    );

  return (
    <div className="container mx-auto my-8">
      <h1 className="text-3xl font-bold text-center mb-8 text-green-500">
        Categories
      </h1>

      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
        {categories.map((cat) => (
          <Link
            key={cat._id}
            href={`/categories/${cat._id}`}
            className="border rounded-lg shadow hover:scale-105 hover:shadow-lg hover:shadow-green-200 transition bg-white overflow-hidden"
          >
            <Image
              src={cat.image}
              alt={cat.name}
              width={200}
              height={200}
              className="w-full h-48 object-cover"
            />
            <div className="p-4 text-center">
              <h2 className="text-xl text-green-500 font-bold">{cat.name}</h2>
            </div>
          </Link>
        ))}
      </div>
    </div>
  );
}
