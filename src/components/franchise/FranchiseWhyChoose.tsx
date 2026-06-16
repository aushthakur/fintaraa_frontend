import Image from "next/image";
import { whyChooseItems } from "./franchiseData";

export function FranchiseWhyChoose() {
  return (
    <section className="bg-[#005ca8] px-4 py-10 text-white md:px-6 lg:px-8">
      <div className="mx-auto max-w-9xl">
        <div className="flex items-start justify-between gap-6">
          <h2 className="text-[28px] font-semibold">Why Choose Fintaraa?</h2>
          <div className="relative hidden h-[80px] w-[200px] md:block">
            <Image
              src="/assets/images/security.png"
              alt="Fintaraa compliance badges"
              fill
              unoptimized
              className="object-contain object-right"
            />
          </div>
        </div>

        {/* 10 chips in 2 rows of 5 */}
        <div className="mt-8 grid grid-cols-5 gap-x-10 gap-y-8">
          {whyChooseItems.map(({ title, icon: Icon }, index) => (
            <div
              key={`${title}-${index}`}
              className="
flex
h-[66px]
items-center
gap-4
rounded-[14px]
bg-white
px-5
text-[#005CA8]
"
            >
              <Icon className="h-[22px] w-[22px] shrink-0 stroke-[1.7]" />
              <span className="text-[13px] font-medium leading-[18px]">
                {title}
              </span>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
