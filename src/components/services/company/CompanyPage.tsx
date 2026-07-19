import { BusinessServicePage } from "@/components/services/business/BusinessServicePage";
import { companyRegistrationConfig } from "@/components/services/business/businessServiceData";

export function CompanyPage() {
  return <BusinessServicePage config={companyRegistrationConfig} />;
}
