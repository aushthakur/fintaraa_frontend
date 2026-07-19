import { AccountMenu } from "./AccountMenu";
import { ProfileSummary } from "./ProfileSummary";
import { AccountDetailPanel } from "./AccountDetailPanel";
import { AccountMobileMenu } from "./AccountMobileMenu";

export function AccountProfilePage({ activeSlug }: { activeSlug?: string }) {
  return (
    <main className="h-auto bg-gray-100 xl:h-[calc(100dvh-6.75rem)] xl:overflow-hidden">
      <div className="mx-auto h-full max-w-9xl">
        {/* <div className="mb-6 flex flex-col gap-3 md:flex-row md:items-end md:justify-between">
          <div>
            <p className="text-[12px] font-extrabold uppercase tracking-[0.18em] text-[#195585]">
              Profile & Settings
            </p>
            <h1 className="mt-2 text-[24px] font-extrabold leading-tight tracking-[-0.02em] text-[#07162d] md:text-[36px]">
              Account, activity, and support
            </h1>
          </div>
          <p className="max-w-xl text-[14px] font-semibold leading-6 text-[#667085]">
            A compact command center for applications, offers, documents,
            preferences, help, and Fintaraa policy controls.
          </p>
        </div> */}

        <AccountMobileMenu activeSlug={activeSlug} />

        <div className="grid min-h-0 xl:h-full xl:grid-cols-[minmax(20rem,24rem)_minmax(0,1fr)]">
          <div className="hidden gap-4 border-r-gray-200 bg-white xl:grid xl:h-full xl:overflow-y-auto xl:border-r xl:pr-3 scrollbar-thin">
            <ProfileSummary />
            <AccountMenu activeSlug={activeSlug} />
            <div className="bg-white/90 p-4 text-center">
              <p className="text-[13px] font-extrabold text-[#07162d]">
                Fintaraa app v1.0.0
              </p>
              <p className="mt-2 text-[12px] font-semibold leading-5 text-[#667085]">
                Powered by regulated partners. Built with RBI and IRDAI-aligned
                controls.
              </p>
            </div>
          </div>

          <div className="min-w-0 bg-white xl:h-full xl:overflow-y-auto xl:pb-4 scrollbar-thin">
            <AccountDetailPanel slug={activeSlug} />
          </div>
        </div>
      </div>
    </main>
  );
}
