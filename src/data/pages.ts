/** The rate pages, in the order they appear in menus. Each one is a route under src/app. */
export const ratePages = [
  { href: "/dollar-rate-today-pakistan", short: "Dollar rate", label: "Dollar rate today" },
  { href: "/gold-rate-today-pakistan", short: "Gold rate", label: "Gold rate today" },
  { href: "/petrol-price-today-pakistan", short: "Petrol price", label: "Petrol and diesel price today" },
  { href: "/currency-rates-pakistan", short: "All currencies", label: "All currency rates" },
  { href: "/silver-rate-today-pakistan", short: "Silver rate", label: "Silver rate today" },
  { href: "/lpg-price-today-pakistan", short: "LPG price", label: "LPG price today" },
] as const;

/** Currency pages: one per currency people in the Gulf, UK and elsewhere convert into rupees. */
export const currencyPages = [
  { code: "USD", name: "US dollar", country: "United States", slug: "usd-to-pkr", unit: "dollar" },
  { code: "AED", name: "UAE dirham", country: "United Arab Emirates", slug: "aed-to-pkr", unit: "dirham" },
  { code: "SAR", name: "Saudi riyal", country: "Saudi Arabia", slug: "sar-to-pkr", unit: "riyal" },
  { code: "GBP", name: "British pound", country: "United Kingdom", slug: "gbp-to-pkr", unit: "pound" },
  { code: "EUR", name: "Euro", country: "the euro area", slug: "eur-to-pkr", unit: "euro" },
  { code: "QAR", name: "Qatari riyal", country: "Qatar", slug: "qar-to-pkr", unit: "riyal" },
  { code: "KWD", name: "Kuwaiti dinar", country: "Kuwait", slug: "kwd-to-pkr", unit: "dinar" },
  { code: "OMR", name: "Omani rial", country: "Oman", slug: "omr-to-pkr", unit: "rial" },
  { code: "BHD", name: "Bahraini dinar", country: "Bahrain", slug: "bhd-to-pkr", unit: "dinar" },
  { code: "CAD", name: "Canadian dollar", country: "Canada", slug: "cad-to-pkr", unit: "dollar" },
  { code: "AUD", name: "Australian dollar", country: "Australia", slug: "aud-to-pkr", unit: "dollar" },
  { code: "MYR", name: "Malaysian ringgit", country: "Malaysia", slug: "myr-to-pkr", unit: "ringgit" },
  { code: "CNY", name: "Chinese yuan", country: "China", slug: "cny-to-pkr", unit: "yuan" },
  { code: "TRY", name: "Turkish lira", country: "Turkey", slug: "try-to-pkr", unit: "lira" },
  { code: "JPY", name: "Japanese yen", country: "Japan", slug: "jpy-to-pkr", unit: "yen" },
] as const;

export type CurrencyCode = (typeof currencyPages)[number]["code"];

export function currencyPage(slug: string) {
  return currencyPages.find((page) => page.slug === slug);
}

/**
 * Cities people add to a rate search ("gold rate today lahore", "petrol price karachi").
 * Gold follows one national reference (the Karachi Sarafa rate) and petrol is one OGRA
 * price for the whole country, so the pages show the same figure for each city and say so.
 */
export const cities = [
  "Karachi",
  "Lahore",
  "Islamabad",
  "Rawalpindi",
  "Peshawar",
  "Faisalabad",
  "Multan",
  "Quetta",
  "Hyderabad",
  "Gujranwala",
  "Sialkot",
] as const;
