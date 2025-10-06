"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import Image from "next/image";

type Brand = {
  _id: string;
  name: string;
  slug: string;
  image: string;
  createdAt: string;
};


type BrandsApiResponse = {
  results: number;
  data: Brand[];
  metadata?: Record<string, unknown>;
};

export default function BrandsPage() {
  const [brands, setBrands] = useState<Brand[]>([]);
  const [loading, setLoading] = useState<boolean>(true);

  useEffect(() => {
    async function fetchBrands() {
      try {
        const res = await fetch(
          "https://ecommerce.routemisr.com/api/v1/brands?limit=20"
        );
        const data: BrandsApiResponse = await res.json();

        if (Array.isArray(data.data)) {
          setBrands(data.data);
        } else {
          setBrands([]);
        }
      } catch  {
        setBrands([]);
      } finally {
        setLoading(false);
      }
    }

    fetchBrands();
  }, []);

  if (loading)
    return (
      <div className="flex justify-center items-center h-64">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-emerald-600"></div>
      </div>
    );

  return (
    <div className="container mx-auto my-10">
      <h1 className="text-3xl text-green-500 font-bold text-center mb-8">
        All Brands
      </h1>

      <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
        {brands.map((brand) => (
          <Link
            key={brand._id}
            href={`/brands/${brand._id}`}
            className="p-5 border rounded-lg shadow hover:shadow-lg hover:shadow-green-300 transition flex flex-col items-center bg-white"
          >
            <Image
              src={brand.image}
              alt={brand.name}
              width={160}
              height={160}
              className="w-40 h-40 object-contain mb-3"
            />
            <p className="text-xl font-bold text-green-500">{brand.name}</p>
          </Link>
        ))}
      </div>
    </div>
  );
}
