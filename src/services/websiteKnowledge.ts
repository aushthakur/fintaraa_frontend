import { blogPosts, type BlogPost } from "@/data/blogs";
import { buildApiUrl } from "@/services/apiUrl";

export type WebsiteKnowledgeType =
  | "blog"
  | "testimonial"
  | "press_release"
  | "video"
  | "award";

export type WebsiteKnowledgeItem = {
  _id?: string;
  title: string;
  slug: string;
  type: WebsiteKnowledgeType;
  summary?: string;
  excerpt?: string;
  content?: string;
  category?: string;
  sectionKey?: string;
  coverImageUrl?: string;
  linkUrl?: string;
  authorName?: string;
  authorRole?: string;
  authorAvatarUrl?: string;
  location?: string;
  rating?: number;
  readTime?: string;
  accent?: string;
  videoUrl?: string;
  youtubeUrl?: string;
  buttonLabel?: string;
  tags?: string[];
  publishedAt?: string;
  createdAt?: string;
};

const unwrap = (payload: any): WebsiteKnowledgeItem[] => {
  const data = payload?.data;
  const result = data?.result || data;
  return Array.isArray(result) ? result : [];
};

const normalise = (item: any): WebsiteKnowledgeItem => ({
  _id: item?._id,
  title: String(item?.title || "Untitled"),
  slug: String(item?.slug || item?._id || "content"),
  type: item?.type,
  summary: item?.summary || item?.excerpt || "",
  excerpt: item?.excerpt || item?.summary || "",
  content: item?.content || "",
  category: item?.category || "Fintaraa",
  sectionKey: item?.sectionKey,
  coverImageUrl: item?.coverImageUrl || "",
  linkUrl: item?.linkUrl || "",
  authorName: item?.authorName || "Fintaraa Editorial",
  authorRole: item?.authorRole || "Financial Research Desk",
  authorAvatarUrl: item?.authorAvatarUrl || "/assets/images/user1.png",
  location: item?.location || "",
  rating: Number(item?.rating || 5),
  readTime: item?.readTime || "5 min read",
  accent: item?.accent || "#4c1d95",
  videoUrl: item?.videoUrl || "",
  youtubeUrl: item?.youtubeUrl || "",
  buttonLabel: item?.buttonLabel || "",
  tags: Array.isArray(item?.tags) ? item.tags : [],
  publishedAt: item?.publishedAt || item?.createdAt || new Date().toISOString(),
  createdAt: item?.createdAt,
});

const blogPostToKnowledgeItem = (post: BlogPost): WebsiteKnowledgeItem => {
  const author =
    typeof post.author === "string"
      ? {
          name: post.author,
          role: "Financial Research Desk",
          avatar: "/assets/images/user1.png",
        }
      : post.author;

  return {
    title: post.title,
    slug: post.slug,
    type: "blog",
    summary: post.excerpt,
    excerpt: post.excerpt,
    category: post.category,
    sectionKey: "recent_blogs",
    content: post.body
      .map(
        (section) =>
          `<h2>${section.heading}</h2>${section.content
            .map((paragraph) => `<p>${paragraph}</p>`)
            .join("")}`,
      )
      .join(""),
    coverImageUrl: "",
    authorName: author.name,
    authorRole: author.role,
    authorAvatarUrl: author.avatar,
    readTime: post.readTime,
    accent: post.accent,
    tags: post.tags,
    publishedAt: post.publishedAt,
  };
};

export function getFallbackBlogKnowledgeItems({
  category,
  limit = 3,
}: {
  category?: string;
  limit?: number;
} = {}): WebsiteKnowledgeItem[] {
  const categoryMatches = category
    ? blogPosts.filter((post) => post.category === category)
    : blogPosts;
  const source = categoryMatches.length ? categoryMatches : blogPosts;

  return source.slice(0, limit).map((post, index) => ({
    ...blogPostToKnowledgeItem(post),
    coverImageUrl: `/assets/blogs/blog${(index % 6) + 1}.png`,
  }));
}

const fallbackBlogBySlug = (slug: string) => {
  const post = blogPosts.find((item) => item.slug === slug);
  return post ? blogPostToKnowledgeItem(post) : null;
};

export async function fetchWebsiteKnowledge({
  type,
  sectionKey,
  category,
  limit = 5,
}: {
  type: WebsiteKnowledgeType;
  sectionKey?: string;
  category?: string;
  limit?: number;
}): Promise<WebsiteKnowledgeItem[]> {
  const params = new URLSearchParams({
    type,
    limit: String(limit),
    pagination: "false",
  });
  if (sectionKey) params.set("sectionKey", sectionKey);
  if (category) params.set("category", category);
  const url = buildApiUrl(`/knowledge?${params}`);
  if (!url) return [];

  const response = await fetch(url, {
    cache: "no-store",
  });
  if (!response.ok) throw new Error("Could not load website content.");

  return unwrap(await response.json()).map(normalise);
}

export async function fetchKnowledgeBySlug(
  slug: string,
): Promise<WebsiteKnowledgeItem | null> {
  if (!slug) return null;
  const fallback = fallbackBlogBySlug(slug);
  const url = buildApiUrl(`/knowledge/slug/${slug}`);
  if (!url) return fallback;

  try {
    const response = await fetch(url, {
      cache: "no-store",
    });
    if (response.status === 404) return fallback;
    if (!response.ok) return fallback;

    const payload = await response.json();
    return normalise(payload?.data || payload);
  } catch {
    return fallback;
  }
}

export function formatKnowledgeDate(value?: string) {
  if (!value) return "";
  return new Date(value).toLocaleDateString("en-IN", {
    day: "2-digit",
    month: "short",
    year: "numeric",
  });
}

export function stripHtml(value = "") {
  return value.replace(/<[^>]*>/g, " ").replace(/\s+/g, " ").trim();
}

export function sanitizeRichText(html = "") {
  return html
    .replace(/<script[\s\S]*?>[\s\S]*?<\/script>/gi, "")
    .replace(/<style[\s\S]*?>[\s\S]*?<\/style>/gi, "")
    .replace(/\son[a-z]+\s*=\s*(['"]).*?\1/gi, "")
    .replace(/\s(href|src)\s*=\s*(['"])\s*javascript:[\s\S]*?\2/gi, "");
}

export function toBlogPost(item: WebsiteKnowledgeItem) {
  return {
    slug: item.slug,
    title: item.title,
    excerpt: item.excerpt || item.summary || stripHtml(item.content || ""),
    category: (item.category || "Financial Planning") as any,
    author: {
      name: item.authorName || "Fintaraa Editorial",
      role: item.authorRole || "Financial Research Desk",
      avatar: item.authorAvatarUrl || "/assets/images/user1.png",
    },
    publishedAt: item.publishedAt || new Date().toISOString(),
    readTime: item.readTime || "5 min read",
    featured: item.sectionKey === "recent_blogs",
    tags: item.tags || [],
    accent: item.accent || "#4c1d95",
    body: [],
    coverImageUrl: item.coverImageUrl,
    htmlContent: item.content || "",
  };
}
