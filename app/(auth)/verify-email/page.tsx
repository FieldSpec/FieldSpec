"use client";

import { Suspense, useEffect, useState } from "react";
import Link from "next/link";
import { useSearchParams } from "next/navigation";
import { ProgressBar, LoadingCard } from "@/lib/components/loading";

function VerifyEmailForm() {
  const [status, setStatus] = useState<"loading" | "success" | "error">("loading");
  const [message, setMessage] = useState("");
  const searchParams = useSearchParams();
  const token = searchParams.get("token");

  useEffect(() => {
    if (!token) {
      setStatus("error");
      setMessage("Missing verification token");
      return;
    }

    fetch(`/api/auth/verify-email?token=${token}`)
      .then((res) => res.json())
      .then((data) => {
        if (data.data) {
          setStatus("success");
          setMessage(data.data.message || "Email verified successfully");
        } else {
          setStatus("error");
          setMessage(data.error?.message || "Verification failed");
        }
      })
      .catch(() => {
        setStatus("error");
        setMessage("Something went wrong");
      });
  }, [token]);

  if (status === "loading") {
    return (
      <div className="w-full max-w-[400px] p-lg bg-surface rounded-md">
        <LoadingCard message="Verifying your email..." />
      </div>
    );
  }

  if (status === "success") {
    return (
      <div className="w-full max-w-[400px] p-lg bg-surface rounded-md">
        <div className="text-center">
          <div 
            className="mb-md rounded-full inline-flex items-center justify-center"
            style={{ 
              width: "64px", 
              height: "64px", 
              backgroundColor: "var(--sys-primary)",
              color: "var(--sys-on-primary)",
            }}
          >
            <span className="material-icons" style={{ fontSize: "32px" }}>check</span>
          </div>
          <h1 className="text-center mb-xs text-on-surface tracking-normal" style={{ fontSize: "28px", fontWeight: "600", lineHeight: "36px" }}>
            Email Verified
          </h1>
          <p className="text-center mb-lg text-on-surface-variant text-body-medium">
            {message}
          </p>
          <Link
            href="/login"
            className="text-primary text-body-medium"
          >
            Go to Login
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="w-full max-w-[400px] p-lg bg-surface rounded-md">
      <div className="text-center">
        <div className="mb-md text-4xl">✕</div>
        <h1 className="text-center mb-xs text-on-surface tracking-normal" style={{ fontSize: "28px", fontWeight: "600", lineHeight: "36px" }}>
          Verification Failed
        </h1>
        <p className="text-center mb-lg text-on-surface-variant text-body-medium">
          {message}
        </p>
        <Link
          href="/signup"
          className="text-primary text-body-medium"
        >
          Sign Up Again
        </Link>
      </div>
    </div>
  );
}

function LoadingState() {
  return (
    <div className="w-full max-w-[400px] p-lg bg-surface rounded-md">
      <LoadingCard message="Verifying your email..." />
    </div>
  );
}

export default function VerifyEmailPage() {
  return (
    <Suspense fallback={<LoadingState />}>
      <VerifyEmailForm />
    </Suspense>
  );
}