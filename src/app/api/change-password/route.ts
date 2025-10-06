
import { NextRequest, NextResponse } from "next/server";
import getMyToken from "@/src/utilities/getMyToken";

type ChangePasswordBody = {
  currentPassword: string;
  password: string;
  rePassword: string;
};

type ApiSuccessResponse = {
  status: string;
  token?: string; 
  message?: string;
};

type ApiErrorResponse = {
  statusMsg?: string;
  message?: string;
  errors?: Record<string, string>;
};

export async function PUT(req: NextRequest) {
  try {
    const token = await getMyToken();
    if (!token) {
      return NextResponse.json(
        { message: "Not logged in" },
        { status: 401 }
      );
    }

 
    const body: ChangePasswordBody = await req.json();

    const res = await fetch(
      "https://ecommerce.routemisr.com/api/v1/users/changeMyPassword",
      {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
          token: token,
        },
        body: JSON.stringify(body),
      }
    );

    const result: ApiSuccessResponse | ApiErrorResponse = await res.json();

    return NextResponse.json(result, { status: res.status });
  } catch (err: unknown) {
    const message =
      err instanceof Error ? err.message : "Unexpected server error";
    return NextResponse.json({ message }, { status: 500 });
  }
}
