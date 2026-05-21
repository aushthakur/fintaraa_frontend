export interface FilterOption {
  label: string;
  value: string;
}

export interface TableColumnPreferenceItem {
  id: string;
  label: string;
  visible: boolean;
}

export interface TableColumnPreferenceState {
  version: number;
  visibleColumnIds: string[];
  updatedAt: string;
}

export interface MultiPurposeActionPayload {
  id: any;
  _id: any;
  text: string;
  row?: any;
  value?: string | string[];
  status?: string | string[];
}

export type MultiPurposeProps = {
  options?: string[];
  type: "label" | "button" | "select";
  onClick?: (payload: MultiPurposeActionPayload) => void;
  onSelectChange?: (payload: MultiPurposeActionPayload) => void;
  isMultiple?: boolean;
  placeholder?: string;
  selectedValues?: string[];
};

export type ColConfig = {
  key: string | string[];
  sortable?: boolean;
  key2?: string | string[];
  join?: boolean;
  image?: boolean;
  length?: number;
  prefix?: string;
  suffix?: string;
  joiner?: string;
  isAMPm?: boolean;
  isTime?: boolean;
  isDate?: boolean;
  fallback?: string;
  urlLink?: boolean;
  isPercent?: string;
  jsonFormat?: boolean;
  isDateTime?: boolean;
  isCurrency?: boolean;
  imageWithKey?: string;
  staticValue?: string | number;
  isMultiPurpose?: boolean;
  truncateWords?: boolean;
  multiPurposeProps?: MultiPurposeProps;
  transform?: "uppercase" | "lowercase" | "capitalize";
  valueFormatter?: (value: any, row?: any) => string;
};

export interface FormField {
  name: string;
  label: string;
  instructions?: any;
  step?: string;
  stepDescription?: string;
  customClasses?: any;
  type:
  | "text"
  | "label"
  | "br"
  | "button"
  | "dynamicObject"
  | "arrayOfString"
  | "warehouse"
  | "packing"
  | "billing"
  | "purchaseForm"
  | "productBillingForm"
  | "stockTransferForm"
  | "email"
  | "password"
  | "richTextEditor"
  | "file"
  | "date"
  | "datetime-local"
  | "multipleFiles"
  | "select"
  | "checkbox"
  | "businesshours"
  | "radio"
  | "url"
  | "number"
  | "textarea"
  | "choose"
  | "stringNumeric"
  | "productForm";
  value?: any;
  rows?: number;
  min?: number;
  max?: number;
  minDate?: any;
  maxDate?: any;
  options?: any;
  accept?: string;
  isVideo?: boolean;
  maxFiles?: number;
  currentDate?: any;
  maxSizeMB?: number;
  maxLength?: number;
  multiple?: boolean;
  maxImages?: number;
  required?: boolean;
  widthFull?: boolean;
  isMultiple?: boolean;
  alphabeticalFilter?: boolean;
  placeholder?: string;
  confirmPlaceholder?: string;
  validation?: (value: any) => string | null;
  isDisabled?: boolean;
}
