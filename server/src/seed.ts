import { PrismaClient } from "@prisma/client";
import bcrypt from "bcryptjs";

const prisma = new PrismaClient();

const svgTemplates = {
  // --- TOP (Head) ---
  cap: `<svg viewBox="0 0 200 150" xmlns="http://www.w3.org/2000/svg">
    <path d="M40 100 Q40 40 100 30 Q160 40 160 100 L150 100 Q150 55 100 45 Q50 55 50 100 Z" fill="FILL_COLOR" stroke="#333" stroke-width="2"/>
    <rect x="30" y="95" width="140" height="15" rx="3" fill="FILL_COLOR" stroke="#333" stroke-width="2"/>
    <rect x="130" y="95" width="55" height="12" rx="3" fill="FILL_COLOR" stroke="#333" stroke-width="2" opacity="0.8"/>
  </svg>`,

  beanie: `<svg viewBox="0 0 200 150" xmlns="http://www.w3.org/2000/svg">
    <ellipse cx="100" cy="25" rx="8" ry="8" fill="FILL_COLOR" stroke="#333" stroke-width="2"/>
    <path d="M45 95 Q45 35 100 25 Q155 35 155 95" fill="FILL_COLOR" stroke="#333" stroke-width="2"/>
    <rect x="40" y="85" width="120" height="20" rx="3" fill="FILL_COLOR" stroke="#333" stroke-width="2" opacity="0.85"/>
    <line x1="45" y1="90" x2="155" y2="90" stroke="#333" stroke-width="1" opacity="0.3"/>
    <line x1="45" y1="95" x2="155" y2="95" stroke="#333" stroke-width="1" opacity="0.3"/>
    <line x1="45" y1="100" x2="155" y2="100" stroke="#333" stroke-width="1" opacity="0.3"/>
  </svg>`,

  sunglasses: `<svg viewBox="0 0 200 100" xmlns="http://www.w3.org/2000/svg">
    <rect x="20" y="25" width="65" height="45" rx="10" fill="FILL_COLOR" stroke="#333" stroke-width="2" opacity="0.7"/>
    <rect x="115" y="25" width="65" height="45" rx="10" fill="FILL_COLOR" stroke="#333" stroke-width="2" opacity="0.7"/>
    <path d="M85 45 Q100 55 115 45" fill="none" stroke="#333" stroke-width="2.5"/>
    <line x1="20" y1="40" x2="5" y2="35" stroke="#333" stroke-width="2.5"/>
    <line x1="180" y1="40" x2="195" y2="35" stroke="#333" stroke-width="2.5"/>
  </svg>`,

  // --- MIDDLE (Torso) ---
  tshirt: `<svg viewBox="0 0 200 220" xmlns="http://www.w3.org/2000/svg">
    <path d="M60 10 L40 10 L5 55 L30 75 L45 55 L45 210 L155 210 L155 55 L170 75 L195 55 L160 10 L140 10 Q130 35 100 35 Q70 35 60 10 Z" fill="FILL_COLOR" stroke="#333" stroke-width="2"/>
    <path d="M60 10 Q70 35 100 35 Q130 35 140 10" fill="none" stroke="#333" stroke-width="1.5"/>
  </svg>`,

  hoodie: `<svg viewBox="0 0 200 230" xmlns="http://www.w3.org/2000/svg">
    <path d="M55 15 L35 15 L5 60 L30 80 L45 60 L45 220 L155 220 L155 60 L170 80 L195 60 L165 15 L145 15 Q135 40 100 40 Q65 40 55 15 Z" fill="FILL_COLOR" stroke="#333" stroke-width="2"/>
    <path d="M55 15 Q65 -5 100 -5 Q135 -5 145 15" fill="FILL_COLOR" stroke="#333" stroke-width="2"/>
    <path d="M65 15 Q75 35 100 35 Q125 35 135 15" fill="none" stroke="#333" stroke-width="1.5"/>
    <ellipse cx="100" cy="145" rx="22" ry="28" fill="none" stroke="#333" stroke-width="1.5" opacity="0.5"/>
    <path d="M80 90 L80 110" stroke="#333" stroke-width="4" stroke-linecap="round" opacity="0.4"/>
    <path d="M120 90 L120 110" stroke="#333" stroke-width="4" stroke-linecap="round" opacity="0.4"/>
  </svg>`,

  jacket: `<svg viewBox="0 0 200 230" xmlns="http://www.w3.org/2000/svg">
    <path d="M55 15 L35 15 L5 60 L30 80 L45 60 L45 220 L155 220 L155 60 L170 80 L195 60 L165 15 L145 15 Q135 40 100 40 Q65 40 55 15 Z" fill="FILL_COLOR" stroke="#333" stroke-width="2"/>
    <line x1="100" y1="40" x2="100" y2="220" stroke="#333" stroke-width="2"/>
    <path d="M55 15 Q65 40 100 40 Q135 40 145 15" fill="none" stroke="#333" stroke-width="2"/>
    <rect x="60" y="130" width="30" height="35" rx="3" fill="none" stroke="#333" stroke-width="1.5" opacity="0.5"/>
    <rect x="110" y="130" width="30" height="35" rx="3" fill="none" stroke="#333" stroke-width="1.5" opacity="0.5"/>
  </svg>`,

  shirt: `<svg viewBox="0 0 200 220" xmlns="http://www.w3.org/2000/svg">
    <path d="M60 10 L40 10 L5 55 L30 75 L45 55 L45 210 L155 210 L155 55 L170 75 L195 55 L160 10 L140 10 Q130 30 100 30 Q70 30 60 10 Z" fill="FILL_COLOR" stroke="#333" stroke-width="2"/>
    <path d="M60 10 Q70 30 100 30 Q130 30 140 10" fill="none" stroke="#333" stroke-width="1.5"/>
    <line x1="100" y1="30" x2="100" y2="210" stroke="#333" stroke-width="1.5"/>
    <circle cx="100" cy="55" r="3" fill="#333"/>
    <circle cx="100" cy="80" r="3" fill="#333"/>
    <circle cx="100" cy="105" r="3" fill="#333"/>
    <circle cx="100" cy="130" r="3" fill="#333"/>
    <circle cx="100" cy="155" r="3" fill="#333"/>
    <circle cx="100" cy="180" r="3" fill="#333"/>
    <path d="M70 10 L80 40 L100 30 L120 40 L130 10" fill="FILL_COLOR" stroke="#333" stroke-width="1.5"/>
  </svg>`,

  sweater: `<svg viewBox="0 0 200 220" xmlns="http://www.w3.org/2000/svg">
    <path d="M55 15 L35 15 L5 60 L30 80 L45 60 L45 210 L155 210 L155 60 L170 80 L195 60 L165 15 L145 15 Q135 35 100 35 Q65 35 55 15 Z" fill="FILL_COLOR" stroke="#333" stroke-width="2"/>
    <path d="M55 15 Q65 -2 100 -2 Q135 -2 145 15" fill="FILL_COLOR" stroke="#333" stroke-width="2"/>
    <path d="M60 18 Q70 32 100 32 Q130 32 140 18" fill="none" stroke="#333" stroke-width="1"/>
    <line x1="45" y1="200" x2="155" y2="200" stroke="#333" stroke-width="2" opacity="0.4"/>
    <line x1="45" y1="195" x2="155" y2="195" stroke="#333" stroke-width="1" opacity="0.3"/>
  </svg>`,

  vest: `<svg viewBox="0 0 200 220" xmlns="http://www.w3.org/2000/svg">
    <path d="M60 10 L55 10 L55 210 L145 210 L145 10 L140 10 Q130 35 100 35 Q70 35 60 10 Z" fill="FILL_COLOR" stroke="#333" stroke-width="2"/>
    <path d="M60 10 Q70 35 100 35 Q130 35 140 10" fill="none" stroke="#333" stroke-width="1.5"/>
    <line x1="100" y1="35" x2="100" y2="210" stroke="#333" stroke-width="1.5"/>
    <rect x="65" y="110" width="25" height="30" rx="3" fill="none" stroke="#333" stroke-width="1.5" opacity="0.5"/>
    <rect x="110" y="110" width="25" height="30" rx="3" fill="none" stroke="#333" stroke-width="1.5" opacity="0.5"/>
  </svg>`,

  // --- BOTTOM (Pants/Skirt) ---
  jeans: `<svg viewBox="0 0 200 250" xmlns="http://www.w3.org/2000/svg">
    <path d="M40 10 L40 15 Q40 130 30 240 L90 240 L100 140 L110 240 L170 240 Q160 130 160 15 L160 10 Z" fill="FILL_COLOR" stroke="#333" stroke-width="2"/>
    <path d="M40 10 L160 10" stroke="#333" stroke-width="3"/>
    <path d="M40 30 L160 30" stroke="#333" stroke-width="1" opacity="0.3"/>
    <rect x="55" y="35" width="25" height="30" rx="2" fill="none" stroke="#333" stroke-width="1.5" opacity="0.4"/>
    <rect x="120" y="35" width="25" height="30" rx="2" fill="none" stroke="#333" stroke-width="1.5" opacity="0.4"/>
  </svg>`,

  shorts: `<svg viewBox="0 0 200 160" xmlns="http://www.w3.org/2000/svg">
    <path d="M40 10 L40 15 Q40 80 35 150 L90 150 L100 100 L110 150 L165 150 Q160 80 160 15 L160 10 Z" fill="FILL_COLOR" stroke="#333" stroke-width="2"/>
    <path d="M40 10 L160 10" stroke="#333" stroke-width="3"/>
    <path d="M40 30 L160 30" stroke="#333" stroke-width="1" opacity="0.3"/>
    <rect x="55" y="35" width="25" height="25" rx="2" fill="none" stroke="#333" stroke-width="1.5" opacity="0.4"/>
  </svg>`,

  skirt: `<svg viewBox="0 0 200 200" xmlns="http://www.w3.org/2000/svg">
    <path d="M50 10 L20 190 L180 190 L150 10 Z" fill="FILL_COLOR" stroke="#333" stroke-width="2"/>
    <path d="M50 10 L150 10" stroke="#333" stroke-width="3"/>
    <path d="M50 25 L150 25" stroke="#333" stroke-width="1" opacity="0.3"/>
    <path d="M100 10 L100 190" stroke="#333" stroke-width="1" opacity="0.15"/>
  </svg>`,

  joggers: `<svg viewBox="0 0 200 250" xmlns="http://www.w3.org/2000/svg">
    <path d="M45 10 L40 15 Q38 130 40 225 Q60 235 80 225 L95 140 L105 140 L120 225 Q140 235 160 225 Q162 130 160 15 L155 10 Z" fill="FILL_COLOR" stroke="#333" stroke-width="2"/>
    <path d="M45 10 L155 10" stroke="#333" stroke-width="3"/>
    <path d="M45 25 L155 25" stroke="#333" stroke-width="1.5" opacity="0.3"/>
    <path d="M45 30 L155 30" stroke="#333" stroke-width="1" opacity="0.2"/>
  </svg>`,
};

