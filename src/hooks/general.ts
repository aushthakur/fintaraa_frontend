import { assign, includes } from "./polyfills";

const IST_TIME_ZONE = "Asia/Kolkata";

const toDate = (input: any) => {
  const date = new Date(input);
  return Number.isNaN(date.getTime()) ? null : date;
};

const formatIstDate = (inputDate: any) => {
  const date = toDate(inputDate);
  if (!date) return "";
  return new Intl.DateTimeFormat("en-CA", {
    timeZone: IST_TIME_ZONE,
    year: "numeric",
    month: "2-digit",
    day: "2-digit",
  }).format(date);
};

const formatIstDateTime = (inputDate: any) => {
  const date = toDate(inputDate);
  if (!date) return "";
  const parts = new Intl.DateTimeFormat("en-GB", {
    timeZone: IST_TIME_ZONE,
    year: "numeric",
    month: "2-digit",
    day: "2-digit",
    hour: "2-digit",
    minute: "2-digit",
    hour12: false,
  }).formatToParts(date);
  const partMap = Object.fromEntries(
    parts.map((part) => [part.type, part.value]),
  );
  if (!partMap.year || !partMap.month || !partMap.day) return "";
  return `${partMap.year}-${partMap.month}-${partMap.day} ${partMap.hour ?? "00"}:${partMap.minute ?? "00"}`;
};

export function formatDate(inputDate: any) {
  return formatIstDate(inputDate);
}

export const getFileCategory = (
  fileNameOrExt: string,
): "image" | "video" | "document" | "other" => {
  const ext = fileNameOrExt.startsWith(".")
    ? fileNameOrExt.toLowerCase()
    : "." + fileNameOrExt.split(".").pop()?.toLowerCase();

  const imageExts = [".png", ".jpg", ".jpeg", ".gif", ".avif", ".webp"];
  const videoExts = [".mp4", ".mov", ".webm", ".avi"];
  const docExts = [".pdf", ".doc", ".docx"];

  if (imageExts.includes(ext)) return "image";
  if (videoExts.includes(ext)) return "video";
  if (docExts.includes(ext)) return "document";
  return "other";
};

export const deepUnflatten = (obj: any) => {
  const result = {};
  for (const flatKey in obj) {
    const keys = flatKey.replace(/\[/g, ".").replace(/\]/g, "").split(".");
    let current: any = result;

    keys.forEach((key: any, i) => {
      const isLast = i === keys.length - 1;
      const nextKey = keys[i + 1];
      if (/^\d+$/.test(key)) key = parseInt(key);
      if (isLast) {
        const val: any = obj[flatKey];
        current[key] =
          typeof val === "string" && !isNaN(Number(val)) ? Number(val) : val;
      } else {
        if (!current[key]) {
          current[key] = /^\d+$/.test(nextKey) ? [] : {};
        }
        current = current[key];
      }
    });
  }
  return result;
};

export const flattenObject = (
  obj: any,
  prefix = "",
  excludeKeys: string[] = [],
): Record<string, any> => {
  let result: Record<string, any> = {};

  for (const key in obj) {
    if (!obj.hasOwnProperty(key)) continue;

    const value = obj[key];
    const fullKey = prefix ? `${prefix}.${key}` : key;

    // Skip flattening if key is in excludeKeys
    if (excludeKeys.includes(fullKey)) {
      result[fullKey] = value;
      continue;
    }

    const prefixedKey = Array.isArray(obj)
      ? `${prefix}[${key}]`
      : prefix
        ? `${prefix}.${key}`
        : key;

    if (
      value !== null &&
      typeof value === "object" &&
      !Array.isArray(value) &&
      !(value instanceof Date)
    ) {
      const nested = flattenObject(value, prefixedKey, excludeKeys);
      result = { ...result, ...nested };
    } else if (Array.isArray(value)) {
      value.forEach((val, i) => {
        const arrayKey = `${prefixedKey}[${i}]`;
        if (typeof val === "object" && val !== null) {
          const nested = flattenObject(val, arrayKey, excludeKeys);
          result = { ...result, ...nested };
        } else {
          result[arrayKey] = val;
        }
      });
    } else {
      result[prefixedKey] = value;
    }
  }
  return result;
};

