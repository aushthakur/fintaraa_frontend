import Link from "next/link";
import {
  ArrowRight,
  BadgeCheck,
  Home,
  Newspaper,
  PlayCircle,
  ShieldCheck,
  Star,
  TrendingUp,
} from "lucide-react";
import { BlogVisual } from "@/components/blog/BlogVisual";
import { BankLogoImage } from "@/components/common/BankLogoImage";
import { latestBlogPosts } from "@/data/blogs";

const loanOffers = [
  {
    bank: "SBI Bank",
    logo: "/assets/banks/visa-card.png",
    rate: "7.10%",
    fee: "0.35%",
  },
  {
    bank: "ICICI Bank",
    logo: "/assets/banks/icici.png",
    rate: "7.25%",
    fee: "0.50%",
  },
  {
    bank: "Kotak Bank",
    logo: "/assets/banks/kotak.png",
    rate: "7.40%",
    fee: "0.45%",
  },
  {
    bank: "HDFC Bank",
    logo: "/assets/banks/hdfc.png",
    rate: "7.35%",
    fee: "0.50%",
  },
  { bank: "PNB", logo: "/assets/banks/pnb.png", rate: "7.20%", fee: "0.40%" },
  {
    bank: "IDFC First",
    logo: "/assets/banks/idfc.png",
    rate: "7.55%",
    fee: "0.60%",
  },
];

const pressItems = [
  "Fintaraa expands assisted loan discovery across India",
  "Digital-first credit matching improves customer choice",
  "Partner-led lending marketplace gains adoption",
  "Fintaraa launches faster credit score assisted journeys",
];

const videos = [
  "How Fintaraa helped me compare offers",
  "A smoother document journey",
  "Understanding loan eligibility",
];

export function CreditScoreMinuteBanner() {
  return (
    <section className="px-4 py-6 md:px-6 lg:px-8">
      <div className="mx-auto max-w-9xl rounded-xl bg-[#eaf6ff] px-4 py-6 text-center shadow-[0_12px_28px_rgba(25,85,133,0.08)] md:px-8">
        <h2 className="text-[20px] font-extrabold text-[#07162d] md:text-[26px]">
          Check your Credit Score in Minutes with Fintaraa
        </h2>
        <div className="mt-5 flex flex-wrap justify-center gap-3">
          {["Experian", "Equifax", "CRIF", "CIBIL"].map((bureau) => (
            <span
              key={bureau}
              className="rounded-md bg-white px-5 py-2 text-[12px] font-extrabold text-[#195585] shadow-sm ring-1 ring-[#dbe8f2]"
            >
              {bureau}
            </span>
          ))}
        </div>
        <div className="mt-5 grid gap-3 text-left text-[12px] font-semibold text-[#344054] md:grid-cols-3">
          {[
            "No impact on your credit score",
            "Personalised improvement tips",
            "Loan offers based on profile",
          ].map((item) => (
            <span
              key={item}
              className="flex items-center gap-2 rounded-lg bg-white/75 px-3 py-2"
            >
              <BadgeCheck className="h-4 w-4 shrink-0 text-[#12b76a]" />
              {item}
            </span>
          ))}
        </div>
        <Link
          href="/cibil-score"
          className="mt-5 inline-flex h-10 items-center justify-center rounded-full  bg-linear-to-r from-[#0fae5e] to-[#17cb70] px-6 text-[13px] font-extrabold text-white no-underline"
        >
          Check Score Now
        </Link>
      </div>
    </section>
  );
}