async function seed() {
  console.log("Seeding database...");

  // Create admin user
  const adminPassword = await bcrypt.hash("admin123", 10);
  const admin = await prisma.user.upsert({
    where: { username: "admin" },
    update: {},
    create: {
      username: "admin",
      email: "admin@outfit.com",
      hashedPassword: adminPassword,
      isAdmin: true,
    },
  });
  console.log("Admin user created:", admin.username);

  // Create demo user
  const demoPassword = await bcrypt.hash("demo123", 10);
  const demo = await prisma.user.upsert({
    where: { username: "demo" },
    update: {},
    create: {
      username: "demo",
      email: "demo@outfit.com",
      hashedPassword: demoPassword,
      isAdmin: false,
    },
  });
  console.log("Demo user created:", demo.username);

  // Create categories
  const topCategory = await prisma.clothingCategory.create({
    data: { name: "Головные уборы", zone: "top", displayOrder: 1 },
  });
  const middleCategory = await prisma.clothingCategory.create({
    data: { name: "Верхняя одежда", zone: "middle", displayOrder: 2 },
  });
  const bottomCategory = await prisma.clothingCategory.create({
    data: { name: "Нижняя одежда", zone: "bottom", displayOrder: 3 },
  });

  // Create items
  const items = [
    // Top
    { name: "Кепка", categoryId: topCategory.id, svg: svgTemplates.cap, color: "#2563EB" },
    { name: "Шапка", categoryId: topCategory.id, svg: svgTemplates.beanie, color: "#DC2626" },
    { name: "Очки", categoryId: topCategory.id, svg: svgTemplates.sunglasses, color: "#1F2937" },
    // Middle
    { name: "Футболка", categoryId: middleCategory.id, svg: svgTemplates.tshirt, color: "#FFFFFF" },
    { name: "Толстовка", categoryId: middleCategory.id, svg: svgTemplates.hoodie, color: "#6B7280" },
    { name: "Куртка", categoryId: middleCategory.id, svg: svgTemplates.jacket, color: "#1E3A5F" },
    { name: "Рубашка", categoryId: middleCategory.id, svg: svgTemplates.shirt, color: "#E5E7EB" },
    { name: "Свитер", categoryId: middleCategory.id, svg: svgTemplates.sweater, color: "#92400E" },
    { name: "Жилет", categoryId: middleCategory.id, svg: svgTemplates.vest, color: "#374151" },
    // Bottom
    { name: "Джинсы", categoryId: bottomCategory.id, svg: svgTemplates.jeans, color: "#1E40AF" },
    { name: "Шорты", categoryId: bottomCategory.id, svg: svgTemplates.shorts, color: "#059669" },
    { name: "Юбка", categoryId: bottomCategory.id, svg: svgTemplates.skirt, color: "#DB2777" },
    { name: "Джоггеры", categoryId: bottomCategory.id, svg: svgTemplates.joggers, color: "#4B5563" },
  ];

  for (const item of items) {
    await prisma.clothingItem.create({
      data: {
        name: item.name,
        categoryId: item.categoryId,
        svgTemplate: item.svg,
        defaultColor: item.color,
      },
    });
  }

  console.log(`Created ${items.length} clothing items`);
  console.log("Seed completed!");
}

seed()
  .catch(console.error)
  .finally(() => prisma.$disconnect());
