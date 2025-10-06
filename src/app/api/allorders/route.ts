"use server";

import { NextResponse } from "next/server";
import { decode } from "next-auth/jwt";
import { cookies } from "next/headers";
import { jwtDecode } from "jwt-decode";

type DecodedSession = {
  token?: string; 
  email?: string;
  name?: string;
  picture?: string;
  sub?: string;
  iat?: number;
  exp?: number;
};

type DecodedUserJWT = {
  id: string;
  name?: string;
  email?: string;
  role?: string;
  iat?: number;
  exp?: number;
};

type OrderResponse = {
  _id: string;
  totalOrderPrice: number;
  paymentMethodType: "card" | "cash";
  createdAt: string;
  cartItems: {
    _id: string;
    count: number;
    price: number;
    product: {
      _id: string;
      title: string;
      imageCover: string;
    };
  }[];
  shippingAddress: {
    details?: string;
    phone?: string;
    city?: string;
  };
  user: {
    _id: string;
    name: string;
    email: string;
  };
};

export async function GET() {
  try {
   
    const cookieStore = await cookies();
    const sessionToken =
      cookieStore.get("next-auth.session-token")?.value ||
      cookieStore.get("__Secure-next-auth.session-token")?.value;

    if (!sessionToken) {
      return NextResponse.json({ message: "User not logged in" }, { status: 401 });
    }


    const decodedSession = (await decode({
      token: sessionToken,
      secret: process.env.NEXTAUTH_SECRET!,
    })) as DecodedSession | null;

    const userJwt = decodedSession?.token;
    if (!userJwt) {
      return NextResponse.json({ message: "Missing user token" }, { status: 403 });
    }

 
    const decodedUser = jwtDecode<DecodedUserJWT>(userJwt);
    const userId = decodedUser?.id;

    if (!userId) {
      return NextResponse.json({ message: "Missing user ID" }, { status: 403 });
    }

 
    const res = await fetch(`https://ecommerce.routemisr.com/api/v1/orders/user/${userId}`, {
      headers: {
        token: userJwt,
        "Content-Type": "application/json",
      },
    });

    const data: OrderResponse[] = await res.json();

    return NextResponse.json(data, { status: res.status });
  } catch (err: unknown) {
    const errorMessage =
      err instanceof Error ? err.message : "Unexpected server error";
    return NextResponse.json({ message: errorMessage }, { status: 500 });
  }
}
