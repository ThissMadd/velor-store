"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { AnimatePresence, motion } from "motion/react";
import { ArrowLeft, ArrowRight, Lock } from "lucide-react";
import { colorLabel, productImages, strapLabel } from "@/data/products";
import { saveDemoOrder, useCart, useCartHydrated, useCartLines, useCartTotals } from "@/lib/store";
import { formatPrice } from "@/lib/format";
import { DemoNotice } from "@/components/ui/DemoNotice";
import { Img } from "@/components/ui/Img";
import { Stepper } from "./Stepper";
import { Field, SelectField } from "./Field";

const STEPS = ["Information", "Shipping", "Review"] as const;

export const SHIPPING_METHODS = [
  { id: "standard", label: "Standard (simulated)", detail: "Illustrative 3–5 business days", cost: 0 },
  { id: "express", label: "Express (simulated)", detail: "Illustrative 1–2 business days", cost: 25 },
] as const;

const COUNTRIES = ["United States", "United Kingdom", "Canada", "France", "Germany", "Morocco", "United Arab Emirates", "Japan", "Australia", "Other"];

interface FormState {
  email: string;
  phone: string;
  firstName: string;
  lastName: string;
  address: string;
  apartment: string;
  city: string;
  postalCode: string;
  country: string;
  shipping: (typeof SHIPPING_METHODS)[number]["id"];
  acknowledge: boolean;
}

type Errors = Partial<Record<keyof FormState, string>>;

const EMAIL = /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/;

function validate(step: number, f: FormState): Errors {
  const e: Errors = {};
  if (step === 0) {
    if (!f.email.trim()) e.email = "Email is required.";
    else if (!EMAIL.test(f.email.trim())) e.email = "Enter a valid email address.";
    if (f.phone.trim() && !/^[+\d][\d\s().-]{6,}$/.test(f.phone.trim())) e.phone = "Enter a valid phone number or leave blank.";
  }
  if (step === 1) {
    if (!f.firstName.trim()) e.firstName = "First name is required.";
    if (!f.lastName.trim()) e.lastName = "Last name is required.";
    if (f.address.trim().length < 5) e.address = "Enter a street address.";
    if (!f.city.trim()) e.city = "City is required.";
    if (!/^[A-Za-z0-9][A-Za-z0-9\s-]{2,9}$/.test(f.postalCode.trim())) e.postalCode = "Enter a valid postal code.";
    if (!f.country) e.country = "Choose a country.";
  }
  if (step === 2 && !f.acknowledge) e.acknowledge = "Please confirm you understand this is a demo.";
  return e;
}

