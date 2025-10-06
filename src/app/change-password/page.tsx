"use client";

import React from "react";
import { useForm, SubmitHandler, UseFormReturn } from "react-hook-form";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { toast } from "sonner";


export interface ChangePasswordForm {
  currentPassword: string;
  password: string;
  rePassword: string;
}


export type ChangePasswordResponse =
  | {
      status: string; 
      message?: string;
      token?: string; 
    }
  | {
      statusMsg?: string;
      message?: string;
      errors?: Record<string, string>;
    };


export type ApiError = {
  message: string;
};

export default function ChangePasswordPage() {
  const form: UseFormReturn<ChangePasswordForm> = useForm<ChangePasswordForm>({
    defaultValues: {
      currentPassword: "",
      password: "",
      rePassword: "",
    },
  });

  const handleChangePassword: SubmitHandler<ChangePasswordForm> = async (data) => {
    if (data.password !== data.rePassword) {
      toast.error("Passwords do not match");
      return;
    }

    try {
      const res = await fetch("/api/change-password", {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(data),
      });

      const result: ChangePasswordResponse = await res.json();

      if (!res.ok) {
        const errorMessage =
          (result as { message?: string }).message || "Failed to change password";
        throw new Error(errorMessage);
      }

      toast.success("Password updated successfully!");
      form.reset();
    } catch (err: unknown) {
      const message =
        err instanceof Error ? err.message : "Failed to change password";
      toast.error(message);
    }
  };

  return (
    <div className="w-1/2 mx-auto my-12">
      <h1 className="text-3xl font-bold text-green-500 text-center mb-6">
        Update Password
      </h1>

      <form onSubmit={form.handleSubmit(handleChangePassword)}>
        <Input
          type="password"
          placeholder="Current Password"
          {...form.register("currentPassword", { required: true })}
          className="mb-2"
        />
        <Input
          type="password"
          placeholder="New Password"
          {...form.register("password", { required: true, minLength: 6 })}
          className="mb-2"
        />
        <Input
          type="password"
          placeholder="Confirm New Password"
          {...form.register("rePassword", { required: true, minLength: 6 })}
          className="mb-2"
        />
        <Button
          type="submit"
          className="mt-4 w-full text-lg bg-green-500 hover:bg-green-700"
        >
          Update Password
        </Button>
      </form>
    </div>
  );
}
