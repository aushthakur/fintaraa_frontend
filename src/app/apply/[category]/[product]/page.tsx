import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { ApplicationFlowPage } from "@/components/application/ApplicationFlowPage";
import {
  getApplicationFlow,
  humanizeProduct,
  type ApplicationCategory,
} from "@/components/application/flowRegistry";
import { noIndexRobots } from "@/services/seoConfig";

type PageProps = {
  params: Promise<{ category: string; product: string }>;
  searchParams: Promise<{ referrer?: string; bank?: string }>;
};

export async function generateMetadata({
  params,
}: PageProps): Promise<Metadata> {
  const { category, product } = await params;
  const title = `Apply for ${humanizeProduct(product)}`;
  return {
    title,
    description: `Complete your ${category} application for ${humanizeProduct(product)} on Fintaraa.`,
    alternates: { canonical: `/apply/${category}/${product}` },
    robots: noIndexRobots,
  };
}

export default async function ApplyProductPage({
  params,
  searchParams,
}: PageProps) {
  const { category, product } = await params;
  const { referrer, bank } = await searchParams;
  if (category !== "loan" && category !== "insurance") notFound();

  const resolved = getApplicationFlow(category as ApplicationCategory, product);
  if (!resolved) notFound();

  return (
    <ApplicationFlowPage
      category={category as ApplicationCategory}
      productSlug={product}
      flowKey={resolved.flowKey}
      flow={resolved.flow}
      referrer={referrer}
      bank={bank}
    />
  );
}
