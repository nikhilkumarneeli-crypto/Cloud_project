import { productRepository } from './repositories/productRepository';
import type { ProductItem } from './types';

export const seedProducts: ProductItem[] = [
  // 1. Electronics
  {
    id: 'prod-elec-001',
    name: 'TimberAcoustics Bamboo Active Noise Cancelling Headphones',
    description: 'Engineered with sustainable bamboo earcups, custom 40mm bio-cellulose drivers, hybrid active noise cancellation, and up to 45 hours of immersive playtime.',
    category: 'Electronics',
    brand: 'TimberSound',
    currentPrice: 189.99,
    originalPrice: 249.99,
    discountPercentage: 24,
    image: 'https://images.unsplash.com/photo-1505740420928-5e560c06d30e?auto=format&fit=crop&w=800&q=80',
    gallery: [
      'https://images.unsplash.com/photo-1505740420928-5e560c06d30e?auto=format&fit=crop&w=800&q=80',
      'https://images.unsplash.com/photo-1484704849700-f032a568e944?auto=format&fit=crop&w=800&q=80'
    ],
    rating: 4.8,
    reviewCount: 342,
    stockQuantity: 28,
    specifications: {
      'Battery Life': '45 hours (ANC off)',
      'Connectivity': 'Bluetooth 5.3, 3.5mm AUX, USB-C Audio',
      'Drivers': '40mm Bio-Cellulose Dynamic Drivers',
      'Materials': 'FSC-Certified Bamboo, Recycled Aluminum'
    },
    isActive: true,
    isBestseller: true,
    badge: 'Best Seller',
    createdAt: '2026-01-15T08:00:00Z',
    updatedAt: '2026-03-10T12:00:00Z'
  },
  {
    id: 'prod-elec-002',
    name: 'VerdantPulse Solar Hybrid Smartwatch with GPS',
    description: 'Rugged titanium bezel, solar-assisted sapphire glass lens with endless outdoor battery, continuous heart rate and blood oxygen monitoring, and multi-GNSS tracking.',
    category: 'Electronics',
    brand: 'VerdantTech',
    currentPrice: 279.00,
    originalPrice: 349.00,
    discountPercentage: 20,
    image: 'https://images.unsplash.com/photo-1523275335684-37898b6baf30?auto=format&fit=crop&w=800&q=80',
    rating: 4.7,
    reviewCount: 215,
    stockQuantity: 15,
    specifications: {
      'Water Resistance': '10 ATM (100 meters)',
      'Display': '1.3" Transflective Memory-in-Pixel',
      'Battery Life': 'Up to 28 days in smartwatch mode / Solar unlimited'
    },
    isActive: true,
    isTrendingDeal: true,
    badge: 'Deal of the Day',
    createdAt: '2026-02-01T10:00:00Z',
    updatedAt: '2026-04-01T14:30:00Z'
  },
  {
    id: 'prod-elec-003',
    name: 'Canopy SoundBar Pro 2.1 with Wireless Subwoofer',
    description: 'Rich cinematic acoustic tuning with walnut wood enclosure, HDMI eARC, Dolby Audio support, and lossless optical streaming.',
    category: 'Electronics',
    brand: 'TimberSound',
    currentPrice: 219.00,
    originalPrice: 289.00,
    discountPercentage: 24,
    image: 'https://images.unsplash.com/photo-1545454675-3531b543be5d?auto=format&fit=crop&w=800&q=80',
    rating: 4.6,
    reviewCount: 98,
    stockQuantity: 19,
    specifications: {
      'Output Power': '240W Peak Output',
      'Channels': '2.1 Channels with Dedicated Center Voice Clarity',
      'Enclosure': 'Acoustic-Grade Walnut Laminate'
    },
    isActive: true,
    isNewArrival: true,
    badge: 'New Arrival',
    createdAt: '2026-03-01T09:00:00Z',
    updatedAt: '2026-04-05T16:00:00Z'
  },

  // 2. Clothing
  {
    id: 'prod-cloth-001',
    name: 'Heritage Organic Heavyweight Flannel Overshirt',
    description: 'Spun from 100% GOTS-certified brushed organic cotton. Tailored for layering during chilly mountain mornings and campfire evenings.',
    category: 'Clothing',
    brand: 'Pine & Loom',
    currentPrice: 68.00,
    originalPrice: 85.00,
    discountPercentage: 20,
    image: 'https://images.unsplash.com/photo-1598033129183-c4f50c736f10?auto=format&fit=crop&w=800&q=80',
    rating: 4.9,
    reviewCount: 420,
    stockQuantity: 36,
    specifications: {
      'Material': '100% Organic Ring-Spun Cotton (320 GSM)',
      'Fit': 'Relaxed Classic Fit',
      'Buttons': 'Corozo Nut Buttons'
    },
    isActive: true,
    isBestseller: true,
    badge: 'Top Rated',
    createdAt: '2026-01-10T12:00:00Z',
    updatedAt: '2026-03-15T09:00:00Z'
  },
  {
    id: 'prod-cloth-002',
    name: 'Waterproof Waxed Canvas Field Jacket with Corduroy Collar',
    description: 'Weatherproof British Millerain waxed canvas outer shell, warm quilted flannel lining, heavy brass two-way zipper, and deep storm pockets.',
    category: 'Clothing',
    brand: 'Pine & Loom',
    currentPrice: 198.00,
    originalPrice: 245.00,
    discountPercentage: 19,
    image: 'https://images.unsplash.com/photo-1551028719-00167b16eac5?auto=format&fit=crop&w=800&q=80',
    rating: 4.8,
    reviewCount: 182,
    stockQuantity: 12,
    specifications: {
      'Shell': '10 oz Scottish Waxed Cotton Canvas',
      'Lining': '100% Brushed Cotton Tartan Lining',
      'Hardware': 'Antique Solid Brass'
    },
    isActive: true,
    isTrendingDeal: true,
    badge: 'Limited Stock',
    createdAt: '2026-02-14T11:00:00Z',
    updatedAt: '2026-04-02T10:00:00Z'
  },
  {
    id: 'prod-cloth-003',
    name: 'All-Weather Merino Wool Hiking Crew Socks (3-Pack)',
    description: 'Reinforced heel and toe with targeted arch compression, natural antimicrobial odor resistance, and temperature-regulating Australian merino wool.',
    category: 'Clothing',
    brand: 'Pine & Loom',
    currentPrice: 32.00,
    originalPrice: 42.00,
    discountPercentage: 24,
    image: 'https://images.unsplash.com/photo-1582966772680-860e372bb558?auto=format&fit=crop&w=800&q=80',
    rating: 4.9,
    reviewCount: 512,
    stockQuantity: 80,
    specifications: {
      'Blend': '72% Merino Wool, 24% Nylon, 4% Lycra Spandex',
      'Cushioning': 'High-Density Terro-Loop Sole Cushioning'
    },
    isActive: true,
    isBestseller: true,
    badge: 'Essential',
    createdAt: '2026-01-20T14:00:00Z',
    updatedAt: '2026-03-25T11:00:00Z'
  },

  // 3. Home and Kitchen
  {
    id: 'prod-home-001',
    name: 'Artisan Matte Ceramic Pour-Over Coffee Dripper Set',
    description: 'Hand-thrown stoneware dripper with heat-resistant borosilicate glass server (600ml) and organic olive wood collar.',
    category: 'Home and Kitchen',
    brand: 'Hearth & Stone',
    currentPrice: 46.50,
    originalPrice: 58.00,
    discountPercentage: 20,
    image: 'https://images.unsplash.com/photo-1514432324607-a09d9b4aefdd?auto=format&fit=crop&w=800&q=80',
    rating: 4.8,
    reviewCount: 167,
    stockQuantity: 24,
    specifications: {
      'Capacity': '600 ml / 2-4 Cups',
      'Material': 'High-Fired Stoneware, Olive Wood, Borosilicate Glass'
    },
    isActive: true,
    isNewArrival: true,
    badge: 'Artisan Crafted',
    createdAt: '2026-02-18T10:00:00Z',
    updatedAt: '2026-04-03T15:00:00Z'
  },
  {
    id: 'prod-home-002',
    name: 'Pre-Seasoned Cast Iron Skillet with Brass Assist Handle (12")',
    description: 'Heavy-gauge virgin iron seasoned with cold-pressed organic flaxseed oil. Superior heat retention with machined smooth cooking surface.',
    category: 'Home and Kitchen',
    brand: 'Hearth & Stone',
    currentPrice: 62.00,
    originalPrice: 78.00,
    discountPercentage: 21,
    image: 'https://images.unsplash.com/photo-1590794056226-79ef3a8147e1?auto=format&fit=crop&w=800&q=80',
    rating: 4.9,
    reviewCount: 389,
    stockQuantity: 30,
    specifications: {
      'Diameter': '12 inches / 30.5 cm',
      'Weight': '6.4 lbs (2.9 kg)',
      'Cooktop Compatibility': 'Induction, Gas, Electric, Campfire, Oven Safe up to 550°F'
    },
    isActive: true,
    isBestseller: true,
    badge: 'Lifetime Warranty',
    createdAt: '2026-01-05T09:00:00Z',
    updatedAt: '2026-03-12T13:00:00Z'
  },
  {
    id: 'prod-home-003',
    name: 'Hand-Carved Black Walnut End-Grain Cutting Board',
    description: 'Crafted from sustainable American black walnut with juice groove and recessed finger grips. Conditioned with food-grade beeswax.',
    category: 'Home and Kitchen',
    brand: 'Hearth & Stone',
    currentPrice: 89.00,
    originalPrice: 115.00,
    discountPercentage: 23,
    image: 'https://images.unsplash.com/photo-1594998893017-36147cbcae05?auto=format&fit=crop&w=800&q=80',
    rating: 4.9,
    reviewCount: 143,
    stockQuantity: 18,
    specifications: {
      'Dimensions': '18 x 12 x 1.5 inches',
      'Wood Species': 'American Black Walnut (Juglans nigra)'
    },
    isActive: true,
    badge: 'Chef Favorite',
    createdAt: '2026-02-20T11:00:00Z',
    updatedAt: '2026-04-08T09:00:00Z'
  },

  // 4. Beauty and Personal Care
  {
    id: 'prod-beauty-001',
    name: 'Nordic Pine & Jojoba Botanical Beard & Face Elixir',
    description: 'Cold-pressed organic argan, jojoba, and rosehip seed oils infused with essential spruce needle, cedarwood, and bergamot.',
    category: 'Beauty and Personal Care',
    brand: 'Flora & Bark',
    currentPrice: 28.00,
    originalPrice: 35.00,
    discountPercentage: 20,
    image: 'https://images.unsplash.com/photo-1608248597359-2b04752c4b2c?auto=format&fit=crop&w=800&q=80',
    rating: 4.8,
    reviewCount: 224,
    stockQuantity: 52,
    specifications: {
      'Volume': '50ml (1.7 fl oz)',
      'Scent Profile': 'Balsam Fir, Fresh Pine, Subtle Citrus'
    },
    isActive: true,
    isBestseller: true,
    badge: 'Customer Choice',
    createdAt: '2026-01-12T08:30:00Z',
    updatedAt: '2026-03-22T14:00:00Z'
  },
  {
    id: 'prod-beauty-002',
    name: 'Dead Sea Minerals & Peat Moss Exfoliating Body Bar (Set of 3)',
    description: 'Artisanal triple-milled soap bars infused with therapeutic volcanic silt, activated bamboo charcoal, and wild eucalyptus essential oil.',
    category: 'Beauty and Personal Care',
    brand: 'Flora & Bark',
    currentPrice: 24.00,
    originalPrice: 30.00,
    discountPercentage: 20,
    image: 'https://images.unsplash.com/photo-1607006314647-75058ec6291a?auto=format&fit=crop&w=800&q=80',
    rating: 4.7,
    reviewCount: 114,
    stockQuantity: 65,
    specifications: {
      'Weight': '3 x 180g (6.3 oz each)',
      'Process': 'Cold Processed, cured for 6 weeks'
    },
    isActive: true,
    createdAt: '2026-02-22T16:00:00Z',
    updatedAt: '2026-04-11T09:20:00Z'
  },
  {
    id: 'prod-beauty-003',
    name: 'Wild Ginseng & Green Tea Restorative Face Cream',
    description: 'Deep hydration barrier repair cream with fermented wild mountain ginseng, antioxidant green tea polyphenols, and plant-derived squalane.',
    category: 'Beauty and Personal Care',
    brand: 'Flora & Bark',
    currentPrice: 48.00,
    originalPrice: 62.00,
    discountPercentage: 22,
    image: 'https://images.unsplash.com/photo-1556228720-195a672e8a03?auto=format&fit=crop&w=800&q=80',
    rating: 4.8,
    reviewCount: 89,
    stockQuantity: 22,
    specifications: {
      'Size': '50ml (1.7 fl oz) Frosted Glass Jar',
      'Skin Type': 'Dry, sensitive, and combination skin'
    },
    isActive: true,
    isNewArrival: true,
    badge: 'New',
    createdAt: '2026-03-18T10:00:00Z',
    updatedAt: '2026-04-14T11:45:00Z'
  },

  // 5. Books
  {
    id: 'prod-book-001',
    name: 'The Hidden Life of Trees & Forest Resilience (Hardcover Collector\'s Edition)',
    description: 'Illustrated deluxe edition featuring original botanical engravings, silver foil stamping, and essays exploring communication networks beneath the forest floor.',
    category: 'Books',
    brand: 'Canopy Press',
    currentPrice: 38.00,
    originalPrice: 45.00,
    discountPercentage: 15,
    image: 'https://images.unsplash.com/photo-1544947950-fa07a98d237f?auto=format&fit=crop&w=800&q=80',
    rating: 4.9,
    reviewCount: 310,
    stockQuantity: 40,
    specifications: {
      'Format': 'Hardcover with Debossed Linen Spine',
      'Pages': '368 pages with 48 full-color plates',
      'Publisher': 'Canopy Press (Special Edition)',
      'Language': 'English',
      'ISBN': '978-0-123456-78-9'
    },
    isActive: true,
    isBestseller: true,
    badge: 'Bestseller',
    createdAt: '2026-01-08T11:00:00Z',
    updatedAt: '2026-03-30T10:00:00Z'
  },
  {
    id: 'prod-book-002',
    name: 'Wilderness Cabin Architecture & Off-Grid Living Handbook',
    description: 'Architectural blueprints, timber-framing methodologies, rainwater harvesting schematics, and solar battery sizing guides for modern off-grid retreats.',
    category: 'Books',
    brand: 'Canopy Press',
    currentPrice: 32.50,
    originalPrice: 42.00,
    discountPercentage: 22,
    image: 'https://images.unsplash.com/photo-1512820790803-83ca734da794?auto=format&fit=crop&w=800&q=80',
    rating: 4.8,
    reviewCount: 152,
    stockQuantity: 25,
    specifications: {
      'Format': 'Flexibound Lay-Flat Field Manual',
      'Pages': '420 pages with CAD drawings',
      'Dimensions': '8.5 x 11 inches'
    },
    isActive: true,
    createdAt: '2026-02-05T09:30:00Z',
    updatedAt: '2026-04-03T14:15:00Z'
  },
  {
    id: 'prod-book-003',
    name: 'The Forager\'s Companion: Edible Wild Mushrooms & Herbs',
    description: 'Comprehensive field guide with high-definition macroscopic photography, spore print analysis, seasonal harvesting calendars, and forest culinary recipes.',
    category: 'Books',
    brand: 'Canopy Press',
    currentPrice: 26.00,
    originalPrice: 32.00,
    discountPercentage: 18,
    image: 'https://images.unsplash.com/photo-1532012164546-f432f2e3edd4?auto=format&fit=crop&w=800&q=80',
    rating: 4.9,
    reviewCount: 198,
    stockQuantity: 34,
    specifications: {
      'Format': 'Water-resistant Pocket Field Guide',
      'Pages': '296 pages',
      'Weight': '350g'
    },
    isActive: true,
    badge: 'Field Guide',
    createdAt: '2026-03-12T14:00:00Z',
    updatedAt: '2026-04-09T18:00:00Z'
  },

  // 6. Sports and Fitness
  {
    id: 'prod-sport-001',
    name: 'TrailRunner Pro Ultralight Trail Running Hydration Vest',
    description: 'Breathable 3D honeycomb mesh, dual 500ml soft flasks included, pole attachments, and water-resistant stash pockets. Zero bounce design for ultra-marathons.',
    category: 'Sports and Fitness',
    brand: 'RidgePath',
    currentPrice: 119.00,
    originalPrice: 149.00,
    discountPercentage: 20,
    image: 'https://images.unsplash.com/photo-1553062407-98eeb64c6a62?auto=format&fit=crop&w=800&q=80',
    rating: 4.8,
    reviewCount: 175,
    stockQuantity: 21,
    specifications: {
      'Capacity': '8 Liters Storage Volume',
      'Weight': '195g (without flasks)',
      'Flasks': '2 x 500ml BPA-free Soft Flasks with High-Flow Valves'
    },
    isActive: true,
    isTrendingDeal: true,
    badge: 'Deal',
    createdAt: '2026-01-28T09:00:00Z',
    updatedAt: '2026-04-06T13:20:00Z'
  },
  {
    id: 'prod-sport-002',
    name: 'Natural Cork & Tree Rubber Eco-Grip Yoga Mat (6mm)',
    description: 'High-density natural rubber base paired with an anti-microbial organic cork top. Provides sweat-activated non-slip traction and joint cushioning.',
    category: 'Sports and Fitness',
    brand: 'RidgePath',
    currentPrice: 84.00,
    originalPrice: 105.00,
    discountPercentage: 20,
    image: 'https://images.unsplash.com/photo-1545205597-3d9d02c29597?auto=format&fit=crop&w=800&q=80',
    rating: 4.9,
    reviewCount: 260,
    stockQuantity: 38,
    specifications: {
      'Dimensions': '72" L x 26" W x 6mm Thick',
      'Materials': '100% Organic Cork, Natural Tree Rubber'
    },
    isActive: true,
    isBestseller: true,
    badge: 'Top Rated',
    createdAt: '2026-02-10T12:00:00Z',
    updatedAt: '2026-04-04T15:30:00Z'
  },
  {
    id: 'prod-sport-003',
    name: 'Summit Carbon Fiber Trekking Poles with Cork Grips (Pair)',
    description: 'Ultra-stiff 100% 3K carbon fiber shafts with quick-cam aluminum lever locks. Ergonomic moisture-wicking cork handles with padded breathable wrist loops.',
    category: 'Sports and Fitness',
    brand: 'RidgePath',
    currentPrice: 92.00,
    originalPrice: 115.00,
    discountPercentage: 20,
    image: 'https://images.unsplash.com/photo-1486401899868-0e435ed85128?auto=format&fit=crop&w=800&q=80',
    rating: 4.7,
    reviewCount: 139,
    stockQuantity: 17,
    specifications: {
      'Weight': '210g per pole',
      'Collapsed Length': '63 cm (24.8 in)',
      'Extended Length': '135 cm (53 in)'
    },
    isActive: true,
    createdAt: '2026-03-01T15:00:00Z',
    updatedAt: '2026-04-13T10:00:00Z'
  },

  // 7. Accessories
  {
    id: 'prod-acc-001',
    name: 'Vegetable-Tanned Full Grain Leather Bifold Wallet',
    description: 'Handcrafted from Italian vegetable-tanned Badalassi Carlo leather. Develops a deep, rich patina with age. Holds 8-12 cards with RFID blocking technology.',
    category: 'Accessories',
    brand: 'Canopy Heritage',
    currentPrice: 65.00,
    originalPrice: 85.00,
    discountPercentage: 23,
    image: 'https://images.unsplash.com/photo-1627123424574-724758594e93?auto=format&fit=crop&w=800&q=80',
    rating: 4.9,
    reviewCount: 288,
    stockQuantity: 44,
    specifications: {
      'Leather': 'Full-Grain Tuscan Cowhide',
      'Security': 'Built-in RFID blocking liner'
    },
    isActive: true,
    isBestseller: true,
    badge: 'Signature Item',
    createdAt: '2026-01-18T10:30:00Z',
    updatedAt: '2026-04-07T11:00:00Z'
  },
  {
    id: 'prod-acc-002',
    name: 'Double-Walled Insulated Titanium Mountain Flask (750ml)',
    description: 'Featherlight pure aerospace-grade titanium with vacuum insulation. Keeps beverages boiling hot for 18 hours or ice-cold for 36 hours. Zero metallic taste.',
    category: 'Accessories',
    brand: 'Canopy Heritage',
    currentPrice: 74.00,
    originalPrice: 95.00,
    discountPercentage: 22,
    image: 'https://images.unsplash.com/photo-1602143407151-7111542de6e8?auto=format&fit=crop&w=800&q=80',
    rating: 4.8,
    reviewCount: 164,
    stockQuantity: 27,
    specifications: {
      'Capacity': '750ml (25.4 oz)',
      'Weight': '240g',
      'Material': 'Grade 1 Pure Titanium'
    },
    isActive: true,
    isTrendingDeal: true,
    badge: 'Popular',
    createdAt: '2026-02-11T14:20:00Z',
    updatedAt: '2026-04-12T16:15:00Z'
  },
  {
    id: 'prod-acc-003',
    name: 'Heritage Waxed Canvas & Brass Field Watch Case',
    description: 'Protective travel roll for up to 3 fine timepieces or accessories. Lined in ultra-soft micro-suede with solid antique brass snap closures.',
    category: 'Accessories',
    brand: 'Canopy Heritage',
    currentPrice: 42.00,
    originalPrice: 55.00,
    discountPercentage: 23,
    image: 'https://images.unsplash.com/photo-1522335789203-aabd1fc54bc9?auto=format&fit=crop&w=800&q=80',
    rating: 4.7,
    reviewCount: 65,
    stockQuantity: 31,
    specifications: {
      'Exterior': '14 oz Water-Repellent Waxed Cotton Duck',
      'Interior': 'Scratch-resistant velvet microfiber'
    },
    isActive: true,
    isNewArrival: true,
    badge: 'New',
    createdAt: '2026-03-24T12:00:00Z',
    updatedAt: '2026-04-15T09:30:00Z'
  }
];

export async function seedDatabase() {
  console.log(`Starting DynamoDB seeding for ${seedProducts.length} items...`);
  for (const item of seedProducts) {
    await productRepository.save(item);
    console.log(`✓ Seeded: [${item.category}] ${item.name}`);
  }
  console.log('Seeding completed successfully!');
}

if (process.argv[1]?.endsWith('seed.ts') || process.argv[1]?.endsWith('seed.js')) {
  seedDatabase().catch((err) => {
    console.error('Seeding failed:', err);
    process.exit(1);
  });
}
