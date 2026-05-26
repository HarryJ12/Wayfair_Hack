export type ProductOption = {
  id: string;
  name: string;
  price: number;
  dimensions: string;
  material: string;
  delivery: string;
  assembly?: string;
  fitCheck?: string;
  reviewSummary: string;
  imageUrl: string;
  wayfairSignals?: string[];
  trustSignals?: string[];
  tags: string[];
  risk: string;
  whyItMatters: string;
};

export type CouncilScenario = {
  id: string;
  title: string;
  room: string;
  shopperGoal: string;
  shopperProfile: string;
  constraints: string[];
  products: ProductOption[];
};

export const scenarios: CouncilScenario[] = [
  {
    id: "tiny-apartment-sofa",
    title: "Tiny Apartment Sofa",
    room: "Living room",
    shopperGoal:
      "Pick a sofa for a 640 square foot Boston apartment that still feels grown-up.",
    shopperProfile:
      "Renter, hosts friends twice a month, has narrow stairs, wants a sofa that photographs well.",
    constraints: [
      "Under $950",
      "Must fit through a 30 inch doorway",
      "Prefer performance fabric",
      "Needs delivery in under 10 days",
    ],
    products: [
      {
        id: "sofa-maribel",
        name: "Maribel 78 Inch Reversible Sofa",
        price: 849,
        dimensions: '78"W x 35"D x 34"H',
        material: "Performance woven polyester",
        delivery: "Arrives in 6-8 days, ships in two boxes",
        assembly: "Tool-free sectional clips, two-person setup recommended",
        fitCheck:
          "Wayfair-style dimensions make the 78 inch width and 35 inch depth easy to compare against the apartment doorway and wall span.",
        reviewSummary:
          "Praised for apartment fit and easy assembly. Some reviews mention firm cushions.",
        imageUrl:
          "https://images.unsplash.com/photo-1555041469-a586c61ea9bc?auto=format&fit=crop&w=900&q=80",
        wayfairSignals: [
          "Dimensions section",
          "View in Room style check",
          "Delivery window",
          "Assembly details",
        ],
        trustSignals: ["Review pattern", "Verified marketplace-style listing"],
        tags: ["compact", "reversible chaise", "performance fabric"],
        risk: "Firm seat feel may not work for movie-night loungers.",
        whyItMatters:
          "It balances real seating capacity with apartment delivery constraints.",
      },
      {
        id: "sofa-arden",
        name: "Arden Modular Loveseat",
        price: 699,
        dimensions: '64"W x 34"D x 33"H',
        material: "Linen blend upholstery",
        delivery: "Arrives in 4-6 days, light-box delivery",
        assembly: "Simple bolt-on legs, easiest setup in the set",
        fitCheck:
          "The smaller footprint is safest for a narrow stairwell, but shoppers should measure seat width against hosting needs.",
        reviewSummary:
          "Easy for tight spaces, but several buyers wanted a deeper seat.",
        imageUrl:
          "https://images.unsplash.com/photo-1493663284031-b7e3aefcae8e?auto=format&fit=crop&w=900&q=80",
        wayfairSignals: [
          "Dimensions section",
          "Fast delivery estimate",
          "Customer photos",
        ],
        trustSignals: ["Budget pick reviews", "Clear return expectations"],
        tags: ["lowest risk delivery", "small footprint", "budget"],
        risk: "May feel undersized as the main sofa.",
        whyItMatters:
          "It is the safest delivery choice, but less impressive for hosting.",
      },
      {
        id: "sofa-lennox",
        name: "Lennox 84 Inch Track Arm Sofa",
        price: 1049,
        dimensions: '84"W x 38"D x 35"H',
        material: "Chenille upholstery",
        delivery: "Arrives in 9-12 days, oversized item",
        assembly: "White-glove style delivery preferred because of size",
        fitCheck:
          "The 84 inch width needs real room planning; View in Room is useful before committing to the premium look.",
        reviewSummary:
          "Very comfortable and stylish, but delivery comments are mixed for older buildings.",
        imageUrl:
          "https://images.unsplash.com/photo-1540574163026-643ea20ade25?auto=format&fit=crop&w=900&q=80",
        wayfairSignals: [
          "View in Room style check",
          "Oversized delivery disclosure",
          "Dimensions section",
        ],
        trustSignals: ["Premium reviews", "Delivery-risk reviews"],
        tags: ["most comfortable", "oversized", "premium"],
        risk: "Over budget and most likely to create delivery friction.",
        whyItMatters:
          "It looks like the aspirational pick, but breaks two key constraints.",
      },
    ],
  },
  {
    id: "remote-work-desk",
    title: "Remote Work Desk",
    room: "Home office",
    shopperGoal:
      "Choose a desk for a remote worker who needs focus space without making the bedroom feel like an office.",
    shopperProfile:
      "Works from home four days per week, has a 27 inch monitor, and cares about cable clutter.",
    constraints: [
      "Under $500",
      "At least 42 inches wide",
      "Storage preferred",
      "Should look calm on video calls",
    ],
    products: [
      {
        id: "desk-nova",
        name: "Nova 48 Inch Writing Desk",
        price: 319,
        dimensions: '48"W x 24"D x 30"H',
        material: "Walnut veneer and powder-coated steel",
        delivery: "Arrives in 5-7 days",
        assembly: "Attach legs and crossbar, manageable solo setup",
        fitCheck:
          "Wayfair dimensions confirm the 48 inch surface can hold a 27 inch monitor without overwhelming a bedroom.",
        reviewSummary:
          "Strong marks for sturdiness and appearance. Limited storage is the main complaint.",
        imageUrl:
          "https://images.unsplash.com/photo-1518455027359-f3f8164ba6bd?auto=format&fit=crop&w=900&q=80",
        wayfairSignals: [
          "Dimensions section",
          "Room visualizer fit check",
          "Assembly overview",
        ],
        trustSignals: ["Sturdiness reviews", "Verified purchase-style feedback"],
        tags: ["video-call friendly", "stable", "clean lines"],
        risk: "Needs an add-on tray or drawer for accessories.",
        whyItMatters:
          "It hits the core work surface need without visually crowding the room.",
      },
      {
        id: "desk-palisade",
        name: "Palisade Desk With File Drawer",
        price: 469,
        dimensions: '54"W x 26"D x 30"H',
        material: "Engineered wood with oak finish",
        delivery: "Arrives in 8-10 days",
        assembly: "Drawer rails and file cabinet assembly add time",
        fitCheck:
          "The larger 54 inch width works best if the shopper checks wall clearance and chair pullback distance.",
        reviewSummary:
          "Buyers like the storage, but assembly takes longer than expected.",
        imageUrl:
          "https://images.unsplash.com/photo-1555212697-194d092e3b8f?auto=format&fit=crop&w=900&q=80",
        wayfairSignals: [
          "Dimensions section",
          "Assembly reviews",
          "Delivery estimate",
        ],
        trustSignals: ["Storage reviews", "Assembly-risk comments"],
        tags: ["storage", "larger surface", "traditional"],
        risk: "Heavy visual footprint and longer assembly.",
        whyItMatters:
          "It solves clutter, but may make a bedroom feel more like a workplace.",
      },
      {
        id: "desk-kai",
        name: "Kai Wall-Leaning Desk",
        price: 249,
        dimensions: '42"W x 20"D x 72"H',
        material: "Solid pine shelves with metal frame",
        delivery: "Arrives in 4-6 days",
        assembly: "Wall-leaning frame must be anchored carefully",
        fitCheck:
          "The shallow 20 inch depth saves space, but shoppers should verify monitor distance before buying.",
        reviewSummary:
          "Great for small rooms, but monitor depth is tight for serious work.",
        imageUrl:
          "https://images.unsplash.com/photo-1497366754035-f200968a6e72?auto=format&fit=crop&w=900&q=80",
        wayfairSignals: [
          "Dimensions section",
          "View in Room style check",
          "Small-space reviews",
        ],
        trustSignals: ["Depth warnings in reviews", "Budget listing clarity"],
        tags: ["vertical storage", "small room", "budget"],
        risk: "Shallow work surface for a full monitor setup.",
        whyItMatters:
          "It is photogenic and space-saving, but weaker for actual work comfort.",
      },
    ],
  },
  {
    id: "family-dining-table",
    title: "Family Dining Table",
    room: "Dining room",
    shopperGoal:
      "Pick a dining table for a family of four that can survive weeknight homework and weekend guests.",
    shopperProfile:
      "Two adults, two kids, frequent grandparents, wants durable but not bulky.",
    constraints: [
      "Seats 6 when needed",
      "Under $800",
      "Durable surface",
      "Avoid sharp corners if possible",
    ],
    products: [
      {
        id: "table-rowan",
        name: "Rowan Extendable Dining Table",
        price: 729,
        dimensions: '60-78"W x 38"D x 30"H',
        material: "Rubberwood with sealed veneer top",
        delivery: "Arrives in 7-9 days",
        assembly: "Two-person assembly because of extension hardware",
        fitCheck:
          "The extension range is the key Wayfair dimension: 60 inches daily, 78 inches for guests.",
        reviewSummary:
          "Families like the extension leaf and wipeable finish. Assembly needs two people.",
        imageUrl:
          "https://images.unsplash.com/photo-1549497538-303791108f95?auto=format&fit=crop&w=900&q=80",
        wayfairSignals: [
          "Expandable dimensions",
          "Assembly details",
          "Delivery estimate",
        ],
        trustSignals: ["Family-use reviews", "Durability comments"],
        tags: ["extendable", "family", "wipeable"],
        risk: "Assembly is not solo-friendly.",
        whyItMatters:
          "It flexes from weeknight meals to guest seating without buying too much table.",
      },
      {
        id: "table-bria",
        name: "Bria Round Pedestal Table",
        price: 599,
        dimensions: '54"W x 54"D x 30"H',
        material: "Painted hardwood",
        delivery: "Arrives in 5-7 days",
        assembly: "Pedestal base assembly, fewer sharp edges after setup",
        fitCheck:
          "Round dimensions make the fit question simple: confirm the 54 inch diameter plus chair clearance.",
        reviewSummary:
          "Loved for conversation and soft edges. Squeezes six, but not spaciously.",
        imageUrl:
          "https://images.unsplash.com/photo-1519710164239-da123dc03ef4?auto=format&fit=crop&w=900&q=80",
        wayfairSignals: [
          "Dimensions section",
          "Room visualizer fit check",
          "Family review photos",
        ],
        trustSignals: ["Kid-friendly reviews", "Clear seating expectations"],
        tags: ["round", "kid-friendly", "conversation"],
        risk: "Six seats are possible, not comfortable.",
        whyItMatters:
          "It is the safest family shape, but loses flexibility for larger dinners.",
      },
      {
        id: "table-porter",
        name: "Porter Farmhouse Dining Table",
        price: 689,
        dimensions: '72"W x 40"D x 30"H',
        material: "Pine solids with distressed finish",
        delivery: "Arrives in 10-12 days",
        assembly: "Large box delivery, two-person assembly strongly recommended",
        fitCheck:
          "The 72 inch length gives guest capacity, but Wayfair dimensions reveal it needs more room than the family brief wants.",
        reviewSummary:
          "Attractive and roomy, but softer pine can show dents from daily use.",
        imageUrl:
          "https://images.unsplash.com/photo-1616486338812-3dadae4b4ace?auto=format&fit=crop&w=900&q=80",
        wayfairSignals: [
          "Dimensions section",
          "Delivery estimate",
          "Material notes",
        ],
        trustSignals: ["Surface durability reviews", "Damage-risk comments"],
        tags: ["roomy", "farmhouse", "guest-ready"],
        risk: "Softer surface and square corners are less kid-proof.",
        whyItMatters:
          "It is guest-ready, but not the best fit for homework and heavy daily use.",
      },
    ],
  },
];

export const DEFAULT_SCENARIO_ID = scenarios[0].id;

export function getScenario(id?: string | null): CouncilScenario {
  return scenarios.find((scenario) => scenario.id === id) ?? scenarios[0];
}
