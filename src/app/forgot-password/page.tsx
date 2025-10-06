"use client";

import React, { useState } from "react";
import { useForm, SubmitHandler } from "react-hook-form";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { toast } from "sonner";


interface EmailForm {
  email: string;
}

interface CodeForm {
  code: string;
}

interface PasswordForm {
  password: string;
  confirmPassword: string;
}


interface ApiResponse {
  message?: string;
  statusMsg?: string;
  token?: string;
  [key: string]: unknown; 
}


type Stage = "email" | "verify" | "reset";

export default function ForgotPasswordPage() {
  const [stage, setStage] = useState<Stage>("email");
  const [email, setEmail] = useState<string>("");

  
  const emailForm = useForm<EmailForm>({ defaultValues: { email: "" } });
  const codeForm = useForm<CodeForm>({ defaultValues: { code: "" } });
  const passwordForm = useForm<PasswordForm>({
    defaultValues: { password: "", confirmPassword: "" },
  });

  // ----- المرحلة الأولى: إرسال البريد -----
  const handleSendEmail: SubmitHandler<EmailForm> = async (data) => {
    if (!data.email)
      return toast.error("Email is required", {
        position: "top-center",
        duration: 3000,
      });

    try {
      const res = await fetch(
        "https://ecommerce.routemisr.com/api/v1/auth/forgotPasswords",
        {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ email: data.email }),
        }
      );

      const result: ApiResponse = await res.json();

      if (!res.ok || result.statusMsg === "error")
        throw new Error(result.message || "Failed to send reset code");

      toast.success("Reset code sent to your email!", {
        position: "top-center",
        duration: 3000,
      });

      setEmail(data.email);
      setStage("verify");
    } catch (err: unknown) {
      const message =
        err instanceof Error ? err.message : "Something went wrong";
      toast.error(message, { position: "top-center", duration: 3000 });
    }
  };

  // ----- المرحلة الثانية: التحقق من الكود -----
  const handleVerifyCode: SubmitHandler<CodeForm> = async (data) => {
    if (!data.code)
      return toast.error("Code is required", {
        position: "top-center",
        duration: 3000,
      });

    try {
      const res = await fetch(
        "https://ecommerce.routemisr.com/api/v1/auth/verifyResetCode",
        {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ resetCode: data.code }),
        }
      );

      const result: ApiResponse = await res.json();

      if (!res.ok || result.statusMsg === "error")
        throw new Error(result.message || "Invalid code");

      toast.success("Code verified! Enter new password.", {
        position: "top-center",
        duration: 3000,
      });
      setStage("reset");
    } catch (err: unknown) {
      const message =
        err instanceof Error ? err.message : "Invalid code";
      toast.error(message, { position: "top-center", duration: 3000 });
    }
  };

  // ----- المرحلة الثالثة: تعيين كلمة المرور الجديدة -----
  const handleResetPassword: SubmitHandler<PasswordForm> = async (data) => {
    if (!data.password || !data.confirmPassword)
      return toast.error("Fill all fields", {
        position: "top-center",
        duration: 3000,
      });

    if (data.password !== data.confirmPassword)
      return toast.error("Passwords do not match", {
        position: "top-center",
        duration: 3000,
      });

    try {
      const res = await fetch(
        "https://ecommerce.routemisr.com/api/v1/auth/resetPassword",
        {
          method: "PUT",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ email, newPassword: data.password }),
        }
      );

      const result: ApiResponse = await res.json();

      if (!res.ok || result.statusMsg === "error")
        throw new Error(result.message || "Failed to reset password");

      toast.success("Password reset successfully!", {
        position: "top-center",
        duration: 3000,
      });
      window.location.href = "/login";
    } catch (err: unknown) {
      const message =
        err instanceof Error ? err.message : "Failed to reset password";
      toast.error(message, { position: "top-center", duration: 3000 });
    }
  };

  // ----- واجهة المستخدم -----
  return (
    <div className="w-1/2 mx-auto my-12">
      <h1 className="text-2xl font-bold text-green-500 text-center mb-6">
        Forget Password
      </h1>

      {stage === "email" && (
        <form onSubmit={emailForm.handleSubmit(handleSendEmail)}>
          <Input
            type="email"
            placeholder="Enter your email"
            {...emailForm.register("email", { required: true })}
          />
          <Button className="mt-4 w-full bg-green-500 hover:bg-green-700">
            Reset Code
          </Button>
        </form>
      )}

      {stage === "verify" && (
        <form onSubmit={codeForm.handleSubmit(handleVerifyCode)}>
          <Input
            type="text"
            placeholder="Enter code from email"
            {...codeForm.register("code", { required: true })}
          />
          <Button className="mt-4 w-full bg-green-500 hover:bg-green-700">
            Verify Code
          </Button>
        </form>
      )}

      {stage === "reset" && (
        <form onSubmit={passwordForm.handleSubmit(handleResetPassword)}>
          <Input
            type="password"
            placeholder="Enter new password"
            {...passwordForm.register("password", {
              required: true,
              minLength: 6,
            })}
          />
          <Input
            type="password"
            placeholder="Confirm new password"
            {...passwordForm.register("confirmPassword", {
              required: true,
              minLength: 6,
            })}
            className="mt-2"
          />
          <Button className="mt-4 w-full bg-green-500 hover:bg-green-700">
            Reset Password
          </Button>
        </form>
      )}
    </div>
  );
}
