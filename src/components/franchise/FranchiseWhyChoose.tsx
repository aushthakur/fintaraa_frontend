import Image from "next/image";
import { whyChooseItems } from "./franchiseData";

export function FranchiseWhyChoose() {
  return (
    <section className="bg-[#005ca8] px-4 py-10 text-white md:px-6 lg:px-8">
      <div className="mx-auto max-w-9xl">
        <div className="flex flex-col gap-6 md:flex-row md:items-start md:justify-between">
          <h2 className="text-[28px] font-semibold">Why Choose Fintaraa?</h2>
          <div className="relative hidden h-20 w-50 md:block">
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
        <div className="mt-8 grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-5 xl:gap-x-10 xl:gap-y-8">
          {whyChooseItems.map(({ title, icon: Icon }, index) => (
            <div
              key={`${title}-${index}`}
              className="
flex
h-16.5
items-center
gap-4
rounded-[14px]
bg-white
px-5
text-[#005CA8]
"
            >
              <Icon className="h-5.5 w-5.5 shrink-0 stroke-[1.7]" />
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
