"use server";

import getMyToken from "../utilities/getMyToken";

export default async function getLoggedUserWishlist() {
  try {
    const token = await getMyToken();
    if (!token) {
      return { status: "error", message: "Please login to be able to see wishlist!", data: [] };
    }
    const response = await fetch("https://ecommerce.routemisr.com/api/v1/wishlist", {
      method: "GET",
      headers: {
        token,
        "Content-Type": "application/json",
      },
    });

    const payload = await response.json();
    return payload; 
  } catch {
    return { status: "error", message: "Something went wrong while fetching wishlist!" };
  }
}
