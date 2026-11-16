import type { Metadata } from "next";
import { PageHeader } from "@/components/ui/PageHeader";
import { ContactForm } from "@/components/forms/ContactForm";
import { DemoNotice } from "@/components/ui/DemoNotice";

export const metadata: Metadata = {
  title: "Contact",
  description: "Demo contact form for the VÉLOR portfolio concept. Messages are not sent.",
};

export default function ContactPage() {
  return (
    <>
      <PageHeader
        eyebrow="Client care"
        title="Contact"
        crumbs={[{ label: "Home", href: "/" }, { label: "Contact" }]}
        intro="Questions about a piece, sizing or straps? In a live store, our concierge would answer here."
      />
      <div className="container-luxe grid gap-12 py-16 md:grid-cols-[1fr_1.4fr] md:gap-20 md:py-24">
        <div className="space-y-8">
          <div>
            <h2 className="eyebrow text-stone">Email</h2>
            <p className="mt-2 font-serif text-xl">hello@velor.example</p>
            <p className="mt-1 text-xs text-stone">Placeholder address — not monitored.</p>
          </div>
          <div>
            <h2 className="eyebrow text-stone">Studio</h2>
            <p className="mt-2 font-serif text-xl">A fictional atelier</p>
            <p className="mt-1 text-xs text-stone">VÉLOR has no physical location.</p>
          </div>
          <DemoNotice>This form is a simulation. Messages are validated in your browser but never sent or stored.</DemoNotice>
        </div>
        <ContactForm />
      </div>
    </>
  );
}
