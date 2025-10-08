"use client"

import { createContext, useEffect, useState, ReactNode, Dispatch, SetStateAction } from 'react';
import getLoggedUserCart from '../CartActions/etLoggedUserCart';
import { toast } from 'sonner';


// 1- Define type for the context
interface CartContextType  {
  numberOfCartItem: number;
  setnumberOfCartItem: Dispatch<SetStateAction<number>>;
};

// 2- Create context with typing
export const CartContext = createContext<CartContextType | undefined>(undefined);

// 3- 
interface CartContextProviderProps {
  children: ReactNode;
}

//4-
export default function CartContextProvider({ children }: CartContextProviderProps) {
  const [numberOfCartItem, setnumberOfCartItem] = useState<number>(0);

  async function getUserCart() {
    try {
      const res = await getLoggedUserCart();
      if (res.status === "success") {
        const sum = res.data.products.reduce((acc: number, product: { count: number }) => acc + product.count,0); 
        setnumberOfCartItem(sum);
        
      }
    } catch (err: unknown) {
      const message =
        err instanceof Error ? err.message : "Something went wrong";
      toast.error(message, { position: "top-center", duration: 3000 });
    }
  }

 useEffect(() => {
  if (typeof window !== "undefined") {
    getUserCart(); // أو getUserWishlist()
  }
}, []);

  return (
    <CartContext.Provider value={{ numberOfCartItem, setnumberOfCartItem }}>
      {children}
    </CartContext.Provider>
  );
}
