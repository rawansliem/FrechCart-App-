"use client";
import { useContext } from "react";
import { WishlistContext } from "@/src/context/wishlistContext";
import removeFromWishlist from "@/src/WishlistActions/removeFromWishlist.action";
import { toast } from "sonner";
import AddBtn from "@/src/_components/AddBtn/AddBtn";
import { Button } from "@/components/ui/button";
import Image from "next/image";

export default function WishlistPage() {
  const { products, setProducts,  setnumberOfWishlistItem } =
    useContext(WishlistContext)!;

  async function handleRemove(id: string) {
    const res = await removeFromWishlist(id);
    if (res.status === "success") {
      const newProducts = products.filter((p) => p._id !== id);
      setProducts(newProducts);
      setnumberOfWishlistItem(newProducts.length);
      toast.success("Removed from wishlist",{position:"top-center"});
    }
  }

  async function handleClearAll() {
    try {
      for (const prod of products) {
        await removeFromWishlist(prod._id);
      }
      setProducts([]);
      setnumberOfWishlistItem(0);
      toast.success("Wishlist cleared 🗑️",{position:"top-center"});
    } catch {
      toast.error("Failed to clear wishlist");
    }
  }

 return (
  <div className="container mx-auto my-12 px-4">
    <h1 className="text-3xl text-green-500 font-bold text-center mb-8">Wishlist Page</h1>

    {products.length === 0 ? (
      <p className="text-center text-red-500 text-lg">No products in wishlist</p>
    ) : (
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6 p-3">
        {products.map((prod) => (
          <div
            key={prod._id}
            className="bg-white border rounded-2xl shadow-md hover:shadow-lg transition-all duration-300 overflow-hidden flex flex-col group hover:-translate-y-1"
          >
            <div className="w-full h-56 overflow-hidden flex justify-center items-center bg-gray-50">
              <Image
                src={prod.imageCover}
                alt={prod.title}
                width={300}
                height={300}
                className="w-full h-40 object-cover transform transition-transform duration-500 group-hover:scale-105"
              />
            </div>

            <div className="p-5 flex flex-col justify-between flex-grow">
              <div>
                <h2 className="text-lg font-semibold line-clamp-2 text-gray-800 group-hover:text-emerald-600 transition-colors duration-300">
                  {prod.title}
                </h2>
                <p className="text-gray-600 font-medium mt-2 text-base">
                  {prod.price}{" "}
                  <span className="text-emerald-700 font-semibold">EGP</span>
                </p>
              </div>

              <div className="flex flex-wrap justify-between items-center gap-3 mt-5">
                <AddBtn id={prod._id} />
                <button
                  onClick={() => handleRemove(prod._id)}
                  className="px-4 py-2 bg-gray-600 text-white rounded-lg hover:bg-red-500 transition-all duration-300 cursor-pointer flex-1 text-center"
                >
                  Remove
                </button>
              </div>
            </div>
          </div>
        ))}
      </div>
    )}

    <div className="flex justify-end text-center mb-10 mt-6">
      {products.length > 0 && (
        <Button onClick={handleClearAll} className="bg-red-500 hover:bg-red-600">
          Clear Wishlist
        </Button>
      )}
    </div>
  </div>
);


}
