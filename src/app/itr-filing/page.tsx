import type { Metadata } from "next";
import { ItrPage } from "@/components/services/itr/ItrPage";

export const metadata: Metadata = {
  title: "ITR Filing | Fintaraa",
  description:
    "File your Income Tax Return with Fintaraa assisted ITR filing support, deadline guidance and inquiry tracking.",
  alternates: { canonical: "/itr-filing" },
};

export default function Page() {
  return <ItrPage />;
}
