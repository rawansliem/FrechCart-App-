"use client";

import {
  createContext,
  useEffect,
  useState,
  ReactNode,
  Dispatch,
  SetStateAction,
} from "react";
import getWishlist from "../WishlistActions/getWishlist.action";
import { toast } from "sonner";


export interface WishlistProduct {
  _id: string;
  title: string;
  imageCover: string;
  price: number;
  category?: {
    name: string;
  };
  brand?: {
    name: string;
  };
}

export interface WishlistResponse {
  status: string;
  count?: number;
  data: WishlistProduct[];
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
  const [numberOfWishlistItem, setnumberOfWishlistItem] =
    useState<number>(0);

 
  async function getUserWishlist(): Promise<void> {
    try {
      const res: WishlistResponse = await getWishlist();

      if (res.status === "success") {
        setProducts(res.data);
        setnumberOfWishlistItem(res.data?.length ?? 0);
      }
    } catch (err: unknown) {
      const message =
        err instanceof Error ? err.message : "Something went wrong";
      toast.error(message, { position: "top-center", duration: 3000 });
    }
  }

  useEffect(() => {
  if (typeof window !== "undefined") {
    getUserWishlist(); // أو getUserWishlist()
  }
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
