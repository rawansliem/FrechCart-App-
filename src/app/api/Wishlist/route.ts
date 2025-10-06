import { NextResponse } from "next/server";
import getMyToken from "@/src/utilities/getMyToken";

export async function GET() {
  try {
    const token = await getMyToken();
    if (!token) {
      return NextResponse.json(
        { status: "error", message: "Please login first", data: [] },
        { status: 401 }
      );
    }

    const res = await fetch("https://ecommerce.routemisr.com/api/v1/wishlist", {
      headers: {
        token,
        "Content-Type": "application/json",
      },
    });

    const data = await res.json();
    return NextResponse.json({ status: "success", data: data.data || [] });
  } catch (error:unknown) {
   
    return NextResponse.json(
      { status: "error", message: "Failed to fetch wishlist", data: [] },
      { status: 500 }
    );
  }
}
