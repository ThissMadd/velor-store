import Link from "next/link";
import { ArrowRight } from "lucide-react";

export default function NotFound() {
  return (
    <section className="relative isolate overflow-hidden bg-obsidian text-ivory">
      <div className="container-luxe flex min-h-[70vh] flex-col items-center justify-center py-24 text-center">
        <p aria-hidden className="font-serif text-[clamp(7rem,22vw,16rem)] leading-none text-ivory/[0.06] select-none">
          404
        </p>
        <h1 className="-mt-10 font-serif text-4xl md:-mt-16 md:text-5xl">This moment has passed</h1>
        <p className="mt-4 max-w-md text-ivory/65">
          The page you&apos;re looking for doesn&apos;t exist or has moved. Let us guide you back.
        </p>
        <div className="mt-10 flex flex-col gap-3 sm:flex-row">
          <Link href="/" className="btn btn-light">
            Return home <ArrowRight className="btn-arrow size-4" />
          </Link>
          <Link href="/shop" className="btn btn-outline-light">
            Shop all watches
          </Link>
        </div>
      </div>
    </section>
  );
}
