"use client";

import { useId, useState } from "react";
import { ArrowRight } from "lucide-react";

const EMAIL = /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/;

/**
 * Frontend-only newsletter field. No email service is connected, so a valid address is
 * acknowledged honestly as "not sent or stored" rather than "subscribed".
 */
export function FooterNewsletter() {
  const id = useId();
  const [email, setEmail] = useState("");
  const [status, setStatus] = useState<"idle" | "error" | "demo">("idle");

  const submit = (e: React.FormEvent) => {
    e.preventDefault();
    setStatus(EMAIL.test(email.trim()) ? "demo" : "error");
  };

  return (
    <form onSubmit={submit} noValidate className="mx-auto mt-10 w-full max-w-[600px]" aria-label="Newsletter (demo)">
      <label htmlFor={`${id}-email`} className="sr-only">
        Email address
      </label>
      <div className="flex h-16 border border-[#C8A46A] bg-black/40 backdrop-blur-sm transition-colors focus-within:border-[#E0C28F]">
        <input
          id={`${id}-email`}
          type="email"
          inputMode="email"
          autoComplete="email"
          value={email}
          onChange={(e) => {
            setEmail(e.target.value);
            if (status !== "idle") setStatus("idle");
          }}
          placeholder="Enter your email"
          aria-invalid={status === "error"}
          aria-describedby={`${id}-msg`}
          className="min-w-0 flex-1 bg-transparent px-6 text-[0.95rem] text-[#F5F2ED] outline-none placeholder:text-[#B8B5B0]"
        />
        <button
          type="submit"
          aria-label="Subscribe (demo)"
          className="grid w-16 shrink-0 place-items-center bg-[#C8A46A] text-[#080808] transition-colors duration-300 hover:bg-[#D9BB86] focus-visible:bg-[#D9BB86] sm:w-[70px]"
        >
          <ArrowRight className="size-5" strokeWidth={1.5} />
        </button>
      </div>
      <p id={`${id}-msg`} role="status" className="mt-3 min-h-5 text-center text-xs text-[#B8B5B0]">
        {status === "error" && <span className="text-[#E7A79A]">Please enter a valid email address.</span>}
        {status === "demo" && "Thanks — this is a demo, so your email was not sent or stored."}
        {status === "idle" && "Demo only: newsletter sign-up isn't connected to an email service."}
      </p>
    </form>
  );
}
