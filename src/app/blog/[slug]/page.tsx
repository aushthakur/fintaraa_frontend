"use client";

import Image from "next/image";
import Link from "next/link";
import { notFound } from "next/navigation";
import {
  Eye,
  Link2,
} from "lucide-react";
import { type BlogPost } from "@/data/blogs";
import { NewsletterSubscription } from "@/components/blog/NewsletterSubscription";
import { WhyChooseFintaraa } from "@/components/blog/WhyChooseFintaraa";
import { FaqAccordion } from "@/components/common/FaqAccordion";

function normalizeAuthor(author: string | { name: string; role: string; avatar: string }): { name: string; role: string; avatar: string } {
  if (typeof author === "string") {
    return {
      name: author,
      role: "Financial Analyst",
      avatar: "/assets/images/user1.png",
    };
  }
  return author;
}

// Fallback Mock Data matching the exact textual paths from the image references
const mockPost: BlogPost = {
  slug: "how-sip-investments-can-build-long-term-wealth",
  title: "How SIP Investments Can Build Long-Term Wealth",
  excerpt: "A complete guide to Systematic Investment Plans, their benefits, and how they help you achieve Anjali Mehta financial freedom.",
  category: "Financial Planning",
  publishedAt: "2026-01-15",
  readTime: "5 min read",
  accent: "#005ca8",
  author: {
    name: "Rahul Sharma",
    role: "Financial Analyst",
    avatar: "/assets/images/user1.png",
  },
  body: [
    {
      heading: "Introduction",
      content: [
        "Systematic Investment Plan (SIP) is one of the most effective ways to build wealth over the long term. It allows you to invest a fixed amount regularly in mutual funds and benefit from compounding and rupee cost averaging."
      ]
    },
    {
      heading: "What is Home Loan",
      content: [
        "A Systematic Investment Plan (SIP) allows you to invest a fixed amount in mutual funds at regular intervals-monthly, quarterly, or annually. It's a disciplined approach to investing that helps you build wealth over time."
      ]
    },
    {
      heading: "Benefits of Home Loan",
      content: [
        "Home is Your\nYou buy more units when prices are low and fewer when prices are high.",
        "Rupee Cost Averaging\nYour returns generate additional earnings over time.",
        "Power of Compounding\nTerm and Condition compounding and rupee cost averaging."
      ]
    }
  ],
  tags: ["Investing", "Wealth Building"]
};

const mockRelated = [
  {
    slug: "manage-monthly-budget-1",
    title: "10 Smart Ways to Manage Your Monthly Budget",
    readTime: "5 min read",
    category: "Budgeting",
    thumbnail: "/assets/images/blog-thumb-1.png"
  },
  {
    slug: "manage-monthly-budget-2",
    title: "10 Smart Ways to Manage Your Monthly Budget",
    readTime: "5 min read",
    category: "Budgeting",
    thumbnail: "/assets/images/blog-thumb-2.png"
  }
];

