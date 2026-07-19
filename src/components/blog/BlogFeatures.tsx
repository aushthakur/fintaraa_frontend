"use client";

import Image from "next/image";
import Link from "next/link";
import { formatKnowledgeDate } from "@/services/websiteKnowledge";

interface FeaturedArticleProps {
  article?: {
    title: string;
    description: string;
    category: string;
    thumbnail: string;
    readTime: string;
    publishedAt: string;
    author: {
      name: string;
      role: string;
      avatar: string;
    };
    slug: string;
  };
}

export function FeaturedArticleSection({ article }: FeaturedArticleProps) {
  // Fallback defaults mapping the exact text strings from image_edfe49.png
  const data = article || {
    title: "How SIP Investments Can Build Long-Term Wealth",
    description:
      "A complete guide to Systematic Investment Plans, their benefits, and how they help you achieve Anjali Mehta financial freedom.",
    category: "Investing",
    thumbnail: "/assets/images/blog-feature.png", // Replace with your image path
    readTime: "5 min read",
    publishedAt: "Jan 15, 2026",
    author: {
      name: "Rahul Sharma",
      role: "Financial Analyst",
      avatar: "/assets/images/user1.png", // Replace with your user image path
    },
    slug: "how-sip-investments-can-build-long-term-wealth",
  };
  const publishedDate = formatKnowledgeDate(data.publishedAt);

  return (
    <section className="px-4 py-10 md:px-8 lg:px-16 bg-white font-sans antialiased">
      <div className="mx-auto max-w-9xl">
        {/* Section Heading Title */}
        <h2 className="text-[22px] font-bold text-[#1a1d25] tracking-tight mb-5">
          Featured Article
        </h2>

        {/* Master Balanced Feature Card Box Layout wrapper */}
        <div className="rounded-2xl border border-[#e5edf5] bg-white overflow-hidden shadow-[0_4px_20px_rgba(22,34,50,0.02)] grid grid-cols-1 md:grid-cols-[1.1fr_1.3fr]">
          {/* Left Block Side: Main Editorial Cover Image frame */}
          <div className="relative min-h-55 md:min-h-75 w-full bg-gray-50">
            <Image
              src={data.thumbnail}
              alt={data.title}
              fill
              sizes="(max-width: 768px) 100vw, 46vw"
              className="object-cover"
              priority
            />
          </div>

          {/* Right Block Side: Styled Content Card container */}
          <div className="bg-[#eef6ff] p-6 sm:p-8 flex flex-col justify-between gap-6 relative">
            {/* Top Row Block Elements */}
            <div className="space-y-3.5">
              {/* Category Pill Badge Tag */}
              <span className="inline-flex items-center justify-center bg-white text-[#005ca8] text-[12px] font-bold px-4 py-1.5 rounded-full shadow-2xs border border-[#e1ecf8]">
                {data.category}
              </span>

              {/* Core Content Headers */}
              <h3 className="text-[22px] sm:text-[25px] font-bold text-[#000000] leading-[1.2] tracking-tight max-w-lg">
                {data.title}
              </h3>

              <p className="text-[13.5px] sm:text-[14.5px] font-medium leading-[1.55] text-[#93a2b2] max-w-xl">
                {data.description}
              </p>
            </div>

            {/* Bottom Row Block: Authorship Details & Call To Action Link Row */}
            <div className="flex flex-wrap items-end justify-between gap-4 pt-2">
              {/* Left Group Info Segment */}
              <div className="flex items-center gap-3">
                <div className="relative h-10 w-10 rounded-full overflow-hidden bg-gray-200 border-2 border-white shadow-xs">
                  <Image
                    src={data.author.avatar}
                    alt={data.author.name}
                    fill
                    sizes="40px"
                    className="object-cover"
                  />
                </div>
                <div>
                  <h4 className="text-[13.5px] font-bold text-[#000000] leading-tight">
                    {data.author.name}
                  </h4>
                  <p className="text-[11px] font-medium text-[#93a2b2] mt-0.5">
                    {data.author.role}
                  </p>
                </div>
              </div>

              {/* Central Metadata Stack Timestamps */}
              <div className="flex items-center gap-4 text-[12px] font-medium text-[#93a2b2] sm:pr-4">
                <span>{data.readTime}</span>
                <span>{publishedDate}</span>
              </div>

              {/* Solid Click Action Trigger */}
              <Link
                href={`/blog/${data.slug}`}
                className="text-[13.5px] font-bold text-[#005ca8] hover:underline whitespace-nowrap self-end ml-auto sm:ml-0"
              >
                Read more
              </Link>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