export const makeFormData = (formData: any, allowObjectParse?: any) => {
  const data = new FormData();
  const appendToFormData = (key: string, value: any) => {
    if (value instanceof File) data.append(key, value);
    else if (Array.isArray(value)) {
      value.forEach((item, index) => {
        if (item instanceof File) data.append(`${key}[${index}]`, item);
        else if (typeof item === "object" && item !== null) {
          Object.entries(item).forEach(([subKey, subValue]) => {
            if (subValue instanceof File) {
              data.append(`${key}[${index}][${subKey}]`, subValue);
            } else data.append(`${key}[${index}][${subKey}]`, String(subValue));
          });
        } else data.append(`${key}[${index}]`, String(item));
      });
    } else if (typeof value === "object" && value !== null) {
      if (allowObjectParse)
        Object.entries(value).forEach(([subKey, subValue]) =>
          appendToFormData(`${key}[${subKey}]`, subValue),
        );
      else data.append(key, value);
    } else data.append(key, String(value));
  };

  Object.entries(formData).forEach(([key, value]) => {
    if (value !== null && value !== undefined) {
      appendToFormData(key, value);
    }
  });
  return data;
};

/**
 * Evaluates a value that might be a string ("active" / "inactive") or boolean.
 * Returns true if:
 *   - value is boolean true
 *   - value is string "active" (case-insensitive)
 */
export function evaluateBooleanInput(
  value: string | boolean | undefined | null,
): boolean {
  if (typeof value === "boolean") return value;
  if (typeof value === "string") return value.toLowerCase() === "active";
  return false;
}

export function formatDateTime(inputDate: any) {
  return formatIstDateTime(inputDate);
}

export function formatTime(inputTime: any) {
  const date = toDate(inputTime);
  if (!date) return "";
  return new Intl.DateTimeFormat("en-US", {
    timeZone: IST_TIME_ZONE,
    year: "numeric",
    weekday: "long",
    day: "numeric",
    month: "short",
    hour: "numeric",
    minute: "numeric",
    hour12: true,
  }).format(date);
}

export const format12Hour = (time: any) => {
  const date = toDate(time);
  if (!date) return "";
  return new Intl.DateTimeFormat("en-US", {
    timeZone: IST_TIME_ZONE,
    hour: "numeric",
    minute: "numeric",
    hour12: true,
  }).format(date);
};

export const debounce = (func: any, delay: number) => {
  let timeoutId: NodeJS.Timeout | null = null;
  return (...args: any[]) => {
    if (timeoutId) clearTimeout(timeoutId);
    timeoutId = setTimeout(() => {
      func(...args);
    }, delay);
  };
};

export const getAccessPoints = (
  user: any,
  label: string,
  viewStock?: boolean,
) => {
  const userPermissions = user?.permissions ?? [];
  let accessPoints: any = userPermissions.filter(
    (e: any) => e.module === label,
  );
  if (accessPoints && accessPoints.length > 0)
    accessPoints = accessPoints[0]?.access;
  else accessPoints = {};

  if (viewStock) return { ...accessPoints, viewStock: viewStock };
  else return accessPoints;
};

export const normalizeToArray = (value?: string | string[]) => {
  if (!value) return [];
  return Array.isArray(value) ? value : [value];
};

export const populateFormFields = (
  fields: any,
  product: any,
  disabledFields?: string[],
  removeFromHere?: string[],
) => {
  return fields
    .filter((field: any) => {
      return !(removeFromHere && includes(removeFromHere, field.name));
    })
    .map((field: any) => {
      const isDisabled =
        disabledFields && includes(disabledFields, field.name)
          ? true
          : field.isDisabled;
      return product.hasOwnProperty(field.name)
        ? {
            ...field,
            value: product[field.name],
            isDisabled,
          }
        : {
            ...field,
            isDisabled,
          };
    });
};

export const flattenOneLevelPreserveKeys = (obj: Record<string, any>) => {
  const result: Record<string, any> = {};
  for (const key in obj) {
    const value = obj[key];
    if (typeof value === "object" && !Array.isArray(value) && value !== null) {
      Object.assign(result, value); // flatten into root
    } else {
      result[key] = value;
    }
  }
  return result;
};

// Helper function to get nested value from object using dot notation
const getNestedValue = (obj: any, path: string): any => {
  if (!path) return undefined;
  return path
    .replace(/\[(\w+)\]/g, ".$1") // users[0] -> users.0
    .split(".")
    .reduce((acc, part) => acc?.[part], obj);
};

