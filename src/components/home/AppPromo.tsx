import Image from "next/image";
import { Apple, Play, Smartphone } from "lucide-react";

export function AppPromo() {
  return (
    <section className="px-4 py-12">
      <div className="mx-auto grid max-w-9xl items-center gap-8 rounded-xl border border-[#b9ecff] bg-[#e9fbff] px-7 py-8 md:grid-cols-[1fr_auto]">
        <div>
          <p className="text-[12px] font-extrabold uppercase text-[#195585]">
            For better experience
          </p>
          <h2 className="mt-2 max-w-md text-[28px] font-extrabold leading-tight text-[#101828]">
            Manage Your Finances Anytime, Anywhere
          </h2>
          <p className="mt-3 max-w-xl text-[14px] leading-6 text-[#667085]">
            Track applications, compare products, upload documents, and connect
            with Fintaraa experts from your phone.
          </p>
          <div className="mt-6 flex flex-wrap gap-3">
            {[
              { Icon: Play, label: "Google Play" },
              { Icon: Apple, label: "App Store" },
            ].map(({ Icon, label }) => (
              <button
                key={label}
                className="inline-flex h-11 items-center gap-2 rounded-md bg-[#101828] px-4 text-[12px] font-extrabold text-white"
              >
                <Icon className="h-4 w-4" />
                {label}
              </button>
            ))}
          </div>
        </div>
        <div className="relative hidden h-52 w-80 md:block">
          <div className="absolute left-6 top-2 h-44 w-24 rotate-[-8deg] rounded-3xl border-[7px] border-[#195585] bg-white shadow-xl">
            <Image
              src="/assets/logo/logo.png"
              alt="Fintaraa"
              width={70}
              height={22}
              className="mx-auto mt-8 h-auto w-16"
            />
            <div className="mx-auto mt-7 flex h-16 w-16 items-center justify-center rounded-full bg-[#dcfae6]">
              <span className="text-[18px] font-extrabold text-[#12b76a]">
                78%
              </span>
            </div>
          </div>
          <div className="absolute right-4 top-12 rounded-xl bg-white p-4 shadow-lg">
            <Smartphone className="h-8 w-8 text-[#195585]" />
            <p className="mt-2 text-[12px] font-extrabold text-[#101828]">
              Mobile first
            </p>
          </div>
        </div>
      </div>
    </section>
  );
}
