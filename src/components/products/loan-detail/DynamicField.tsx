import type { LoanSeoFormField } from "@/services/loanSeoPages";
import { fieldClass } from "./LoanDetailConstants";

export function DynamicField({ field }: { field: LoanSeoFormField }) {
  if (field.type === "select") {
    return (
      <select required={field.required} className={fieldClass} defaultValue="">
        <option value="" disabled>
          {field.placeholder || field.label}
        </option>
        {(field.options || []).map((option) => (
          <option key={option} value={option}>
            {option}
          </option>
        ))}
      </select>
    );
  }

  return (
    <input
      required={field.required}
      type={field.type || "text"}
      placeholder={field.placeholder || field.label}
      className={fieldClass}
    />
  );
}