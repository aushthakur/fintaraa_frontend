import { AuthRedirectLink } from "@/components/auth/AuthRedirectLink";
import { getApplyHref } from "@/components/application/flowRegistry";
import { BankLogoImage } from "@/components/common/BankLogoImage";

const planRows = [
  [
    "HDFC ERGO",
    "/assets/banks/hdfc.png",
    "₹450 - ₹1200",
    "Up to 2%",
    "₹10 Lac",
    "60 Years",
  ],
  [
    "ICICI Lombard",
    "/assets/banks/icici.png",
    "₹520 - ₹1500",
    "Up to 2.5%",
    "₹25 Lac",
    "65 Years",
  ],
  [
    "PNB MetLife",
    "/assets/banks/pnb.png",
    "₹430 - ₹1000",
    "Up to 1.5%",
    "₹50 Lac",
    "70 Years",
  ],
  [
    "Kotak",
    "/assets/banks/kotak.png",
    "₹480 - ₹1300",
    "Up to 2%",
    "₹20 Lac",
    "65 Years",
  ],
  [
    "Tata Capital",
    "/assets/banks/indian.png",
    "₹500 - ₹1600",
    "Up to 2%",
    "₹1 Cr",
    "70 Years",
  ],
];

interface InsuranceComparePlansProps {
  insuranceType: string;
  insuranceTypeSlug: string;
}

export function InsuranceComparePlans({
  insuranceType,
  insuranceTypeSlug,
}: InsuranceComparePlansProps) {
  const applyHref = getApplyHref({
    category: "insurance",
    productSlug: insuranceTypeSlug,
    referrer: `/products/${insuranceTypeSlug}`,
  });

  return (
    <section className="px-4 py-10 md:px-6 lg:px-8">
      <div className="mx-auto max-w-9xl text-center">
        <h2 className="text-[24px] font-extrabold text-[#111827]">
          Compare Top {insuranceType} Plans
        </h2>
        <p className="mt-2 text-[12px] font-semibold text-[#667085]">
          Compare plan information and continue with guided assistance.
        </p>
        <div className="mt-6 overflow-x-auto rounded-lg border border-[#e5eaf0] text-left">
          <table className="w-full min-w-180 border-collapse bg-white text-[12px]">
            <thead className="bg-[#f2f5f8]">
              <tr>
                {[
                  "Insurer",
                  "Annual Premium",
                  "Processing Fee",
                  "Max Cover",
                  "Max Tenure",
                  "Action",
                ].map((heading) => (
                  <th key={heading} className="px-4 py-3 font-extrabold">
                    {heading}
                  </th>
                ))}
              </tr>
            </thead>
            <tbody>
              {planRows.map(([name, logo, premium, fee, cover, tenure]) => (
                <tr key={name} className="border-t border-[#edf2f7]">
                  <td className="px-4 py-3">
                    <BankLogoImage
                      src={logo}
                      alt={name}
                      className="h-7 w-24"
                      imageClassName="object-left"
                    />
                  </td>
                  <td className="px-4 py-3 font-semibold">{premium}</td>
                  <td className="px-4 py-3 font-semibold">{fee}</td>
                  <td className="px-4 py-3 font-semibold">{cover}</td>
                  <td className="px-4 py-3 font-semibold">{tenure}</td>
                  <td className="px-4 py-3">
                    <AuthRedirectLink
                      href={applyHref}
                      productSlug={insuranceTypeSlug}
                      className="rounded-full  bg-linear-to-r from-[#0fae5e] to-[#17cb70] px-3 py-1.5 text-[11px] font-extrabold text-white no-underline"
                    >
                      Apply Now
                    </AuthRedirectLink>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </section>
  );
}
