"use client";

import Link from "next/link";
import {
  Clock3,
  Newspaper,
  ArrowRight,
  ChevronLeft,
  CalendarDays,
  ChevronRight,
} from "lucide-react";
import { A11y, Navigation } from "swiper/modules";
import { Swiper, SwiperSlide } from "swiper/react";
import { BlogVisual } from "@/components/blog/BlogVisual";
import { latestBlogPosts, type BlogPost } from "@/data/blogs";

function formatDate(value: string) {
  return new Date(value).toLocaleDateString("en-IN", {
    day: "2-digit",
    month: "short",
    year: "numeric",
  });
}

function InsightCard({ post }: { post: BlogPost }) {
  return (
    <article className="group h-full overflow-hidden border border-[#e8f0f7] bg-white transition duration-300 hover:-translate-y-1">
      <Link href={`/blog/${post.slug}`} className="block h-full no-underline">
        <BlogVisual
          title={post.title}
          accent={post.accent}
          category={post.category}
          compact
        />
        <div className="p-5">
          <div className="flex flex-wrap items-center gap-3 text-[12px] font-semibold text-[#667085]">
            <span className="inline-flex items-center gap-1.5">
              <CalendarDays className="h-3.5 w-3.5 text-[#195585]" />
              {formatDate(post.publishedAt)}
            </span>
            <span className="inline-flex items-center gap-1.5">
              <Clock3 className="h-3.5 w-3.5 text-[#195585]" />
              {post.readTime}
            </span>
          </div>

          <h3 className="mt-4 text-[20px] font-black leading-tight text-[#07162d] transition group-hover:text-[#195585]">
            {post.title}
          </h3>
          <p className="mt-3 line-clamp-3 text-[14px] font-medium leading-7 text-[#667085]">
            {post.excerpt}
          </p>

          <div className="mt-5 flex items-center justify-between gap-4">
            <div className="flex flex-wrap gap-2">
              {post.tags.slice(0, 2).map((tag) => (
                <span
                  key={tag}
                  className="rounded-full bg-[#eef8ff] px-3 py-1 text-[11px] font-black text-[#195585]"
                >
                  {tag}
                </span>
              ))}
            </div>
            <span className="inline-flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-[#195585] text-white transition group-hover:translate-x-1 group-hover:bg-[#12b76a]">
              <ArrowRight className="h-4 w-4" />
            </span>
          </div>
        </div>
      </Link>
    </article>
  );
}

export function FinancialInsights() {
  const posts = latestBlogPosts.slice(0, 6);

  return (
    <section className="px-4 py-16 md:px-6 lg:px-8">
      <div className="mx-auto max-w-9xl">
        <div className="mb-8 flex flex-col gap-5 md:flex-row md:items-end md:justify-between">
          <div>
            <div className="inline-flex items-center gap-2 rounded-full bg-[#eef8ff] px-4 py-2 text-[12px] font-black uppercase tracking-[0.14em] text-[#195585]">
              <Newspaper className="h-4 w-4 text-[#12b76a]" />
              Financial Insights
            </div>
            <h2 className="mt-4 text-[32px] font-black leading-tight text-[#07162d] md:text-[42px]">
              Latest guides for smarter money decisions
            </h2>
            <p className="mt-3 max-w-2xl text-[15px] font-semibold leading-7 text-[#667085]">
              Practical articles on loans, credit score, cards, insurance, and
              repayment planning from the Fintaraa editorial desk.
            </p>
          </div>

          <div className="flex items-center gap-3">
            <button
              type="button"
              aria-label="Previous insights"
              className="financial-insights-prev inline-flex h-11 w-11 items-center justify-center rounded-full border border-[#d9e6f2] bg-white text-[#195585] shadow-[0_12px_30px_rgba(25,85,133,0.08)] transition hover:-translate-y-0.5 hover:bg-[#195585] hover:text-white disabled:opacity-40"
            >
              <ChevronLeft className="h-5 w-5" />
            </button>
            <button
              type="button"
              aria-label="Next insights"
              className="financial-insights-next inline-flex h-11 w-11 items-center justify-center rounded-full border border-[#d9e6f2] bg-white text-[#195585] shadow-[0_12px_30px_rgba(25,85,133,0.08)] transition hover:-translate-y-0.5 hover:bg-[#195585] hover:text-white disabled:opacity-40"
            >
              <ChevronRight className="h-5 w-5" />
            </button>
            <Link
              href="/blog"
              className="hidden items-center gap-2 rounded-full bg-[#195585] px-5 py-3 text-[13px] font-black text-white no-underline shadow-[0_14px_32px_rgba(25,85,133,0.18)] transition hover:-translate-y-0.5 hover:bg-[#12446c] md:inline-flex"
            >
              View all <ArrowRight className="h-4 w-4" />
            </Link>
          </div>
        </div>

        <Swiper
          modules={[Navigation, A11y]}
          navigation={{
            prevEl: ".financial-insights-prev",
            nextEl: ".financial-insights-next",
          }}
          slidesPerView={1.08}
          spaceBetween={16}
          speed={650}
          grabCursor
          className="!overflow-visible!"
          breakpoints={{
            640: {
              slidesPerView: 1.45,
              spaceBetween: 18,
            },
            768: {
              slidesPerView: 2,
              spaceBetween: 20,
            },
            1024: {
              slidesPerView: 3,
              spaceBetween: 24,
            },
          }}
        >
          {posts.map((post) => (
            <SwiperSlide key={post.slug} className="h-auto! pb-3">
              <InsightCard post={post} />
            </SwiperSlide>
          ))}
        </Swiper>

        <Link
          href="/blog"
          className="mt-6 inline-flex items-center gap-2 rounded-full bg-[#195585] px-5 py-3 text-[13px] font-black text-white no-underline shadow-[0_14px_32px_rgba(25,85,133,0.18)] md:hidden"
        >
          View all blogs <ArrowRight className="h-4 w-4" />
        </Link>
      </div>
    </section>
  );
}
