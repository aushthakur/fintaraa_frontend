import { permanentRedirect } from "next/navigation";

export default function SitemapPage() {
  permanentRedirect("/sitemap.xml");
}
