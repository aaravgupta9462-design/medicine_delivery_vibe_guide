import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

async function main() {
  console.log('🌱 Starting database seed...');

  // Clean existing data
  await prisma.orderItem.deleteMany();
  await prisma.order.deleteMany();
  await prisma.prescription.deleteMany();
  await prisma.product.deleteMany();
  await prisma.category.deleteMany();

  // ============ CATEGORIES ============
  const categories = await Promise.all([
    prisma.category.create({
      data: {
        name: 'Prescription Drugs',
        slug: 'prescription-drugs',
        description: 'Medicines that require a valid prescription from a licensed physician.',
        imageUrl: '/images/categories/prescription.jpg',
      },
    }),
    prisma.category.create({
      data: {
        name: 'Supplements & Vitamins',
        slug: 'supplements-vitamins',
        description: 'Health supplements, multivitamins, and dietary aids for everyday wellness.',
        imageUrl: '/images/categories/supplements.jpg',
      },
    }),
    prisma.category.create({
      data: {
        name: 'Personal Care',
        slug: 'personal-care',
        description: 'Skincare, hygiene, and personal wellness products.',
        imageUrl: '/images/categories/personal-care.jpg',
      },
    }),
    prisma.category.create({
      data: {
        name: 'Baby Care',
        slug: 'baby-care',
        description: 'Safe and gentle products for infants and toddlers.',
        imageUrl: '/images/categories/baby-care.jpg',
      },
    }),
    prisma.category.create({
      data: {
        name: 'Medical Devices',
        slug: 'medical-devices',
        description: 'Home medical equipment including BP monitors, glucometers, and more.',
        imageUrl: '/images/categories/medical-devices.jpg',
      },
    }),
    prisma.category.create({
      data: {
        name: 'First Aid',
        slug: 'first-aid',
        description: 'Bandages, antiseptics, and emergency wound care products.',
        imageUrl: '/images/categories/first-aid.jpg',
      },
    }),
  ]);

  const [rxCategory, supplementsCategory, personalCareCategory, babyCareCategory, devicesCategory, firstAidCategory] = categories;

  console.log(`✅ Created ${categories.length} categories`);

  // ============ PRODUCTS ============
  const products = await Promise.all([
    // --- Prescription Drugs (rxRequired: true) ---
    prisma.product.create({
      data: {
        name: 'Amoxicillin 500mg Capsules',
        slug: 'amoxicillin-500mg',
        description: 'Broad-spectrum antibiotic used to treat bacterial infections including chest infections, dental abscesses, and urinary tract infections. Strip of 10 capsules.',
        price: 85.00,
        originalPrice: 120.00,
        stock: 200,
        rxRequired: true,
        imageUrl: '/images/products/amoxicillin.jpg',
        categoryId: rxCategory.id,
      },
    }),
    prisma.product.create({
      data: {
        name: 'Metformin 500mg Tablets',
        slug: 'metformin-500mg',
        description: 'First-line medication for type 2 diabetes management. Helps control blood sugar levels. Pack of 30 tablets.',
        price: 65.00,
        originalPrice: 95.00,
        stock: 350,
        rxRequired: true,
        imageUrl: '/images/products/metformin.jpg',
        categoryId: rxCategory.id,
      },
    }),
    prisma.product.create({
      data: {
        name: 'Atorvastatin 10mg Tablets',
        slug: 'atorvastatin-10mg',
        description: 'Cholesterol-lowering medication (statin) that reduces the risk of heart disease and stroke. Pack of 15 tablets.',
        price: 145.00,
        originalPrice: 200.00,
        stock: 180,
        rxRequired: true,
        imageUrl: '/images/products/atorvastatin.jpg',
        categoryId: rxCategory.id,
      },
    }),
    prisma.product.create({
      data: {
        name: 'Omeprazole 20mg Capsules',
        slug: 'omeprazole-20mg',
        description: 'Proton pump inhibitor used to treat acid reflux, GERD, and stomach ulcers. Pack of 14 capsules.',
        price: 95.00,
        originalPrice: 130.00,
        stock: 300,
        rxRequired: true,
        imageUrl: '/images/products/omeprazole.jpg',
        categoryId: rxCategory.id,
      },
    }),
    prisma.product.create({
      data: {
        name: 'Azithromycin 250mg Tablets',
        slug: 'azithromycin-250mg',
        description: 'Macrolide antibiotic effective against respiratory tract infections, skin infections, and more. Pack of 6 tablets.',
        price: 120.00,
        originalPrice: 160.00,
        stock: 150,
        rxRequired: true,
        imageUrl: '/images/products/azithromycin.jpg',
        categoryId: rxCategory.id,
      },
    }),

    // --- Supplements & Vitamins (rxRequired: false) ---
    prisma.product.create({
      data: {
        name: 'Revital H Multivitamin Capsules',
        slug: 'revital-h-multivitamin',
        description: 'Complete daily multivitamin with ginseng, minerals, and 28 vital nutrients for energy and vitality. Pack of 30 capsules.',
        price: 320.00,
        originalPrice: 399.00,
        stock: 500,
        rxRequired: false,
        imageUrl: '/images/products/revital.jpg',
        categoryId: supplementsCategory.id,
      },
    }),
    prisma.product.create({
      data: {
        name: 'Vitamin D3 1000 IU Tablets',
        slug: 'vitamin-d3-1000iu',
        description: 'Supports bone health, immune function, and calcium absorption. Especially recommended for people with limited sun exposure. Pack of 60 tablets.',
        price: 180.00,
        originalPrice: 250.00,
        stock: 450,
        rxRequired: false,
        imageUrl: '/images/products/vitamind3.jpg',
        categoryId: supplementsCategory.id,
      },
    }),
    prisma.product.create({
      data: {
        name: 'Omega-3 Fish Oil 1000mg',
        slug: 'omega-3-fish-oil-1000mg',
        description: 'High-quality fish oil rich in EPA and DHA for heart health, brain function, and joint support. Pack of 60 softgels.',
        price: 450.00,
        originalPrice: 599.00,
        stock: 320,
        rxRequired: false,
        imageUrl: '/images/products/omega3.jpg',
        categoryId: supplementsCategory.id,
      },
    }),
    prisma.product.create({
      data: {
        name: 'Calcium + Magnesium + Zinc Tablets',
        slug: 'calcium-magnesium-zinc',
        description: 'Triple mineral formula for strong bones, muscle function, and immune support. Pack of 60 tablets.',
        price: 220.00,
        originalPrice: 280.00,
        stock: 400,
        rxRequired: false,
        imageUrl: '/images/products/calcium-mag-zinc.jpg',
        categoryId: supplementsCategory.id,
      },
    }),

    // --- Personal Care (rxRequired: false) ---
    prisma.product.create({
      data: {
        name: 'Cetaphil Gentle Skin Cleanser 500ml',
        slug: 'cetaphil-gentle-cleanser-500ml',
        description: 'Dermatologist-recommended gentle cleanser for sensitive skin. Soap-free and pH-balanced formula.',
        price: 520.00,
        originalPrice: 650.00,
        stock: 250,
        rxRequired: false,
        imageUrl: '/images/products/cetaphil.jpg',
        categoryId: personalCareCategory.id,
      },
    }),
    prisma.product.create({
      data: {
        name: 'Himalaya Neem Face Wash 150ml',
        slug: 'himalaya-neem-face-wash-150ml',
        description: 'Herbal face wash with neem and turmeric extracts for purifying and cleansing skin. Controls acne and pimples.',
        price: 165.00,
        originalPrice: 199.00,
        stock: 600,
        rxRequired: false,
        imageUrl: '/images/products/himalaya-neem.jpg',
        categoryId: personalCareCategory.id,
      },
    }),
    prisma.product.create({
      data: {
        name: 'Sensodyne Repair & Protect Toothpaste 70g',
        slug: 'sensodyne-repair-protect-70g',
        description: 'Clinically proven toothpaste that repairs sensitive teeth by building a protective layer. For twice-daily use.',
        price: 240.00,
        originalPrice: 295.00,
        stock: 450,
        rxRequired: false,
        imageUrl: '/images/products/sensodyne.jpg',
        categoryId: personalCareCategory.id,
      },
    }),

    // --- Baby Care (rxRequired: false) ---
    prisma.product.create({
      data: {
        name: "Johnson's Baby Shampoo 200ml",
        slug: 'johnsons-baby-shampoo-200ml',
        description: "As gentle to the eyes as pure water. Johnson's Baby Shampoo is specially formulated for baby's delicate hair and scalp.",
        price: 210.00,
        originalPrice: 249.00,
        stock: 350,
        rxRequired: false,
        imageUrl: '/images/products/johnsons-shampoo.jpg',
        categoryId: babyCareCategory.id,
      },
    }),
    prisma.product.create({
      data: {
        name: 'Pampers Active Baby Diapers (S) - 22 Count',
        slug: 'pampers-active-baby-s-22',
        description: 'Extra-absorbent diapers for babies (4-8 kg) with up to 12 hours of dryness protection and a soft, cloth-like feel.',
        price: 380.00,
        originalPrice: 450.00,
        stock: 200,
        rxRequired: false,
        imageUrl: '/images/products/pampers.jpg',
        categoryId: babyCareCategory.id,
      },
    }),
    prisma.product.create({
      data: {
        name: 'Himalaya Baby Cream 200ml',
        slug: 'himalaya-baby-cream-200ml',
        description: 'A gentle moisturising cream with natural extracts of olive oil and aloe vera that helps keep baby skin soft and healthy.',
        price: 175.00,
        originalPrice: 215.00,
        stock: 420,
        rxRequired: false,
        imageUrl: '/images/products/himalaya-baby-cream.jpg',
        categoryId: babyCareCategory.id,
      },
    }),

    // --- Medical Devices (rxRequired: false) ---
    prisma.product.create({
      data: {
        name: 'Omron HEM-7120 Blood Pressure Monitor',
        slug: 'omron-hem-7120-bp-monitor',
        description: 'Automatic upper arm blood pressure monitor with IntelliSense technology for accurate readings. Memory for 60 readings.',
        price: 1899.00,
        originalPrice: 2500.00,
        stock: 80,
        rxRequired: false,
        imageUrl: '/images/products/omron-bp.jpg',
        categoryId: devicesCategory.id,
      },
    }),
    prisma.product.create({
      data: {
        name: 'Accu-Chek Active Glucometer Kit',
        slug: 'accu-chek-active-glucometer',
        description: 'Easy-to-use blood glucose monitoring system. Includes glucometer, 10 test strips, lancing device, and 10 lancets.',
        price: 950.00,
        originalPrice: 1299.00,
        stock: 120,
        rxRequired: false,
        imageUrl: '/images/products/accu-chek.jpg',
        categoryId: devicesCategory.id,
      },
    }),
    prisma.product.create({
      data: {
        name: 'Dr. Morepen Digital Thermometer',
        slug: 'dr-morepen-digital-thermometer',
        description: 'Fast and accurate digital thermometer with fever alert beep. Suitable for oral, rectal, and axillary use. 60-second reading.',
        price: 199.00,
        originalPrice: 299.00,
        stock: 500,
        rxRequired: false,
        imageUrl: '/images/products/thermometer.jpg',
        categoryId: devicesCategory.id,
      },
    }),

    // --- First Aid (rxRequired: false) ---
    prisma.product.create({
      data: {
        name: 'Band-Aid Flexible Fabric Bandages - 30 Count',
        slug: 'band-aid-flexible-fabric-30',
        description: 'Flexible fabric bandages that move with your body for superior comfort. Stays on through hand washing. Assorted sizes.',
        price: 120.00,
        originalPrice: 150.00,
        stock: 800,
        rxRequired: false,
        imageUrl: '/images/products/band-aid.jpg',
        categoryId: firstAidCategory.id,
      },
    }),
    prisma.product.create({
      data: {
        name: 'Dettol Antiseptic Liquid 250ml',
        slug: 'dettol-antiseptic-liquid-250ml',
        description: 'Trusted antiseptic liquid for wound cleaning, bathing, and surface disinfection. Kills 99.9% of germs.',
        price: 145.00,
        originalPrice: 180.00,
        stock: 700,
        rxRequired: false,
        imageUrl: '/images/products/dettol.jpg',
        categoryId: firstAidCategory.id,
      },
    }),
    prisma.product.create({
      data: {
        name: 'Savlon Wound Wash Spray 100ml',
        slug: 'savlon-wound-wash-100ml',
        description: 'Easy-to-use antiseptic spray for gentle cleansing of wounds and cuts. No cotton wool needed. Suitable for all ages.',
        price: 189.00,
        originalPrice: 225.00,
        stock: 400,
        rxRequired: false,
        imageUrl: '/images/products/savlon-spray.jpg',
        categoryId: firstAidCategory.id,
      },
    }),
  ]);

  console.log(`✅ Created ${products.length} products`);
  console.log('🎉 Database seeded successfully!');
}

main()
  .catch((e) => {
    console.error('❌ Seeding failed:', e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
