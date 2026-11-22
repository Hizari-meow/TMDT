import * as dotenv from 'dotenv';
dotenv.config({ path: '../../.env' });
dotenv.config();

import { PrismaClient } from '@prisma/client';
import Redis from 'ioredis';

const prisma = new PrismaClient();

export const DEFAULT_USER_ID = '33333333-3333-3333-3333-333333333333';
export const DEFAULT_PRODUCT_ID = '22222222-2222-2222-2222-222222222222';
export const DEFAULT_FLASH_SALE_ID = '11111111-1111-1111-1111-111111111111';

// Additional Catalog UUIDs
export const CATEGORY_IDS = {
  SMARTPHONES: 'aaaa0001-0000-0000-0000-000000000001',
  LAPTOPS: 'aaaa0002-0000-0000-0000-000000000002',
  AUDIO: 'aaaa0003-0000-0000-0000-000000000003',
  ACCESSORIES: 'aaaa0004-0000-0000-0000-000000000004',
  FASHION_MEN: 'aaaa0005-0000-0000-0000-000000000005',
  SPORTSWEAR: 'aaaa0006-0000-0000-0000-000000000006',
};

export const PRODUCT_IDS = {
  IPHONE_16_PRO: DEFAULT_PRODUCT_ID,
  MACBOOK_PRO_16: '22222222-2222-2222-2222-000000000002',
  AIRPODS_PRO_2: '22222222-2222-2222-2222-000000000003',
  WATCH_ULTRA_2: '22222222-2222-2222-2222-000000000004',
  MAGSAFE_CHARGER: '22222222-2222-2222-2222-000000000005',
  POLO_SHIRT: '22222222-2222-2222-2222-000000000006',
  BOMBER_JACKET: '22222222-2222-2222-2222-000000000007',
  RUNNING_SHORTS: '22222222-2222-2222-2222-000000000008',
  ALPINE_LOOP: '22222222-2222-2222-2222-000000000009',
};

