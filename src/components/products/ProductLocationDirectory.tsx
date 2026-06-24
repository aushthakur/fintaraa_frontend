import Link from "next/link";
import {
  Building2,
  LocateFixed,
  Map,
  MapPin,
  Navigation,
} from "lucide-react";
import {
  slugifyProduct,
  type ParsedLoanLocation,
} from "@/lib/productRouting";

type LocationDirectoryPage = {
  title?: string;
  canonicalPath?: string;
  location?: Partial<ParsedLoanLocation>;
  priority?: number;
};

type DirectoryItem = {
  key: string;
  label: string;
  href: string;
  priority?: number;
};

const normalizeLocation = (
  location?: Partial<ParsedLoanLocation>,
): ParsedLoanLocation => ({
  country: location?.country || "India",
  state: location?.state || "",
  city: location?.city || "",
  pincode: location?.pincode || "",
  area: location?.area || "",
});

const sameText = (first?: string, second?: string) =>
  String(first || "").trim().toLowerCase() ===
  String(second || "").trim().toLowerCase();

const uniqueItems = (items: DirectoryItem[]) => {
  const seen = new Set<string>();
  return items
    .filter((item) => {
      if (!item.label || !item.href || seen.has(item.key)) return false;
      seen.add(item.key);
      return true;
    })
    .sort(
      (a, b) =>
        (a.priority || 999) - (b.priority || 999) ||
        a.label.localeCompare(b.label),
    );
};

const buildPath = (
  productSlug: string,
  location: Partial<ParsedLoanLocation>,
) =>
  [
    "/products",
    productSlug,
    location.state && slugifyProduct(location.state),
    location.city && slugifyProduct(location.city),
    location.pincode && slugifyProduct(location.pincode),
    location.area && slugifyProduct(location.area),
  ]
    .filter(Boolean)
    .join("/");

const makeTitle = (
  productName: string,
  location: Partial<ParsedLoanLocation>,
) => {
  const suffix = [
    location.area,
    location.pincode,
    location.city,
    location.state,
  ]
    .filter(Boolean)
    .join(", ");
  return suffix ? `${productName} in ${suffix}` : productName;
};

function LinkRow({
  items,
  maxItems = 120,
}: {
  items: DirectoryItem[];
  maxItems?: number;
}) {
  const visible = items.slice(0, maxItems);
  if (!visible.length) return null;

  return (
    <p className="mx-auto mt-4 max-w-8xl text-center text-[15px] font-medium leading-8 text-[#8b95a3] md:text-[17px] md:leading-9">
      {visible.map((item, index) => (
        <span key={item.key}>
          <Link
            href={item.href}
            className="text-[#7f8995] no-underline transition hover:text-[#00529b]"
          >
            {item.label}
          </Link>
          {index < visible.length - 1 ? (
            <span className="px-2 text-[#ccd4dc]">/</span>
          ) : null}
        </span>
      ))}
      {items.length > maxItems ? (
        <span className="pl-2 text-[13px] font-semibold text-[#98a2b3]">
          +{items.length - maxItems} more
        </span>
      ) : null}
    </p>
  );
}

function DirectorySection({
  title,
  icon: Icon,
  items,
  maxItems,
}: {
  title: string;
  icon: typeof Map;
  items: DirectoryItem[];
  maxItems?: number;
}) {
  if (!items.length) return null;

  return (
    <div className="py-8">
      <div className="flex items-center justify-center gap-2">
        <Icon className="h-4 w-4 text-[#00529b]" />
        <h2 className="text-center text-[18px] font-black uppercase tracking-[0.08em] text-[#3f4650] md:text-[20px]">
          {title}
        </h2>
      </div>
      <LinkRow items={items} maxItems={maxItems} />
    </div>
  );
}