export function CheckoutFlow() {
  const router = useRouter();
  const hydrated = useCartHydrated();
  const lines = useCartLines();
  const { subtotal } = useCartTotals();
  const clear = useCart((s) => s.clear);
  const [step, setStep] = useState(0);
  const [dir, setDir] = useState(1);
  const [submitting, setSubmitting] = useState(false);
  const [errors, setErrors] = useState<Errors>({});
  const [form, setForm] = useState<FormState>({
    email: "",
    phone: "",
    firstName: "",
    lastName: "",
    address: "",
    apartment: "",
    city: "",
    postalCode: "",
    country: "United States",
    shipping: "standard",
    acknowledge: false,
  });

  const method = SHIPPING_METHODS.find((m) => m.id === form.shipping)!;
  const total = subtotal + method.cost;

  const set = <K extends keyof FormState>(key: K, value: FormState[K]) => {
    setForm((f) => ({ ...f, [key]: value }));
    if (errors[key]) setErrors((e) => ({ ...e, [key]: undefined }));
  };

  const focusFirstError = (errs: Errors) => {
    const first = Object.keys(errs)[0];
    if (first) window.requestAnimationFrame(() => document.getElementById(`co-${first}`)?.focus());
  };

  const next = (e: React.FormEvent) => {
    e.preventDefault();
    const errs = validate(step, form);
    setErrors(errs);
    if (Object.keys(errs).length) {
      focusFirstError(errs);
      return;
    }
    if (step < 2) {
      setDir(1);
      setStep(step + 1);
      window.scrollTo({ top: 0, behavior: "smooth" });
      return;
    }
    placeDemoOrder();
  };

  const back = () => {
    setDir(-1);
    setErrors({});
    setStep((s) => Math.max(0, s - 1));
  };

  const placeDemoOrder = () => {
    setSubmitting(true);
    const number = `VLR-DEMO-${Math.random().toString(36).slice(2, 8).toUpperCase()}`;
    saveDemoOrder({
      number,
      createdAt: new Date().toISOString(),
      email: form.email.trim(),
      name: `${form.firstName.trim()} ${form.lastName.trim()}`,
      city: form.city.trim(),
      country: form.country,
      shippingMethod: method.label,
      shippingCost: method.cost,
      subtotal,
      total,
      lines: lines.map((l) => ({
        name: l.product.name,
        color: colorLabel(l.product, l.color),
        strap: strapLabel(l.product, l.strap),
        quantity: l.quantity,
        price: l.product.price,
        image: productImages(l.product, l.color, l.strap)[0],
      })),
    });
    // Simulated processing delay for a realistic feel — nothing leaves the browser.
    window.setTimeout(() => {
      router.push("/checkout/confirmation");
      clear();
    }, 1100);
  };

  if (!hydrated) return <div className="container-luxe min-h-[60vh]" aria-busy="true" />;

  if (lines.length === 0 && !submitting) {
    return (
      <div className="container-luxe flex min-h-[60vh] flex-col items-center justify-center py-20 text-center">
        <h1 className="font-serif text-4xl">Your cart is empty</h1>
        <p className="mt-3 text-stone">Add a watch to try the demo checkout.</p>
        <Link href="/shop" className="btn btn-dark mt-8">
          Shop all watches <ArrowRight className="btn-arrow size-4" />
        </Link>
      </div>
    );
  }

  return (
    <div className="container-luxe py-10 md:py-14">
      <div className="grid gap-10 lg:grid-cols-[1fr_420px] lg:gap-16">
        <div className="min-w-0">
          <h1 className="font-serif text-4xl md:text-5xl">Checkout</h1>
          <DemoNotice className="mt-5">
            <strong className="font-medium">Demo checkout.</strong> This is a portfolio simulation: no payment is taken,
            no card details are requested and no real order is created. Information you enter stays in this browser tab.
          </DemoNotice>

          <Stepper steps={STEPS} current={step} className="mt-10" />

          <form onSubmit={next} noValidate className="mt-10" aria-labelledby="step-title">
            <AnimatePresence mode="wait" custom={dir} initial={false}>
              <motion.div
                key={step}
                custom={dir}
                initial={{ opacity: 0, x: dir * 32 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: dir * -32 }}
                transition={{ duration: 0.45, ease: [0.22, 1, 0.36, 1] }}
              >
                {step === 0 && (
                  <fieldset className="space-y-5">
                    <legend id="step-title" className="mb-6 font-serif text-2xl">
                      Contact Information
                    </legend>
                    <Field id="co-email" label="Email address" type="email" autoComplete="email" inputMode="email" value={form.email} onChange={(v) => set("email", v)} error={errors.email} required />
                    <Field id="co-phone" label="Phone (optional)" type="tel" autoComplete="tel" inputMode="tel" value={form.phone} onChange={(v) => set("phone", v)} error={errors.phone} />
                  </fieldset>
                )}

                {step === 1 && (
                  <div className="space-y-10">
                    <fieldset className="space-y-5">
                      <legend id="step-title" className="mb-6 font-serif text-2xl">
                        Shipping Address
                      </legend>
                      <div className="grid gap-5 sm:grid-cols-2">
                        <Field id="co-firstName" label="First name" autoComplete="given-name" value={form.firstName} onChange={(v) => set("firstName", v)} error={errors.firstName} required />
                        <Field id="co-lastName" label="Last name" autoComplete="family-name" value={form.lastName} onChange={(v) => set("lastName", v)} error={errors.lastName} required />
                      </div>
                      <Field id="co-address" label="Address" autoComplete="address-line1" value={form.address} onChange={(v) => set("address", v)} error={errors.address} required />
                      <Field id="co-apartment" label="Apartment, suite (optional)" autoComplete="address-line2" value={form.apartment} onChange={(v) => set("apartment", v)} />
                      <div className="grid gap-5 sm:grid-cols-3">
                        <Field id="co-city" label="City" autoComplete="address-level2" value={form.city} onChange={(v) => set("city", v)} error={errors.city} required />
                        <Field id="co-postalCode" label="Postal code" autoComplete="postal-code" value={form.postalCode} onChange={(v) => set("postalCode", v)} error={errors.postalCode} required />
                        <SelectField id="co-country" label="Country" autoComplete="country-name" value={form.country} onChange={(v) => set("country", v)} options={COUNTRIES} error={errors.country} />
                      </div>
                    </fieldset>

                    <fieldset>
                      <legend className="mb-4 font-serif text-2xl">Shipping Method</legend>
                      <div className="space-y-3">
                        {SHIPPING_METHODS.map((m) => (
                          <label key={m.id} className="flex cursor-pointer items-center gap-4 border border-obsidian/15 bg-white/50 p-4 transition-colors has-[:checked]:border-obsidian has-[:focus-visible]:outline-2 has-[:focus-visible]:outline-champagne">
                            <input type="radio" name="shipping" value={m.id} checked={form.shipping === m.id} onChange={() => set("shipping", m.id)} className="size-4 accent-obsidian" />
                            <span className="flex-1">
                              <span className="block text-sm font-medium">{m.label}</span>
                              <span className="block text-xs text-stone">{m.detail}</span>
                            </span>
                            <span className="text-sm tabular-nums">{m.cost === 0 ? "Free" : formatPrice(m.cost)}</span>
                          </label>
                        ))}
                      </div>
                      <p className="mt-3 text-xs text-stone">Shipping options are illustrative. Nothing will be shipped.</p>
                    </fieldset>
                  </div>
                )}

                {step === 2 && (
                  <div>
                    <h2 id="step-title" className="mb-6 font-serif text-2xl">
                      Review Your Order
                    </h2>
                    <dl className="divide-y divide-obsidian/10 border border-obsidian/10 bg-white/50 text-sm">
                      <ReviewRow label="Contact" value={form.email + (form.phone ? ` · ${form.phone}` : "")} onEdit={() => { setDir(-1); setStep(0); }} />
                      <ReviewRow
                        label="Ship to"
                        value={`${form.firstName} ${form.lastName}, ${form.address}${form.apartment ? `, ${form.apartment}` : ""}, ${form.city} ${form.postalCode}, ${form.country}`}
                        onEdit={() => { setDir(-1); setStep(1); }}
                      />
                      <ReviewRow label="Method" value={`${method.label} · ${method.cost === 0 ? "Free" : formatPrice(method.cost)}`} onEdit={() => { setDir(-1); setStep(1); }} />
                      <div className="flex gap-4 p-4">
                        <dt className="w-20 shrink-0 text-stone">Payment</dt>
                        <dd className="flex items-center gap-2 text-stone">
                          <Lock className="size-3.5" strokeWidth={1.6} /> Not collected — demo checkout
                        </dd>
                      </div>
                    </dl>

                    <label className="mt-6 flex cursor-pointer items-start gap-3 text-sm">
                      <input
                        id="co-acknowledge"
                        type="checkbox"
                        checked={form.acknowledge}
                        onChange={(e) => set("acknowledge", e.target.checked)}
                        aria-invalid={Boolean(errors.acknowledge)}
                        aria-describedby={errors.acknowledge ? "co-acknowledge-error" : undefined}
                        className="mt-0.5 size-4 shrink-0 accent-obsidian"
                      />
                      <span>I understand this is a portfolio demo: no payment will be taken and no real order will be placed.</span>
                    </label>
                    {errors.acknowledge && (
                      <p id="co-acknowledge-error" className="field-error">
                        {errors.acknowledge}
                      </p>
                    )}
                  </div>
                )}
              </motion.div>
            </AnimatePresence>

            <div className="mt-10 flex flex-col-reverse gap-3 sm:flex-row sm:items-center sm:justify-between">
              {step > 0 ? (
                <button type="button" onClick={back} className="link-underline min-h-11 self-start text-sm">
                  <ArrowLeft className="size-4" /> Back
                </button>
              ) : (
                <Link href="/cart" className="link-underline min-h-11 self-start text-sm">
                  <ArrowLeft className="size-4" /> Return to cart
                </Link>
              )}
              <button type="submit" disabled={submitting} className="btn btn-dark sm:min-w-64">
                {submitting ? (
                  <>
                    <span aria-hidden className="size-4 animate-spin rounded-full border-2 border-ivory/30 border-t-ivory" />
                    Simulating order…
                  </>
                ) : step === 2 ? (
                  <>
                    Place demo order <ArrowRight className="btn-arrow size-4" />
                  </>
                ) : (
                  <>
                    Continue to {STEPS[step + 1].toLowerCase()} <ArrowRight className="btn-arrow size-4" />
                  </>
                )}
              </button>
            </div>
          </form>
        </div>

        <aside aria-labelledby="co-summary" className="h-fit border border-obsidian/10 bg-white/50 p-6 md:p-8 lg:sticky lg:top-32">
          <h2 id="co-summary" className="font-serif text-xl">
            Order Summary
          </h2>
          <ul className="mt-6 space-y-4">
            {lines.map((l) => (
              <li key={l.id} className="flex items-center gap-4">
                <div className="relative aspect-[4/5] w-16 shrink-0 overflow-hidden bg-ivory-deep">
                  <Img src={productImages(l.product, l.color, l.strap)[0]} alt="" fill sizes="64px" className="object-cover" />
                  <span className="absolute top-1 right-1 grid size-5 place-items-center rounded-full bg-champagne text-[0.62rem] text-[#0B0B0B]">{l.quantity}</span>
                </div>
                <div className="min-w-0 flex-1">
                  <p className="truncate font-serif">{l.product.name}</p>
                  <p className="text-xs text-stone">
                    {colorLabel(l.product, l.color)} / {strapLabel(l.product, l.strap)}
                  </p>
                </div>
                <p className="text-sm tabular-nums">{formatPrice(l.lineTotal)}</p>
              </li>
            ))}
          </ul>
          <dl className="mt-6 space-y-3 border-t border-obsidian/10 pt-6 text-sm">
            <div className="flex justify-between">
              <dt className="text-stone">Subtotal</dt>
              <dd className="tabular-nums">{formatPrice(subtotal)}</dd>
            </div>
            <div className="flex justify-between">
              <dt className="text-stone">Shipping (simulated)</dt>
              <dd className="tabular-nums">{step >= 1 ? (method.cost === 0 ? "Free" : formatPrice(method.cost)) : "Next step"}</dd>
            </div>
            <div className="flex items-baseline justify-between border-t border-obsidian/10 pt-4">
              <dt className="font-medium">Total</dt>
              <dd className="font-serif text-2xl tabular-nums">{formatPrice(step >= 1 ? total : subtotal)}</dd>
            </div>
          </dl>
          <p className="mt-4 text-xs text-stone">Illustrative prices in USD. Taxes are not calculated in this demo.</p>
        </aside>
      </div>
    </div>
  );
}

function ReviewRow({ label, value, onEdit }: { label: string; value: string; onEdit: () => void }) {
  return (
    <div className="flex gap-4 p-4">
      <dt className="w-20 shrink-0 text-stone">{label}</dt>
      <dd className="min-w-0 flex-1 break-words">{value}</dd>
      <dd>
        <button type="button" onClick={onEdit} className="link-underline text-xs" aria-label={`Edit ${label.toLowerCase()}`}>
          Edit
        </button>
      </dd>
    </div>
  );
}