async function main() {
  console.log('--- Commencing E-Commerce Database & In-Memory Seeding ---');

  // 1. Seed Demo User
  const user = await prisma.user.upsert({
    where: { id: DEFAULT_USER_ID },
    update: {
      email: 'buyer@flashsale.com',
      fullName: 'Flash Sale Demo Buyer',
    },
    create: {
      id: DEFAULT_USER_ID,
      email: 'buyer@flashsale.com',
      passwordHash: '$2b$10$epw3z7B8hE3M7N.3bHhC9u.vEaOq31xGfN2GZp70Wq9e3T7kY7U1S',
      fullName: 'Flash Sale Demo Buyer',
    },
  });
  console.log(`✓ User seeded: ${user.fullName} (${user.email}) [ID: ${user.id}]`);

  // 2. Seed Categories
  const categoriesData = [
    {
      id: CATEGORY_IDS.SMARTPHONES,
      name: 'Smartphones & Devices',
      slug: 'smartphones',
      description: 'Cutting-edge flagship smartphones and mobile innovations.',
    },
    {
      id: CATEGORY_IDS.LAPTOPS,
      name: 'Laptops & Workstations',
      slug: 'laptops',
      description: 'High-performance computing for professionals and creators.',
    },
    {
      id: CATEGORY_IDS.AUDIO,
      name: 'Audio & Wearables',
      slug: 'audio-wearables',
      description: 'Audiophile-grade acoustics and precision biometric wearables.',
    },
    {
      id: CATEGORY_IDS.ACCESSORIES,
      name: 'Power & Accessories',
      slug: 'accessories',
      description: 'Certified premium cables, wireless chargers, and essentials.',
    },
    {
      id: CATEGORY_IDS.FASHION_MEN,
      name: 'Thời Trang & Polo',
      slug: 'fashion-men',
      description: 'Thời trang nam cao cấp, áo thun polo co giãn và áo khoác thời thượng.',
    },
    {
      id: CATEGORY_IDS.SPORTSWEAR,
      name: 'Thể Thao & Dã Ngoại',
      slug: 'sportswear',
      description: 'Trang phục vận động viên, quần chạy bộ và phụ kiện năng động.',
    },
  ];

  for (const cat of categoriesData) {
    const c = await prisma.category.upsert({
      where: { id: cat.id },
      update: { name: cat.name, slug: cat.slug, description: cat.description },
      create: cat,
    });
    console.log(`✓ Category seeded: ${c.name} [slug: ${c.slug}]`);
  }

  // 3. Seed Products Catalog
  const productsData = [
    {
      id: PRODUCT_IDS.IPHONE_16_PRO,
      categoryId: CATEGORY_IDS.SMARTPHONES,
      name: 'iPhone 16 Pro 256GB - Titanium Natural',
      description: 'The ultimate iPhone powered by Apple A18 Pro chip, Grade 5 titanium design, and 48MP Fusion camera system.',
      price: 999.00,
      stock: 100,
      imageUrl: 'https://images.unsplash.com/photo-1695048133142-1a20484d2569?w=800&auto=format&fit=crop&q=80',
    },
    {
      id: PRODUCT_IDS.MACBOOK_PRO_16,
      categoryId: CATEGORY_IDS.LAPTOPS,
      name: 'MacBook Pro 16" M3 Max 36GB - Space Black',
      description: 'Engineered for extreme workloads with 16-core CPU, 40-core GPU, and Liquid Retina XDR display with ProMotion.',
      price: 3499.00,
      stock: 45,
      imageUrl: 'https://images.unsplash.com/photo-1517336714731-489689fd1ca8?w=800&auto=format&fit=crop&q=80',
    },
    {
      id: PRODUCT_IDS.AIRPODS_PRO_2,
      categoryId: CATEGORY_IDS.AUDIO,
      name: 'AirPods Pro 2 (USB-C) with Active Noise Cancellation',
      description: 'Next-level Active Noise Cancellation, Adaptive Audio, and Personalized Spatial Audio with dynamic head tracking.',
      price: 249.00,
      stock: 150,
      imageUrl: 'https://images.unsplash.com/photo-1600294037681-c80b4cb5b434?w=800&auto=format&fit=crop&q=80',
    },
    {
      id: PRODUCT_IDS.WATCH_ULTRA_2,
      categoryId: CATEGORY_IDS.AUDIO,
      name: 'Apple Watch Ultra 2 GPS + Cellular 49mm Titanium',
      description: 'The most rugged and capable Apple Watch. S9 SiP, stunning 3000-nit display, and up to 72 hours in Low Power Mode.',
      price: 799.00,
      stock: 80,
      imageUrl: 'https://images.unsplash.com/photo-1508685096489-7aacd43bd3b1?w=800&auto=format&fit=crop&q=80',
    },
    {
      id: PRODUCT_IDS.MAGSAFE_CHARGER,
      categoryId: CATEGORY_IDS.ACCESSORIES,
      name: 'MagSafe 25W Fast Wireless Charger (2m Cable)',
      description: 'Snap-on fast charging up to 25W with Qi2 and MagSafe ecosystem compatibility.',
      price: 39.00,
      stock: 300,
      imageUrl: 'https://images.unsplash.com/photo-1583863788434-e58a36330cf0?w=800&auto=format&fit=crop&q=80',
    },
    {
      id: PRODUCT_IDS.POLO_SHIRT,
      categoryId: CATEGORY_IDS.FASHION_MEN,
      name: 'Áo Thun Polo Thể Thao Nam Breathable Co Giãn',
      description: 'Chất liệu vải thể thao co giãn 4 chiều, thoáng khí, kháng khuẩn, công nghệ Cool-Dry thấm hút mồ hôi tối ưu.',
      price: 45.00,
      stock: 120,
      imageUrl: 'https://images.unsplash.com/photo-1581655353564-df123a1eb820?w=800&auto=format&fit=crop&q=80',
    },
    {
      id: PRODUCT_IDS.BOMBER_JACKET,
      categoryId: CATEGORY_IDS.FASHION_MEN,
      name: 'Áo Khoác Gió Bomber TechZone Windbreaker',
      description: 'Chống nước nhẹ chuẩn IPX4, chống gió 100% với lớp lót thoáng khí Polycarbonate cao cấp năng động.',
      price: 89.00,
      stock: 65,
      imageUrl: 'https://images.unsplash.com/photo-1544441893-675973e31985?w=800&auto=format&fit=crop&q=80',
    },
    {
      id: PRODUCT_IDS.RUNNING_SHORTS,
      categoryId: CATEGORY_IDS.SPORTSWEAR,
      name: 'Quần Short Chạy Bộ Quick-Dry Pro 2-in-1',
      description: 'Thiết kế 2 lớp chống cọ xát, chất vải dệt FineWoven kháng khuẩn, tích hợp ngăn đựng điện thoại an toàn.',
      price: 35.00,
      stock: 90,
      imageUrl: 'https://images.unsplash.com/photo-1591195853828-11db59a44f6b?w=800&auto=format&fit=crop&q=80',
    },
    {
      id: PRODUCT_IDS.ALPINE_LOOP,
      categoryId: CATEGORY_IDS.SPORTSWEAR,
      name: 'Dây Đeo Apple Watch Alpine Loop Vải Dệt FineWoven',
      description: 'Dây đeo thể thao mạo hiểm 2 lớp vải dệt liền mạch, móc G Titan chống gỉ ăn mòn.',
      price: 49.00,
      stock: 85,
      imageUrl: 'https://images.unsplash.com/photo-1508685096489-7aacd43bd3b1?w=800&auto=format&fit=crop&q=80',
    },
  ];

  for (const prod of productsData) {
    const p = await prisma.product.upsert({
      where: { id: prod.id },
      update: {
        name: prod.name,
        description: prod.description,
        price: prod.price,
        stock: prod.stock,
        imageUrl: prod.imageUrl,
        categoryId: prod.categoryId,
      },
      create: prod,
    });
    console.log(`✓ Product seeded: ${p.name} ($${p.price}, Stock: ${p.stock}) [ID: ${p.id}]`);
  }

  // 4. Seed Flash Sale Event (100 units of iPhone 16 Pro at $499)
  const now = new Date();
  const startTime = new Date(now.getTime() - 60 * 60 * 1000); // started 1 hour ago
  const endTime = new Date(now.getTime() + 24 * 60 * 60 * 1000); // ends in 24 hours

  const flashSale = await prisma.flashSale.upsert({
    where: { id: DEFAULT_FLASH_SALE_ID },
    update: {
      flashPrice: 499.00,
      allocatedStock: 100,
      startTime,
      endTime,
      status: 'ACTIVE',
    },
    create: {
      id: DEFAULT_FLASH_SALE_ID,
      productId: DEFAULT_PRODUCT_ID,
      flashPrice: 499.00,
      allocatedStock: 100,
      startTime,
      endTime,
      status: 'ACTIVE',
    },
  });
  console.log(`✓ Flash Sale Event seeded: $${flashSale.flashPrice} (Allocated: ${flashSale.allocatedStock} units) [ID: ${flashSale.id}]`);

  // 5. Seed Redis In-Memory State
  const redisHost = process.env.REDIS_HOST || 'localhost';
  const redisPort = parseInt(process.env.REDIS_PORT || '6379', 10);
  const redisPassword = process.env.REDIS_PASSWORD || 'redis_secure_password';

  const redis = new Redis({
    host: redisHost,
    port: redisPort,
    password: redisPassword,
    maxRetriesPerRequest: 3,
  });

  const stockKey = `stock:flash_sale:${flashSale.id}`;
  await redis.set(stockKey, '100');
  console.log(`✓ Redis in-memory stock initialized: ${stockKey} = 100`);

  // Populate Product Caches with Randomized TTL Jitter (300s + rand(1..30)s)
  for (const prod of productsData) {
    const cacheKey = `cache:product:${prod.id}`;
    const productCacheData = {
      id: prod.id,
      name: prod.name,
      description: prod.description,
      price: prod.price,
      stock: prod.stock,
      imageUrl: prod.imageUrl,
      categoryId: prod.categoryId,
      flashSale: prod.id === DEFAULT_PRODUCT_ID ? {
        id: flashSale.id,
        flashPrice: flashSale.flashPrice,
        allocatedStock: flashSale.allocatedStock,
        startTime: flashSale.startTime,
        endTime: flashSale.endTime,
        status: flashSale.status,
      } : null,
    };
    const jitteredTtl = 300 + Math.floor(Math.random() * 30) + 1;
    await redis.set(cacheKey, JSON.stringify(productCacheData), 'EX', jitteredTtl);
  }
  console.log(`✓ Redis product catalog cached with anti-stampede TTL jitter.`);

  await redis.quit();
  console.log('--- E-Commerce Database & In-Memory Seeding Complete ---');
}

main()
  .catch((e) => {
    console.error('Seeding error:', e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
