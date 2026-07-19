"use client";

import { useEffect, useState } from "react";
import {
  fetchProductCatalog,
  getFallbackProductCatalog,
  type ProductCatalog,
} from "@/services/productCatalog";

export function useProductCatalog() {
  const [catalog, setCatalog] = useState<ProductCatalog>(
    getFallbackProductCatalog,
  );

  useEffect(() => {
    let active = true;

    void fetchProductCatalog().then((result) => {
      if (active) setCatalog(result);
    });

    return () => {
      active = false;
    };
  }, []);

  return catalog;
}