export const populateFormData = (fields: any, product: any) => {
  const object = {};
  fields.map((field: any) => {
    const fieldName = field.name;

    const normalizeFieldValue = (value: any) => {
      if (field?.type === "select") {
        if (field?.isMultiple && Array.isArray(value)) {
          return value.map((item: any) =>
            item && typeof item === "object"
              ? item?._id || item?.value || item?.id || item
              : item,
          );
        }

        if (value && typeof value === "object" && !Array.isArray(value)) {
          return value?._id || value?.value || value?.id || "";
        }
      }

      return value;
    };

    // Handle direct property access (for simple fields like "name", "email")
    if (product.hasOwnProperty(fieldName)) {
      assign(object, { [fieldName]: normalizeFieldValue(product[fieldName]) });
    }
    // Handle dot notation fields (e.g., "notifications.sms", "notifications.push")
    else if (fieldName.includes(".")) {
      const parts = fieldName.split(".");
      const rootKey = parts[0];
      const nestedKey = parts.slice(1).join(".");

      // Check if root key exists in product (handle both singular/plural)
      let rootValue = product[rootKey];
      if (!rootValue && rootKey) {
        // Try singular/plural variations (e.g., "notification" vs "notifications")
        const alternateKey = rootKey.endsWith("s")
          ? rootKey.slice(0, -1)
          : rootKey + "s";
        rootValue = product[alternateKey];
      }

      // If root value exists and is an object, get nested value
      if (
        rootValue &&
        typeof rootValue === "object" &&
        !Array.isArray(rootValue)
      ) {
        const nestedValue = getNestedValue(rootValue, nestedKey);
        if (nestedValue !== undefined && nestedValue !== null) {
          assign(object, { [fieldName]: normalizeFieldValue(nestedValue) });
        }
      }
    }
    // Try to get value using dot notation as fallback (in case product structure matches field name)
    else {
      const nestedValue = getNestedValue(product, fieldName);
      if (nestedValue !== undefined && nestedValue !== null) {
        assign(object, { [fieldName]: normalizeFieldValue(nestedValue) });
      }
    }
  });
  return object;
};

export const updateFormData = (
  formData: FormData,
  nestedFieldKey: string,
  nestedFields: string[],
  fieldsToRemove: string[],
) => {
  const updatedFormData = new FormData();
  const nestedData: Record<string, any> = {};
  for (const [key, value] of formData.entries()) {
    if (nestedFields.includes(key)) nestedData[key] = value;
    else if (!fieldsToRemove.includes(key)) updatedFormData.append(key, value);
  }
  updatedFormData.append(nestedFieldKey, JSON.stringify(nestedData));
  return updatedFormData;
};

export const getSelectFormattedData = (data: any) => {
  const response: any = data.map((option: any) => ({
    label:
      option?.name ||
      option?.type ||
      option.title ||
      option?.address ||
      option?.username ||
      `${option.firstName} ${option.lastName}`,
    value: option?._id,
    email: option?.email,
  }));
  return response;
};

export function nestFields(
  obj: Record<string, any>,
  key: string,
  fieldsToNest: string[],
): Record<string, any> {
  const nestedObject: Record<string, any> = {};
  const updatedObject: Record<string, any> = { ...obj };

  fieldsToNest.forEach((field) => {
    if (field in updatedObject) {
      nestedObject[field] = updatedObject[field];
      delete updatedObject[field];
    }
  });
  updatedObject[key] = nestedObject;
  return updatedObject;
}

type NestedObject = {
  [key: string]: any;
};

export function removeSuffixInNestedObject(
  obj: NestedObject,
  nestedKey: string,
  suffix: string,
): NestedObject {
  const nestedObj = obj[nestedKey];

  if (!nestedObj || typeof nestedObj !== "object") {
    return obj; // Return the original object if nestedKey is invalid
  }

  const updatedNestedObj = Object.entries(nestedObj).reduce(
    (acc: NestedObject, [key, value]) => {
      const newKey = key.replace(new RegExp(`${suffix}$`), ""); // Remove the suffix
      acc[newKey] = value;
      return acc;
    },
    {},
  );

  return {
    ...obj,
    [nestedKey]: updatedNestedObj, // Update the nested object
  };
}

export const formatRupee = (amount: any) => {
  return new Intl.NumberFormat("en-IN", {
    style: "currency",
    currency: "INR",
    minimumFractionDigits: 2,
  }).format(amount);
};

export const formatCompactNumber = (num: number) => {
  if (!num) return "-";

  if (num >= 1_00_00_00_000) {
    return (num / 1_00_00_00_000).toFixed(2) + "T"; // Trillion
  } else if (num >= 1_00_00_00_000) {
    return (num / 1_00_00_00_000).toFixed(2) + "B"; // Billion
  } else if (num >= 1_00_00_000) {
    return (num / 1_00_00_000).toFixed(2) + "Cr"; // Crore
  } else if (num >= 1_00_000) {
    return (num / 1_00_000).toFixed(2) + "L"; // Lakh
  } else if (num >= 1_000) {
    return (num / 1_000).toFixed(2) + "K"; // Thousand
  }
  return num.toString(); // Less than 1000, return as is
};

