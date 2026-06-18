import type { Metadata } from "next";
import { getPageSeoMetadata } from "@/services/seoMetadata";
import { ItrPage } from "@/components/services/itr/ItrPage";

const fallbackMetadata: Metadata = {
  title: "ITR Filing | Fintaraa",
  description:
    "File your Income Tax Return with Fintaraa assisted ITR filing support, deadline guidance and inquiry tracking.",
  alternates: { canonical: "/itr-filing" },
};

export async function generateMetadata(): Promise<Metadata> {
  return getPageSeoMetadata("/itr-filing", fallbackMetadata);
}

export default function Page() {
  return <ItrPage />;
}
