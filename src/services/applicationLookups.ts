import { Post } from "@/hooks/apiUtils";

export const fetchCarRcDetails = (idNumber: string) =>
  Post<any>(
    "loanquery/rc-lookup",
    { id_number: idNumber, enrich: true },
    15000,
    true,
  );

export const fetchPersonCibil = (payload: Record<string, unknown>) =>
  Post<any>("cibil/fetch", { ...payload, consent: "Y" }, 20000, true);

export const fetchPersonCibilPdf = (payload: Record<string, unknown>) =>
  Post<any>("cibil/fetch-pdf", { ...payload, consent: "Y" }, 60000, true);
