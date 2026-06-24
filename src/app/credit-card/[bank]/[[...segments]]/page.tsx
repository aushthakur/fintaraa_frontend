import { redirect } from "next/navigation";

type PageProps = {
  params: Promise<{
    bank: string;
    segments?: string[];
  }>;
};

export default async function CreditCardSingularRedirect({ params }: PageProps) {
  const { bank, segments = [] } = await params;
  redirect(`/credit-cards/${bank}${segments.length ? `/${segments.join("/")}` : ""}`);
}
