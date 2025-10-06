"use client";
import { useEffect, useState } from "react";
import { useParams } from "next/navigation";
import Image from "next/image";

type Product = {
  _id: string;
  title: string;
  description: string;
  imageCover: string;
  category: {
    name: string;
    _id: string;
  };
  brand: {
    name: string;
    _id: string;
  };
  price: number;
  ratingsAverage: number;
  ratingsQuantity: number;
  createdAt: string;
};

type ProductsApiResponse = {
  results: number;
  data: Product[];
  metadata?: Record<string, unknown>;
};

export default function BrandProductsPage() {
  const { id } = useParams();
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState<boolean>(true);

  useEffect(() => {
    async function fetchProducts() {
      try {
        const res = await fetch(
          `https://ecommerce.routemisr.com/api/v1/products?brand=${id}`
        );
        const data: ProductsApiResponse = await res.json();
    

        if (Array.isArray(data.data)) {
          setProducts(data.data);
        } else {
          setProducts([]);
        }
      } catch  {
  
        setProducts([]);
      } finally {
        setLoading(false);
      }
    }

    if (id) fetchProducts();
  }, [id]);

  if (loading)
    return (
      <div className="flex justify-center items-center h-64">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-emerald-600"></div>
      </div>
    );

  return (
    <div className="container mx-auto my-10">
      <h1 className="text-3xl text-green-500 font-bold mb-6 text-center">
        Products of Brand
      </h1>

      {products.length === 0 ? (
        <p className="text-red-500 font-bold text-center mt-5">
          No products found for this brand.
        </p>
      ) : (
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
          {products.map((product) => (
            <div
              key={product._id}
              className="p-4 border rounded-lg shadow hover:shadow-lg hover:shadow-green-300 bg-white"
            >
              <Image
  src={product.imageCover}
  alt={product.title}
  width={400}
  height={400}
  className="w-full h-40 object-cover rounded mb-3"
/>
              <h2 className="font-semibold">{product.title}</h2>
              <p className="text-emerald-600 font-bold">{product.price} EGP</p>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
