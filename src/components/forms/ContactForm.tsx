"use client";

import { useState } from "react";
import { AnimatePresence, motion } from "motion/react";
import { ArrowRight, Check } from "lucide-react";
import { Field, SelectField } from "@/components/checkout/Field";

const EMAIL = /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/;
const TOPICS = ["Product question", "Sizing & straps", "Press & partnerships", "Something else"];

type Form = { name: string; email: string; topic: string; message: string };
type Errors = Partial<Record<keyof Form, string>>;

export function ContactForm() {
  const [form, setForm] = useState<Form>({ name: "", email: "", topic: TOPICS[0], message: "" });
  const [errors, setErrors] = useState<Errors>({});
  const [sent, setSent] = useState(false);

  const set = (k: keyof Form, v: string) => {
    setForm((f) => ({ ...f, [k]: v }));
    if (errors[k]) setErrors((e) => ({ ...e, [k]: undefined }));
  };

  const submit = (e: React.FormEvent) => {
    e.preventDefault();
    const errs: Errors = {};
    if (!form.name.trim()) errs.name = "Please enter your name.";
    if (!EMAIL.test(form.email.trim())) errs.email = "Enter a valid email address.";
    if (form.message.trim().length < 10) errs.message = "Message should be at least 10 characters.";
    setErrors(errs);
    const first = Object.keys(errs)[0];
    if (first) {
      document.getElementById(`ct-${first}`)?.focus();
      return;
    }
    setSent(true); // Simulation only — nothing is transmitted.
  };

  return (
    <AnimatePresence mode="wait">
      {sent ? (
        <motion.div key="sent" role="status" initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} className="border border-obsidian/10 bg-white/50 p-8 md:p-10">
          <span className="grid size-12 place-items-center rounded-full bg-champagne text-[#0B0B0B]">
            <Check className="size-5" />
          </span>
          <h2 className="mt-6 font-serif text-3xl">Thank you, {form.name.split(" ")[0]}</h2>
          <p className="mt-3 leading-relaxed text-stone">
            This is a demo, so your message was <strong className="font-medium text-obsidian">not sent</strong>. In a live
            build, it would reach the VÉLOR concierge team.
          </p>
          <button
            type="button"
            className="btn btn-outline-dark mt-8"
            onClick={() => {
              setSent(false);
              setForm({ name: "", email: "", topic: TOPICS[0], message: "" });
            }}
          >
            Write another message
          </button>
        </motion.div>
      ) : (
        <motion.form key="form" onSubmit={submit} noValidate exit={{ opacity: 0, y: -12 }} className="space-y-5" aria-label="Contact form (demo)">
          <div className="grid gap-5 sm:grid-cols-2">
            <Field id="ct-name" label="Name" autoComplete="name" value={form.name} onChange={(v) => set("name", v)} error={errors.name} required />
            <Field id="ct-email" label="Email" type="email" autoComplete="email" value={form.email} onChange={(v) => set("email", v)} error={errors.email} required />
          </div>
          <SelectField id="ct-topic" label="Topic" value={form.topic} onChange={(v) => set("topic", v)} options={TOPICS} />
          <Field id="ct-message" label="Message" multiline value={form.message} onChange={(v) => set("message", v)} error={errors.message} required />
          <button type="submit" className="btn btn-dark">
            Send message (demo) <ArrowRight className="btn-arrow size-4" />
          </button>
        </motion.form>
      )}
    </AnimatePresence>
  );
}