export function ProductLocationDirectory({
  productName,
  productSlug,
  currentLocation,
  pages,
}: {
  productName: string;
  productSlug: string;
  currentLocation?: Partial<ParsedLoanLocation>;
  pages: LocationDirectoryPage[];
}) {
  const current = normalizeLocation(currentLocation);
  const locations = pages
    .map((page) => ({
      ...page,
      location: normalizeLocation(page.location),
    }))
    .filter((page) => page.location.state);

  if (!locations.length) return null;

  const stateItems = uniqueItems(
    locations.map((page) => ({
      key: `state:${page.location.state}`,
      label: `${productName} in ${page.location.state}`,
      href: buildPath(productSlug, { state: page.location.state }),
      priority: page.priority,
    })),
  );

  const currentStatePages = current.state
    ? locations.filter((page) => sameText(page.location.state, current.state))
    : locations;
  const currentCityPages = current.city
    ? currentStatePages.filter((page) => sameText(page.location.city, current.city))
    : currentStatePages;
  const currentPincodePages = current.pincode
    ? currentCityPages.filter((page) =>
        sameText(page.location.pincode, current.pincode),
      )
    : currentCityPages;

  const cityItems = uniqueItems(
    currentStatePages
      .filter((page) => page.location.city)
      .map((page) => ({
        key: `city:${page.location.state}:${page.location.city}`,
        label: makeTitle(productName, {
          state: page.location.state,
          city: page.location.city,
        }),
        href: buildPath(productSlug, {
          state: page.location.state,
          city: page.location.city,
        }),
        priority: page.priority,
      })),
  );

  const pincodeItems = uniqueItems(
    currentCityPages
      .filter((page) => page.location.pincode)
      .map((page) => ({
        key: `pincode:${page.location.state}:${page.location.city}:${page.location.pincode}`,
        label: makeTitle(productName, {
          state: page.location.state,
          city: page.location.city,
          pincode: page.location.pincode,
        }),
        href: buildPath(productSlug, {
          state: page.location.state,
          city: page.location.city,
          pincode: page.location.pincode,
        }),
        priority: page.priority,
      })),
  );

  const areaSource = current.pincode ? currentPincodePages : currentCityPages;
  const areaItems = uniqueItems(
    areaSource
      .filter((page) => page.location.area)
      .map((page) => ({
        key: `area:${page.location.state}:${page.location.city}:${page.location.pincode}:${page.location.area}`,
        label: makeTitle(productName, page.location),
        href:
          page.canonicalPath ||
          buildPath(productSlug, {
            state: page.location.state,
            city: page.location.city,
            pincode: page.location.pincode,
            area: page.location.area,
          }),
        priority: page.priority,
      })),
  );

  const hasState = Boolean(current.state);
  const hasCity = Boolean(current.city);
  const hasPincode = Boolean(current.pincode);
  const hasArea = Boolean(current.area);

  const titlePrefix = `${productName} Location Pages`;

  return (
    <section className="bg-[#fbfcfd] px-4 py-8 md:px-6 lg:px-8">
      <div className="mx-auto max-w-9xl divide-y divide-[#edf1f4]">
        {!hasState ? (
          <>
            <DirectorySection
              title={`${titlePrefix} By State`}
              icon={Map}
              items={stateItems}
              maxItems={50}
            />
            <DirectorySection
              title={`Popular ${productName} City Pages`}
              icon={Building2}
              items={cityItems}
              maxItems={80}
            />
            <DirectorySection
              title={`Popular ${productName} Area Pages`}
              icon={MapPin}
              items={areaItems}
              maxItems={100}
            />
          </>
        ) : (
          <>
            <DirectorySection
              title={`${productName} Pages In ${current.state}`}
              icon={Navigation}
              items={hasCity ? pincodeItems : cityItems}
              maxItems={100}
            />
            {hasCity ? (
              <DirectorySection
                title={`${productName} Pincode Pages In ${current.city}`}
                icon={LocateFixed}
                items={pincodeItems}
                maxItems={120}
              />
            ) : (
              <DirectorySection
                title={`${productName} Pincode Pages In ${current.state}`}
                icon={LocateFixed}
                items={pincodeItems}
                maxItems={120}
              />
            )}
            <DirectorySection
              title={
                hasPincode
                  ? `${productName} Area Pages In ${current.pincode}`
                  : hasCity
                    ? `${productName} Area Pages In ${current.city}`
                    : `${productName} Area Pages In ${current.state}`
              }
              icon={MapPin}
              items={areaItems}
              maxItems={140}
            />
            {hasArea ? (
              <DirectorySection
                title={`More ${productName} State Pages`}
                icon={Map}
                items={stateItems}
                maxItems={50}
              />
            ) : null}
          </>
        )}
      </div>
    </section>
  );
}
