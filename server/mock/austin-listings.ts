interface Filters {
  city: string;
  state: string;
  maxPrice: number;
  minBeds: number;
  keyword?: string;
}

interface MockListing {
  address: string;
  price: number;
  beds: number;
  baths: number;
  sqft: number | null;
  url: string;
  daysOnMarket: number | null;
  priceReduction: number | null;
  notes: string;
}

const AUSTIN_LISTINGS: MockListing[] = [
  {
    address: "4217 Clawson Rd, Austin, TX 78704",
    price: 389000,
    beds: 3,
    baths: 2,
    sqft: 1650,
    url: "https://www.realtor.com/realestateandhomes-detail/4217-Clawson-Rd_Austin_TX_78704",
    daysOnMarket: 62,
    priceReduction: 26000,
    notes: "Price cut $26k two weeks ago. Original list $415k. Quiet street near South Lamar.",
  },
  {
    address: "1903 Wickshire Ln, Austin, TX 78741",
    price: 345000,
    beds: 3,
    baths: 2,
    sqft: 1420,
    url: "https://www.realtor.com/realestateandhomes-detail/1903-Wickshire-Ln_Austin_TX_78741",
    daysOnMarket: 48,
    priceReduction: 20000,
    notes: "Reduced $20k. Seller relocating. Updated kitchen, original hardwoods.",
  },
  {
    address: "7801 Linnie Ln, Austin, TX 78724",
    price: 310000,
    beds: 4,
    baths: 2,
    sqft: 1780,
    url: "https://www.realtor.com/realestateandhomes-detail/7801-Linnie-Ln_Austin_TX_78724",
    daysOnMarket: 55,
    priceReduction: 15000,
    notes: "4-bed under $320k. Price reduced. Large backyard, near new development.",
  },
  {
    address: "2308 E Ben White Blvd #224, Austin, TX 78741",
    price: 275000,
    beds: 3,
    baths: 2,
    sqft: 1200,
    url: "https://www.realtor.com/realestateandhomes-detail/2308-E-Ben-White-Blvd-224_Austin_TX_78741",
    daysOnMarket: 71,
    priceReduction: 30000,
    notes: "Condo, $30k price drop. HOA $280/mo. Walk to shopping. Motivated seller.",
  },
  {
    address: "5604 Nasco Dr, Austin, TX 78756",
    price: 475000,
    beds: 3,
    baths: 2,
    sqft: 1950,
    url: "https://www.realtor.com/realestateandhomes-detail/5604-Nasco-Dr_Austin_TX_78756",
    daysOnMarket: 12,
    priceReduction: null,
    notes: "New listing in Brentwood. Mid-century charm. Open house this weekend.",
  },
  {
    address: "9312 Hunters Trace E, Austin, TX 78758",
    price: 335000,
    beds: 3,
    baths: 2,
    sqft: 1540,
    url: "https://www.realtor.com/realestateandhomes-detail/9312-Hunters-Trace-E_Austin_TX_78758",
    daysOnMarket: 38,
    priceReduction: 10000,
    notes: "North Austin. Price reduced $10k. Good school district, community pool.",
  },
  {
    address: "12009 Johnny Weismuller Ln, Austin, TX 78748",
    price: 420000,
    beds: 4,
    baths: 2.5,
    sqft: 2100,
    url: "https://www.realtor.com/realestateandhomes-detail/12009-Johnny-Weismuller-Ln_Austin_TX_78748",
    daysOnMarket: 29,
    priceReduction: null,
    notes: "South Austin near Slaughter. 4-bed with office nook. Well maintained.",
  },
  {
    address: "1108 Taulbee Ln, Austin, TX 78757",
    price: 495000,
    beds: 3,
    baths: 2,
    sqft: 1800,
    url: "https://www.realtor.com/realestateandhomes-detail/1108-Taulbee-Ln_Austin_TX_78757",
    daysOnMarket: 45,
    priceReduction: 18000,
    notes: "Crestview. Price cut $18k. Walkable to local restaurants. Mature trees.",
  },
  {
    address: "6700 Langston Dr, Austin, TX 78723",
    price: 365000,
    beds: 3,
    baths: 2,
    sqft: 1500,
    url: "https://www.realtor.com/realestateandhomes-detail/6700-Langston-Dr_Austin_TX_78723",
    daysOnMarket: 33,
    priceReduction: 12000,
    notes: "Windsor Park. Reduced $12k. New roof 2024. Close to Mueller.",
  },
  {
    address: "3404 Govalle Ave, Austin, TX 78702",
    price: 449000,
    beds: 3,
    baths: 2,
    sqft: 1650,
    url: "https://www.realtor.com/realestateandhomes-detail/3404-Govalle-Ave_Austin_TX_78702",
    daysOnMarket: 8,
    priceReduction: null,
    notes: "East Austin new listing. Renovated bungalow, detached ADU potential.",
  },
  {
    address: "11305 Tanglebriar Trail, Austin, TX 78750",
    price: 398000,
    beds: 4,
    baths: 2,
    sqft: 1920,
    url: "https://www.realtor.com/realestateandhomes-detail/11305-Tanglebriar-Trail_Austin_TX_78750",
    daysOnMarket: 52,
    priceReduction: 22000,
    notes: "Anderson Mill. $22k price drop, 52 days listed. 4-bed with pool.",
  },
  {
    address: "8800 Beckett Rd, Austin, TX 78749",
    price: 465000,
    beds: 3,
    baths: 2.5,
    sqft: 2050,
    url: "https://www.realtor.com/realestateandhomes-detail/8800-Beckett-Rd_Austin_TX_78749",
    daysOnMarket: 19,
    priceReduction: null,
    notes: "Circle C Ranch. Greenbelt lot, community amenities, strong schools.",
  },
];

export function getMockListings(filters: Filters): MockListing[] {
  let results = AUSTIN_LISTINGS.filter(
    (l) => l.price <= filters.maxPrice && l.beds >= filters.minBeds
  );

  if (filters.keyword) {
    const kw = filters.keyword.toLowerCase();
    results = results.filter(
      (l) =>
        l.notes.toLowerCase().includes(kw) ||
        l.address.toLowerCase().includes(kw)
    );
  }

  return results;
}