export function HomeMediaSections() {
  const posts = latestBlogPosts.slice(0, 4);

  return (
    <section className="px-4 py-12 md:px-6 lg:px-8">
      <div className="mx-auto grid max-w-9xl gap-10">
        <div>
          <div className="mb-4 flex items-center justify-between">
            <h2 className="text-[18px] font-extrabold text-[#101828] md:text-[24px]">
              Recent Blogs
            </h2>
            <Link
              href="/blog"
              className="rounded-full bg-[#075cde] px-5 py-2 text-[12px] font-extrabold text-white no-underline"
            >
              View all
            </Link>
          </div>
          <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
            {posts.map((post) => (
              <Link
                key={post.slug}
                href={`/blog/${post.slug}`}
                className="block no-underline"
              >
                <article className="overflow-hidden rounded-lg border border-[#e8eef5] bg-white">
                  <BlogVisual
                    title={post.title}
                    accent={post.accent}
                    category={post.category}
                    compact
                  />
                  <div className="p-3">
                    <h3 className="line-clamp-2 text-[13px] font-extrabold leading-snug text-[#101828]">
                      {post.title}
                    </h3>
                    <p className="mt-2 line-clamp-2 text-[11px] font-semibold leading-5 text-[#667085]">
                      {post.excerpt}
                    </p>
                  </div>
                </article>
              </Link>
            ))}
          </div>
        </div>

        <div>
          <div className="mb-4 flex items-center justify-between">
            <h2 className="text-[18px] font-extrabold text-[#101828] md:text-[24px]">
              Media & Press Releases
            </h2>
            <Link
              href="/blog"
              className="rounded-full bg-[#075cde] px-5 py-2 text-[12px] font-extrabold text-white no-underline"
            >
              View all
            </Link>
          </div>
          <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
            {pressItems.map((item, index) => (
              <article
                key={item}
                className="rounded-lg border border-[#e8eef5] bg-white p-3"
              >
                <div className="flex h-32 items-center justify-center rounded-md bg-[#eef8ff] text-[#195585]">
                  <Newspaper className="h-10 w-10" />
                </div>
                <p className="mt-3 text-[12px] font-extrabold leading-5 text-[#101828]">
                  {item}
                </p>
                <p className="mt-2 text-[11px] font-semibold text-[#667085]">
                  Press note {index + 1}
                </p>
              </article>
            ))}
          </div>
        </div>

        <div>
          <h2 className="mb-4 text-center text-[18px] font-extrabold text-[#101828] md:text-[24px]">
            Video Testimonials
          </h2>
          <div className="grid gap-4 md:grid-cols-3">
            {videos.map((video) => (
              <article
                key={video}
                className="relative overflow-hidden rounded-lg bg-[#0b2f4f] p-4 text-white"
              >
                <div className="flex h-34 items-center justify-center rounded-md bg-white/10">
                  <PlayCircle className="h-12 w-12" />
                </div>
                <p className="mt-3 text-[13px] font-extrabold">{video}</p>
                <div className="mt-2 flex gap-1 text-[#f79009]">
                  {Array.from({ length: 5 }).map((_, index) => (
                    <Star key={index} className="h-3.5 w-3.5 fill-current" />
                  ))}
                </div>
              </article>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}

export function HomeLoanOffers() {
  return (
    <section className="px-4 py-12 md:px-6 lg:px-8">
      <div className="mx-auto max-w-9xl rounded-xl border border-[#dce7f3] bg-white p-4 shadow-[0_14px_34px_rgba(16,24,40,0.06)] md:p-6">
        <div className="flex flex-col gap-3 md:flex-row md:items-center md:justify-between">
          <div>
            <h2 className="text-[20px] font-extrabold text-[#101828] md:text-[28px]">
              Loans from <span className="text-[#08a045]">7.10%*</span> Only
              with Fintaraa
            </h2>
            <p className="mt-1 text-[13px] font-semibold text-[#667085]">
              Compare partner rates, fees, and indicative eligibility in one
              place.
            </p>
          </div>
          <Home className="h-10 w-10 text-[#195585]" />
        </div>

        <div className="mt-5 grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
          {loanOffers.map((offer) => (
            <article
              key={offer.bank}
              className="rounded-lg border border-[#e8eef5] bg-[#fbfdff] p-4"
            >
              <div className="flex items-center justify-between gap-3">
                <BankLogoImage
                  src={offer.logo}
                  alt={offer.bank}
                  className="h-10 w-18"
                  imageClassName="object-left"
                />
                <ShieldCheck className="h-5 w-5 text-[#12b76a]" />
              </div>
              <div className="mt-4 grid grid-cols-2 gap-3 text-[12px] font-semibold">
                <span className="text-[#667085]">Interest rate</span>
                <span className="text-right text-[#101828]">{offer.rate}</span>
                <span className="text-[#667085]">Processing fee</span>
                <span className="text-right text-[#101828]">{offer.fee}</span>
              </div>
            </article>
          ))}
        </div>

        <Link
          href="/products/home-loan"
          className="mx-auto mt-6 flex h-10 w-fit items-center gap-2 rounded-full  bg-linear-to-r from-[#0fae5e] to-[#17cb70] px-6 text-[13px] font-extrabold text-white no-underline"
        >
          Compare Home Loan Offers <ArrowRight className="h-4 w-4" />
        </Link>

        <div className="mt-4 flex items-center justify-center gap-2 text-[11px] font-semibold text-[#667085]">
          <TrendingUp className="h-4 w-4 text-[#08a045]" />
          Rates shown are indicative and subject to partner approval.
        </div>
      </div>
    </section>
  );
}
