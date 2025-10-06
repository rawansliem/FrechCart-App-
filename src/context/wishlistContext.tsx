"use client";

import {
  createContext,
  useEffect,
  useState,
  ReactNode,
  Dispatch,
  SetStateAction,
} from "react";

export interface WishlistProduct {
  _id: string;
  title: string;
  imageCover: string;
  price: number;
  category?: { name: string };
  brand?: { name: string };
}

export interface WishlistContextType {
  products: WishlistProduct[];
  setProducts: Dispatch<SetStateAction<WishlistProduct[]>>;
  numberOfWishlistItem: number;
  setnumberOfWishlistItem: Dispatch<SetStateAction<number>>;
}

interface WishlistContextProviderProps {
  children: ReactNode;
}

export const WishlistContext = createContext<WishlistContextType | undefined>(
  undefined
);

export default function WishlistContextProvider({
  children,
}: WishlistContextProviderProps) {
  const [products, setProducts] = useState<WishlistProduct[]>([]);
  const [numberOfWishlistItem, setnumberOfWishlistItem] = useState<number>(0);

  useEffect(() => {
    async function fetchWishlist() {
      try {
        const res = await fetch("/api/wishlist", { cache: "no-store" });
        const data = await res.json();

        if (data.status === "success") {
          setProducts(data.data);
          setnumberOfWishlistItem(data.data.length || 0);
        } 
      } catch (err:unknown) {
       
      }
    }

    fetchWishlist();
  }, []);

  return (
    <WishlistContext.Provider
      value={{
        products,
        setProducts,
        numberOfWishlistItem,
        setnumberOfWishlistItem,
      }}
    >
      {children}
    </WishlistContext.Provider>
  );
}
