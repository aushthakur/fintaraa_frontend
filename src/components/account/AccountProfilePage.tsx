import { AccountMenu } from "./AccountMenu";
import { ProfileSummary } from "./ProfileSummary";
import { AccountDetailPanel } from "./AccountDetailPanel";

export function AccountProfilePage({ activeSlug }: { activeSlug?: string }) {
  return (
    <main className="min-h-screen bg-gray-100 px-4 py-8 md:px-6 lg:px-8">
      <div className="mx-auto max-w-9xl">
        <div className="mb-6 flex flex-col gap-3 md:flex-row md:items-end md:justify-between">
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
        </div>

        <div className="grid items-start gap-6 xl:grid-cols-[24rem_minmax(0,1fr)]">
          <div className="grid gap-4 bg-white xl:sticky xl:top-28 xl:h-[calc(100vh-8rem)] xl:overflow-y-auto xl:pr-3 scrollbar-thin">
            <ProfileSummary />
            <AccountMenu activeSlug={activeSlug} />
            <div className="bg-white/90 p-4 text-center shadow-[0_14px_35px_rgba(25,85,133,0.05)]">
              <p className="text-[13px] font-extrabold text-[#07162d]">
                Fintaraa app v1.0.0
              </p>
              <p className="mt-2 text-[12px] font-semibold leading-5 text-[#667085]">
                Powered by regulated partners. Built with RBI and IRDAI-aligned
                controls.
              </p>
            </div>
          </div>

          <div className="bg-white xl:sticky xl:top-28 xl:h-[calc(100vh-8rem)] xl:overflow-y-auto xl:pb-4 scrollbar-thin">
            <AccountDetailPanel slug={activeSlug} />
          </div>
        </div>
      </div>
    </main>
  );
}