export const formatIndianCurrency = (amount: number) => {
  let formattedAmount: string;
  if (!amount) return "-";

  if (amount >= 1_00_00_00_000) {
    formattedAmount = (amount / 1_00_00_00_000).toFixed(2) + "T"; // Trillion
  } else if (amount >= 1_00_00_000) {
    formattedAmount = (amount / 1_00_00_000).toFixed(2) + "Cr"; // Crore
  } else if (amount >= 1_00_000) {
    formattedAmount = (amount / 1_00_000).toFixed(2) + "L"; // Lakh
  } else if (amount >= 1_000) {
    formattedAmount = (amount / 1_000).toFixed(2) + "K"; // Thousand
  } else {
    formattedAmount = amount.toFixed(2); // Normal amount
  }

  return `₹${formattedAmount}`;
};

export const formatCurrency = (value: number | undefined) =>
  value && !isNaN(value)
    ? new Intl.NumberFormat("en-IN", {
        style: "currency",
        currency: "INR",
        minimumFractionDigits: 2,
      }).format(value)
    : "₹0.00";

export const convertTo24Hour = (time: string): string => {
  console.log(time);
  const [timePart, period] = time.split(" ");
  let [hours] = timePart.split(":").map(Number);
  const [, minutes] = timePart.split(":").map(Number);

  if (period === "PM" && hours !== 12) {
    hours += 12;
  } else if (period === "AM" && hours === 12) {
    hours = 0;
  }
  return `${hours.toString().padStart(2, "0")}:${minutes
    .toString()
    .padStart(2, "0")}`;
};

export const groupAndFilterSlots = (slots: any[]): any => {
  const groupedSlots: Record<string, any[]> = {};
  slots.forEach((slot) => {
    if (!groupedSlots[slot.date]) {
      groupedSlots[slot.date] = [];
    }
    groupedSlots[slot.date].push({
      _id: slot._id,
      date: slot.date,
      end_time: slot.endTime,
      start_time: slot.startTime,
    });
  });
  return groupedSlots;
};

export const filterUpcomingSlots = (slots: any) => {
  const currentTime = new Date();
  const currentDate = currentTime.toISOString().split("T")[0]; // Get YYYY-MM-DD format
  const currentHours = currentTime.getHours();
  const currentMinutes = currentTime.getMinutes();

  const parseTime = (time: string) => {
    const [hourMinute, period] = time.split(" ");
    let [hours] = hourMinute.split(":").map(Number);
    const [, minutes] = hourMinute.split(":").map(Number);
    if (period === "PM" && hours !== 12) hours += 12;
    if (period === "AM" && hours === 12) hours = 0;
    return { hours, minutes };
  };

  return slots.filter(({ start_time, date }: any) => {
    if (date !== currentDate) return true; // If not today, return all

    const { hours, minutes } = parseTime(start_time);
    return (
      hours > currentHours ||
      (hours === currentHours && minutes > currentMinutes)
    );
  });
};

export function filterFutureSlots(slotsByDate: any) {
  const now = new Date();
  const filtered: any = {};
  Object.entries(slotsByDate).forEach(([dateKey, slots]: any) => {
    const filteredSlots = slots.filter((slot: any) => {
      // Fix for Safari or inconsistent date parsing: parse manually
      const [hourMin, meridiem] = slot.start_time.split(" ");
      let [hours] = hourMin.split(":").map(Number);
      const [, minutes] = hourMin.split(":").map(Number);
      if (meridiem === "PM" && hours < 12) hours += 12;
      if (meridiem === "AM" && hours === 12) hours = 0;

      const [year, month, day] = slot.date.split("-").map(Number);
      const slotDateObj = new Date(year, month - 1, day, hours, minutes);

      return slotDateObj.getTime() > now.getTime();
    });

    if (filteredSlots.length > 0) {
      filtered[dateKey] = filteredSlots;
    }
  });

  return filtered;
}

export const getDatesBetween = (
  startDate: string,
  endDate: string,
): string[] => {
  const start = new Date(startDate);
  const end = new Date(endDate);

  if (start > end) {
    throw new Error("Start date cannot be after the end date");
  }
  const datesArray: string[] = [];
  const currentDate = new Date(start);
  while (currentDate <= end) {
    datesArray.push(currentDate.toISOString().split("T")[0]);
    currentDate.setDate(currentDate.getDate() + 1);
  }
  return datesArray;
};

export function normalizeUploadPath(path: string): string {
  const normalized = path.replace(/\\/g, "/").replace(/\/+/g, "/");
  return normalized.startsWith("/") ? normalized : `/${normalized}`;
}

export const normalizePath = (path: string): string => {
  if (!path) return "";
  let normalized = path.replace(/\\/g, "/");
  if (!normalized.startsWith("/")) normalized = "/" + normalized;

  return normalized;
};
