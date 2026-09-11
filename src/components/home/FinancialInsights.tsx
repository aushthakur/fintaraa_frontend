"use client";

import Link from "next/link";
import {
  Clock3,
  Newspaper,
  ArrowRight,
  ChevronLeft,
  CalendarDays,
  ChevronRight,
  Tag,
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
    <article className="group h-full overflow-hidden border border-[#e8f0f7] bg-white">
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
              <CalendarDays className="h-3.5 w-3.5 text-[#3b0764]" />
              {formatDate(post.publishedAt)}
            </span>
            <span className="inline-flex items-center gap-1.5">
              <Clock3 className="h-3.5 w-3.5 text-[#3b0764]" />
              {post.readTime}
            </span>
          </div>

          <h3 className="mt-4 text-[20px] font-extrabold leading-tight text-[#07162d] transition group-hover:text-[#3b0764]">
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
                  className="inline-flex items-center gap-1.5 text-[11px] font-extrabold text-[#3b0764]"
                >
                  <Tag className="h-3.5 w-3.5" />
                  {tag}
                </span>
              ))}
            </div>
            <span className="inline-flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-[#3b0764] text-white transition group-hover:translate-x-1 group-hover:bg-[#4c1d95]">
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
            <p className="inline-flex items-center gap-2 text-[12px] font-extrabold uppercase tracking-[0.14em] text-[#3b0764]">
              <Newspaper className="h-4 w-4 text-[#5b21b6]" />
              Financial Insights
            </p>
            <h2 className="mt-4 text-[32px] font-extrabold leading-tight text-[#07162d] md:text-[42px]">
              Latest guides for smarter money decisions
            </h2>
            <p className="mt-3 max-w-2xl text-[15px] font-semibold leading-7 text-[#667085]">
              Practical articles on loans, credit score, cards, insurance, and
              repayment planning from the Fintaraa editorial desk.
            </p>
          </div>

          <div className="flex items-center gap-3">
            <Link
              href="/blog"
              className="inline-flex h-9 shrink-0 items-center justify-center gap-1 rounded-lg bg-[#ede9fe] px-3 text-[12px] font-extrabold leading-none text-[#5b21b6] no-underline transition hover:bg-[#d9eaff] md:h-11 md:gap-2 md:rounded-xl md:bg-[#5b21b6] md:px-5 md:text-[13px] md:text-white md:hover:bg-[#4c1d95]"
            >
              <span className="hidden md:inline">View all blogs</span>
              <span className="md:hidden">View</span>
              <ArrowRight className="h-3.5 w-3.5 md:h-4 md:w-4" />
            </Link>
            <button
              type="button"
              aria-label="Previous insights"
              className="financial-insights-prev inline-flex h-11 w-11 items-center justify-center rounded-full border border-[#d9e6f2] bg-white text-[#3b0764] shadow-[0_12px_30px_rgba(25,85,133,0.08)] transition hover:-translate-y-0.5 hover:bg-[#3b0764] hover:text-white disabled:opacity-40"
            >
              <ChevronLeft className="h-5 w-5" />
            </button>
            <button
              type="button"
              aria-label="Next insights"
              className="financial-insights-next inline-flex h-11 w-11 items-center justify-center rounded-full border border-[#d9e6f2] bg-white text-[#3b0764] shadow-[0_12px_30px_rgba(25,85,133,0.08)] transition hover:-translate-y-0.5 hover:bg-[#3b0764] hover:text-white disabled:opacity-40"
            >
              <ChevronRight className="h-5 w-5" />
            </button>
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

      </div>
    </section>
  );
}