export default function BlogDetailPage() {
  const post = mockPost; // In production use: const post = getBlogPost(slug);
  if (!post) notFound();

  const authorInfo = normalizeAuthor(post.author);

  return (
    <main className="bg-white font-sans antialiased text-[#1a1d25]">
      
      {/* Decorative Diagonal Background Element */}
      <div className="absolute top-0 left-0 w-44 h-44 bg-[#edf5fd] opacity-70 rounded-br-full -z-10" />

      {/* Main Full-Bleed Top Feature Image Header Frame */}
      <div className="mx-auto max-w-7xl px-4 md:px-8 lg:px-16 pt-6">
        <div className="relative w-full h-60 md:h-95 rounded-3xl overflow-hidden shadow-xs border border-gray-100">
          <Image
            src="/assets/blogs/blog-details-hero.png"
            alt={post.title}
            fill
            className="object-cover"
            priority
          />
        </div>
      </div>

      {/* Split Body Workspace Content Grid Layout */}
      <section className="mx-auto max-w-7xl px-4 md:px-8 lg:px-16 py-10">
        <div className="grid gap-8 lg:grid-cols-[1fr_300px] items-start">
          
          {/* LEFT CONTAINER: Main Dynamic Core Article Header & Body */}
          <div className="space-y-8">
            <div className="space-y-4">
              {/* Category Pill Badge Indicator */}
              <span className="text-[13px] font-bold text-[#005ca8] tracking-wide block">
                {post.category}
              </span>
              
              {/* Core Page Heading */}
              <h1 className="text-[32px] md:text-[42px] font-extrabold text-[#000000] leading-[1.15] tracking-tight">
                {post.title}
              </h1>
              
              {/* Main Subtitle Box Summary Description */}
              <p className="text-[15px] font-medium leading-relaxed text-[#7a869a] max-w-3xl">
                {post.excerpt}
              </p>

              {/* Comprehensive Meta Metrics Row & Float Share Bar Container */}
              <div className="flex flex-wrap items-center justify-between gap-4 pt-4 border-b border-[#f0f4f8] pb-5">
                <div className="flex flex-wrap items-center gap-5 text-[12.5px] font-medium text-[#94a2b3]">
                  {/* Author Profile Block */}
                  <div className="flex items-center gap-2.5 text-black">
                    <div className="relative h-8 w-8 rounded-full overflow-hidden bg-gray-100">
                      <Image
                        src={authorInfo.avatar}
                        alt={authorInfo.name}
                        fill
                        className="object-cover"
                      />
                    </div>
                    <div>
                      <div className="font-bold">{authorInfo.name}</div>
                      <div className="text-[10px] text-[#94a2b3] font-medium">{authorInfo.role}</div>
                    </div>
                  </div>

                  {/* Operational Timestamp Tags */}
                  <span className="hidden sm:inline">|</span>
                  <span>{post.readTime}</span>
                  <span>Jan 15, 2026</span>
                  
                  {/* Impression Counter badge */}
                  <span className="inline-flex items-center gap-1">
                    <Eye className="h-4 w-4" />
                    <span>1.2k</span>
                  </span>
                </div>

                {/* Inline Actionable Social Shares Row - Replaced with inline standard SVGs */}
                <div className="flex items-center gap-3">
                  <span className="text-[11px] font-bold text-[#94a2b3] uppercase tracking-wider mr-1">Share</span>
                  {/* Facebook */}
                  <button className="text-[#3b5998] hover:opacity-80 transition-opacity">
                    <svg className="h-4 w-4 fill-current" viewBox="0 0 24 24"><path d="M22 12c0-5.52-4.48-10-10-10S2 6.48 2 12c0 4.84 3.44 8.87 8 9.8V15H8v-3h2V9.5C10 7.57 11.57 6 13.5 6H16v3h-2c-.55 0-1 .45-1 1v2h3v3h-3v6.95c4.56-.93 8-4.96 8-9.75z"/></svg>
                  </button>
                  {/* Instagram */}
                  <button className="text-[#e1306c] hover:opacity-80 transition-opacity">
                    <svg className="h-4 w-4 fill-none stroke-current" viewBox="0 0 24 24" strokeLinecap="round" strokeLinejoin="round"><rect x="2" y="2" width="20" height="20" rx="5" ry="5"></rect><path d="M16 11.37A4 4 0 1 1 12.63 8 4 4 0 0 1 16 11.37z"></path><line x1="17.5" y1="6.5" x2="17.51" y2="6.5"></line></svg>
                  </button>
                  {/* Linkedin */}
                  <button className="text-[#0077b5] hover:opacity-80 transition-opacity">
                    <svg className="h-4 w-4 fill-current" viewBox="0 0 24 24"><path d="M19 0h-14c-2.761 0-5 2.239-5 5v14c0 2.761 2.239 5 5 5h14c2.762 0 5-2.239 5-5v-14c0-2.761-2.238-5-5-5zm-11 19h-3v-11h3v11zm-1.5-12.268c-.966 0-1.75-.79-1.75-1.764s.784-1.764 1.75-1.764 1.75.79 1.75 1.764-.783 1.764-1.75 1.764zm13.5 12.268h-3v-5.604c0-3.368-4-3.113-4 0v5.604h-3v-11h3v1.765c1.396-2.586 7-2.777 7 2.476v6.759z"/></svg>
                  </button>
                  <button className="text-[#4a5568] hover:opacity-80 transition-opacity"><Link2 className="h-4 w-4" /></button>
                </div>
              </div>
            </div>

            {/* Dynamic Content Mapping Sections Block Layout */}
            <div className="space-y-8">
              {post.body.map((section, index) => (
                <div key={index} className="space-y-3">
                  <h2 className="text-[20px] font-bold text-[#000000] tracking-tight">
                    {section.heading}
                  </h2>
                  <div className="space-y-4">
                    {section.content.map((paragraph, pIdx) => (
                      <p 
                        key={pIdx} 
                        className="text-[14.5px] font-medium leading-[1.65] text-[#4a5568] whitespace-pre-line"
                      >
                        {paragraph}
                      </p>
                    ))}
                  </div>

                  {/* Intercept Context Specific Takeaways Callout Card under Introduction */}
                  {index === 0 && (
                    <div className="my-6 rounded-2xl bg-[#eef6ff] p-5 sm:p-6 border border-[#dce9f7] space-y-4">
                      <h3 className="text-[16px] font-bold text-[#000000] tracking-tight">
                        Key Takeaways
                      </h3>
                      <div className="space-y-3 text-[13.5px] font-medium text-[#7a869a]">
                        {[
                          "Start early to take full advantage of compounding",
                          "Invest consistently, regardless of market conditions.",
                          "SIP helps reduce risk through rupee cost averaging",
                          "Long-term investing creates significant wealth"
                        ].map((takeaway, tIdx) => (
                          <div key={tIdx} className="flex items-center gap-3">
                            <div className="flex h-4 w-4 shrink-0 items-center justify-center rounded-full border border-[#005ca8] bg-white text-[#005ca8]">
                              <span className="text-[8px] font-bold">✓</span>
                            </div>
                            <span>{takeaway}</span>
                          </div>
                        ))}
                      </div>
                    </div>
                  )}
                </div>
              ))}
            </div>

            {/* LOWER DOUBLE CARD FRAME ROW CONTAINER */}
            <div className="grid gap-6 md:grid-cols-2 pt-8 border-t border-[#f0f4f8]">
              
              {/* Card Left: Comprehensive Author Card Box Profile */}
              <div className="rounded-2xl border border-[#e5edf5] p-5 flex flex-col justify-between gap-4">
                <div>
                  <h4 className="text-[14px] font-bold text-[#7a869a] mb-4">About the Author</h4>
                  <div className="flex items-start gap-3.5">
                    <div className="relative h-12 w-12 rounded-full overflow-hidden bg-gray-100 shrink-0">
                      <Image
                        src={authorInfo.avatar}
                        alt={authorInfo.name}
                        fill
                        className="object-cover"
                      />
                    </div>
                    <div>
                      <h5 className="text-[15px] font-bold text-[#000000] leading-none">{authorInfo.name}</h5>
                      <p className="text-[11px] font-medium text-[#94a2b3] mt-1.5">{authorInfo.role}</p>
                      <p className="text-[12.5px] font-medium leading-relaxed text-[#7a869a] mt-3">
                        Rahul has 10+ years of experience in wealth management and investment research. He loves simplifying finance for everyone.
                      </p>
                    </div>
                  </div>
                </div>
                {/* Micro Action Share Handles */}
                <div className="flex items-center gap-3 pt-2 border-t border-gray-50 text-[#7a869a]">
                  <button className="hover:text-[#3b5998] transition-colors"><svg className="h-4 w-4 fill-current" viewBox="0 0 24 24"><path d="M22 12c0-5.52-4.48-10-10-10S2 6.48 2 12c0 4.84 3.44 8.87 8 9.8V15H8v-3h2V9.5C10 7.57 11.57 6 13.5 6H16v3h-2c-.55 0-1 .45-1 1v2h3v3h-3v6.95c4.56-.93 8-4.96 8-9.75z"/></svg></button>
                  <button className="hover:text-[#e1306c] transition-colors"><svg className="h-4 w-4 fill-none stroke-current" viewBox="0 0 24 24" strokeLinecap="round" strokeLinejoin="round"><rect x="2" y="2" width="20" height="20" rx="5" ry="5"></rect><path d="M16 11.37A4 4 0 1 1 12.63 8 4 4 0 0 1 16 11.37z"></path><line x1="17.5" y1="6.5" x2="17.51" y2="6.5"></line></svg></button>
                  <button className="hover:text-[#0077b5] transition-colors"><svg className="h-4 w-4 fill-current" viewBox="0 0 24 24"><path d="M19 0h-14c-2.761 0-5 2.239-5 5v14c0 2.761 2.239 5 5 5h14c2.762 0 5-2.239 5-5v-14c0-2.761-2.238-5-5-5zm-11 19h-3v-11h3v11zm-1.5-12.268c-.966 0-1.75-.79-1.75-1.764s.784-1.764 1.75-1.764 1.75.79 1.75 1.764-.783 1.764-1.75 1.764zm13.5 12.268h-3v-5.604c0-3.368-4-3.113-4 0v5.604h-3v-11h3v1.765c1.396-2.586 7-2.777 7 2.476v6.759z"/></svg></button>
                </div>
              </div>

              {/* Card Right: Mini Related Material Strip Stack */}
              <div className="rounded-2xl border border-[#e5edf5] p-5 space-y-4">
                <h4 className="text-[14px] font-bold text-[#7a869a]">Related Article</h4>
                <div className="space-y-3">
                  {mockRelated.map((article, aIdx) => (
                    <Link 
                      key={aIdx} 
                      href={`/blog/${article.slug}`}
                      className="flex items-center gap-3 p-2 rounded-xl border border-[#f0f4f8] hover:border-[#cbd5e1] transition-colors bg-white group"
                    >
                      <div className="relative h-14 w-20 rounded-lg overflow-hidden shrink-0 bg-gray-50">
                        <Image
                          src={article.thumbnail}
                          alt={article.title}
                          fill
                          className="object-cover"
                        />
                      </div>
                      <div className="min-w-0">
                        <h5 className="text-[12.5px] font-bold text-[#000000] leading-snug truncate group-hover:text-[#005ca8] transition-colors">
                          {article.title}
                        </h5>
                        <span className="text-[10px] font-medium text-[#94a2b3] mt-1 block">{article.readTime}</span>
                      </div>
                    </Link>
                  ))}
                </div>
              </div>

            </div>

          </div>

          {/* RIGHT CONTAINER: Fixed Sticky Expert Highlights Sidebar Banner Panel */}
          <aside className="lg:sticky lg:top-24 rounded-2xl bg-[#eef6ff] p-5 border border-[#dce9f7] space-y-5">
            <div>
              <h3 className="text-[15px] font-bold text-[#000000] tracking-tight">
                Expert Insight
              </h3>
              <p className="mt-2 text-[12.5px] font-medium leading-relaxed text-[#7a869a]">
                Consistency is more Featured Article important than timing when it comes to investing.
              </p>
            </div>

            {/* Author Identification Badge Row */}
            <div className="flex items-center gap-3 pt-3 border-t border-[#dce9f7]">
              <div className="relative h-9 w-9 rounded-full overflow-hidden bg-gray-100 shrink-0">
                <Image
                  src={authorInfo.avatar}
                  alt={authorInfo.name}
                  fill
                  className="object-cover"
                />
              </div>
              <div>
                <h4 className="text-[13px] font-bold text-[#000000] leading-none">{authorInfo.name}</h4>
                <p className="text-[10px] font-medium text-[#94a2b3] mt-1">{authorInfo.role}</p>
              </div>
            </div>
          </aside>

        </div>
      </section>
      <NewsletterSubscription />
      <WhyChooseFintaraa />
      <FaqAccordion />
    </main>
  );
}