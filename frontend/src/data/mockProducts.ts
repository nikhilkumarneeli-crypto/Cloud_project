import type { Product } from '../types';

export const mockProducts: Product[] = [
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
      'Battery Life': '45 hours (ANC off), 35 hours (ANC on)',
      'Connectivity': 'Bluetooth 5.3, 3.5mm AUX, USB-C Audio',
      'Drivers': '40mm Bio-Cellulose Dynamic Drivers',
      'Materials': 'FSC-Certified Bamboo, Memory Foam, Recycled Aluminum',
      'Weight': '265g'
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
      'Display': '1.3" Sunlight-visible Transflective Memory-in-Pixel',
      'Battery Life': 'Up to 28 days in smartwatch mode / Solar unlimited',
      'Sensors': 'Optical HR, Pulse Ox, Compass, Gyroscope, Barometric Altimeter'
    },
    isActive: true,
    isTrendingDeal: true,
    badge: 'Deal of the Day',
    createdAt: '2026-02-01T10:00:00Z',
    updatedAt: '2026-04-01T14:30:00Z'
  },
  {
    id: 'prod-elec-003',
    name: 'Moss & Birch 3-in-1 Magnetic Wireless Charging Stand',
    description: 'Fast wireless charging station clad in genuine dark walnut and matte anodized aluminium. Supports 15W MagSafe fast charging for smartphone, smartwatch, and earbuds.',
    category: 'Electronics',
    brand: 'VerdantTech',
    currentPrice: 79.50,
    originalPrice: 99.00,
    discountPercentage: 20,
    image: 'https://images.unsplash.com/photo-1586953208448-b95a79798f07?auto=format&fit=crop&w=800&q=80',
    rating: 4.6,
    reviewCount: 98,
    stockQuantity: 42,
    specifications: {
      'Input': 'USB-C 30W Power Delivery',
      'Output': '15W MagSafe + 5W Watch + 5W Qi Earbuds',
      'Dimensions': '140 x 95 x 115 mm',
      'Weight': '320g'
    },
    isActive: true,
    isNewArrival: true,
    badge: 'New Arrival',
    createdAt: '2026-03-20T09:15:00Z',
    updatedAt: '2026-04-12T11:00:00Z'
  },

  // 2. Clothing
  {
    id: 'prod-cloth-001',
    name: 'Highland Heavyweight Organic Cotton Flannel Shirt',
    description: 'Crafted from 100% GOTS-certified brushed organic cotton. Designed with double-needle stitching, natural corozo buttons, and a tailored relaxed silhouette.',
    category: 'Clothing',
    brand: 'Pine & Loom',
    currentPrice: 68.00,
    originalPrice: 85.00,
    discountPercentage: 20,
    image: 'https://images.unsplash.com/photo-1596755094514-f87e34085b2c?auto=format&fit=crop&w=800&q=80',
    rating: 4.9,
    reviewCount: 184,
    stockQuantity: 36,
    specifications: {
      'Material': '100% Organic Ring-Spun Cotton (8.5 oz)',
      'Fit': 'Classic Relaxed Over-shirt Fit',
      'Care': 'Machine wash cold, line dry recommended',
      'Origin': 'Ethically spun and woven in Portugal'
    },
    isActive: true,
    isBestseller: true,
    badge: 'Top Rated',
    createdAt: '2026-01-10T14:00:00Z',
    updatedAt: '2026-03-15T09:00:00Z'
  },
  {
    id: 'prod-cloth-002',
    name: 'All-Weather Expedition Merino Wool Thermal Sweater',
    description: 'Ultra-fine 19.5 micron New Zealand merino wool. Regulates core temperature naturally, wicks moisture effortlessly, and resists odors on multi-day journeys.',
    category: 'Clothing',
    brand: 'Pine & Loom',
    currentPrice: 124.00,
    originalPrice: 155.00,
    discountPercentage: 20,
    image: 'https://images.unsplash.com/photo-1620799140408-edc6dcb6d633?auto=format&fit=crop&w=800&q=80',
    rating: 4.8,
    reviewCount: 92,
    stockQuantity: 19,
    specifications: {
      'Material': '100% Extra-Fine Merino Wool',
      'Knit Gauge': '7-Gauge Chunky Rib Knit',
      'Reinforcements': 'Reinforced elbow patches in ripstop canvas'
    },
    isActive: true,
    createdAt: '2026-02-14T11:20:00Z',
    updatedAt: '2026-04-05T16:00:00Z'
  },
  {
    id: 'prod-cloth-003',
    name: 'Trailmaster Waxed Canvas Field Jacket',
    description: 'Weatherproof 10 oz American canvas infused with beeswax and paraffin. Features brass two-way zippers, corduroy lined collar, and fleece handwarmer pockets.',
    category: 'Clothing',
    brand: 'Pine & Loom',
    currentPrice: 215.00,
    originalPrice: 270.00,
    discountPercentage: 20,
    image: 'https://images.unsplash.com/photo-1544441893-675973e31985?auto=format&fit=crop&w=800&q=80',
    rating: 4.9,
    reviewCount: 147,
    stockQuantity: 12,
    specifications: {
      'Shell': '100% Cotton Waxed Canvas (10.5 oz)',
      'Lining': 'Organic Cotton Tartan Plaid',
      'Weatherproofing': 'Water repellent & wind resistant'
    },
    isActive: true,
    badge: 'Staff Pick',
    createdAt: '2026-01-20T10:00:00Z',
    updatedAt: '2026-03-28T12:00:00Z'
  },

  // 3. Home and Kitchen
  {
    id: 'prod-home-001',
    name: 'Artisan Hand-Cast Iron Skillet with Brass Handle (10-Inch)',
    description: 'Smooth-polished interior surface pre-seasoned with organic flaxseed oil. Superior heat retention with an ergonomic cool-touch brass helper handle.',
    category: 'Home and Kitchen',
    brand: 'Hearth & Forest',
    currentPrice: 94.00,
    originalPrice: 120.00,
    discountPercentage: 22,
    image: 'https://images.unsplash.com/photo-1584990347449-389f417f7c4c?auto=format&fit=crop&w=800&q=80',
    rating: 4.9,
    reviewCount: 412,
    stockQuantity: 24,
    specifications: {
      'Diameter': '10.25 inches (26 cm)',
      'Cooking Surface': 'Hand-machined ultra-smooth finish',
      'Heat Compatibility': 'Induction, Gas, Ceramic, Oven, Campfire safe up to 600°F',
      'Weight': '5.2 lbs'
    },
    isActive: true,
    isBestseller: true,
    badge: 'Kitchen Essential',
    createdAt: '2026-01-05T09:00:00Z',
    updatedAt: '2026-04-10T15:00:00Z'
  },
  {
    id: 'prod-home-002',
    name: 'Precision Conical Burr Coffee Grinder (Matte Olive)',
    description: 'Commercial-grade 48mm stainless steel burrs, 40 micro-stepped settings from Turkish fine to cold brew coarse, anti-static ion technology, and low retention.',
    category: 'Home and Kitchen',
    brand: 'Hearth & Forest',
    currentPrice: 159.00,
    originalPrice: 199.00,
    discountPercentage: 20,
    image: 'https://images.unsplash.com/photo-1517668808822-9ebb02f2a0e6?auto=format&fit=crop&w=800&q=80',
    rating: 4.7,
    reviewCount: 168,
    stockQuantity: 18,
    specifications: {
      'Burrs': '48mm CNC Stainless Steel 420 Burrs',
      'Hopper Capacity': '250g Whole Bean Hopper with UV Shield',
      'Power': '180W High-Torque DC Motor',
      'Dimensions': '13 x 23 x 36 cm'
    },
    isActive: true,
    isTrendingDeal: true,
    badge: 'Popular',
    createdAt: '2026-02-18T13:45:00Z',
    updatedAt: '2026-04-02T10:15:00Z'
  },
  {
    id: 'prod-home-003',
    name: 'Hand-Thrown Ceramic Pour-Over & Carafe Set',
    description: 'Durable stoneware handmade by regional potters. Finished in a reactive moss green and matte glaze with a 750ml thermal carafe and drip brewer.',
    category: 'Home and Kitchen',
    brand: 'Hearth & Forest',
    currentPrice: 58.00,
    originalPrice: 72.00,
    discountPercentage: 19,
    image: 'https://images.unsplash.com/photo-1514432324607-a09d9b4aefdd?auto=format&fit=crop&w=800&q=80',
    rating: 4.8,
    reviewCount: 76,
    stockQuantity: 30,
    specifications: {
      'Capacity': '750ml (serves 3-4 cups)',
      'Filter Compatibility': 'Standard V60 02 cone filters',
      'Care': 'Dishwasher and microwave safe'
    },
    isActive: true,
    createdAt: '2026-03-05T12:00:00Z',
    updatedAt: '2026-04-08T17:00:00Z'
  },

  // 4. Beauty and Personal Care
  {
    id: 'prod-beauty-001',
    name: 'Cedar & Pine Needle Botanical Beard & Face Elixir',
    description: 'Cold-pressed jojoba, argan, and rosehip seed oils scented with steam-distilled Western red cedarwood, black spruce, and vetiver essential oils.',
    category: 'Beauty and Personal Care',
    brand: 'Flora & Bark',
    currentPrice: 32.00,
    originalPrice: 40.00,
    discountPercentage: 20,
    image: 'https://images.unsplash.com/photo-1608248597359-052445c7b39b?auto=format&fit=crop&w=800&q=80',
    rating: 4.9,
    reviewCount: 220,
    stockQuantity: 50,
    specifications: {
      'Volume': '60ml (2 fl oz) Dropper Bottle',
      'Key Ingredients': 'Organic Jojoba Oil, Argan Oil, Juniper Berry, Cedarwood',
      'Formula': '100% Plant-Based, Vegan, Cruelty-Free'
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
      'Process': 'Cold Processed, cured for 6 weeks',
      'Packaging': '100% Recyclable Seed-Embedded Seed Paper'
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
      'Skin Type': 'Dry, sensitive, and combination skin',
      'Free From': 'Parabens, Sulfates, Phthalates, Synthetic Fragrances'
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
      'Flasks': '2 x 500ml BPA-free Soft Flasks with High-Flow Valves',
      'Sizing': 'Adjustable chest sternum straps (Chest 32-44 in)'
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
      'Dimensions': '72" L x 26" W x 6mm Thick (183cm x 66cm x 0.6cm)',
      'Materials': '100% Organic Cork, Sustainably Harvested Tree Rubber',
      'Includes': 'Cotton carry strap and care brush'
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
      'Extended Length': '135 cm (53 in)',
      'Tips': 'Tungsten carbide tips, rubber trail caps, and snow baskets included'
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
      'Leather': 'Full-Grain Tuscan Vegetable-Tanned Cowhide',
      'Stitching': 'Hand-waxed polyester saddle stitch',
      'Dimensions': '11 x 8.5 x 1.2 cm folded',
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
      'Material': 'Grade 1 Pure Titanium, food grade silicone seal',
      'Cap': 'Machined titanium cap with bamboo inlay'
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
      'Interior': 'Scratch-resistant velvet microfiber',
      'Slots': '3 Individual Watch Cushions (removable)'
    },
    isActive: true,
    isNewArrival: true,
    badge: 'New',
    createdAt: '2026-03-24T12:00:00Z',
    updatedAt: '2026-04-15T09:30:00Z'
  }
];

export const productCategories = [
  'All',
  'Electronics',
  'Clothing',
  'Home and Kitchen',
  'Beauty and Personal Care',
  'Books',
  'Sports and Fitness',
  'Accessories'
] as const;
