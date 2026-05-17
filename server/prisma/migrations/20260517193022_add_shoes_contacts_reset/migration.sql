-- CreateTable
CREATE TABLE "User" (
    "id" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
    "username" TEXT NOT NULL,
    "email" TEXT NOT NULL,
    "hashedPassword" TEXT NOT NULL,
    "isAdmin" BOOLEAN NOT NULL DEFAULT false,
    "avatarUrl" TEXT,
    "resetToken" TEXT,
    "resetTokenExp" DATETIME,
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP
);

-- CreateTable
CREATE TABLE "ClothingCategory" (
    "id" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
    "name" TEXT NOT NULL,
    "zone" TEXT NOT NULL,
    "displayOrder" INTEGER NOT NULL DEFAULT 0
);

-- CreateTable
CREATE TABLE "ClothingItem" (
    "id" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
    "name" TEXT NOT NULL,
    "categoryId" INTEGER NOT NULL,
    "svgTemplate" TEXT NOT NULL,
    "defaultColor" TEXT NOT NULL DEFAULT '#CCCCCC',
    "isActive" BOOLEAN NOT NULL DEFAULT true,
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT "ClothingItem_categoryId_fkey" FOREIGN KEY ("categoryId") REFERENCES "ClothingCategory" ("id") ON DELETE CASCADE ON UPDATE CASCADE
);

-- CreateTable
CREATE TABLE "Outfit" (
    "id" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
    "userId" INTEGER NOT NULL,
    "name" TEXT NOT NULL,
    "topItemId" INTEGER,
    "topColor" TEXT,
    "middleItemId" INTEGER,
    "middleColor" TEXT,
    "bottomItemId" INTEGER,
    "bottomColor" TEXT,
    "shoesItemId" INTEGER,
    "shoesColor" TEXT,
    "previewData" TEXT,
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT "Outfit_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User" ("id") ON DELETE CASCADE ON UPDATE CASCADE,
    CONSTRAINT "Outfit_topItemId_fkey" FOREIGN KEY ("topItemId") REFERENCES "ClothingItem" ("id") ON DELETE SET NULL ON UPDATE CASCADE,
    CONSTRAINT "Outfit_middleItemId_fkey" FOREIGN KEY ("middleItemId") REFERENCES "ClothingItem" ("id") ON DELETE SET NULL ON UPDATE CASCADE,
    CONSTRAINT "Outfit_bottomItemId_fkey" FOREIGN KEY ("bottomItemId") REFERENCES "ClothingItem" ("id") ON DELETE SET NULL ON UPDATE CASCADE,
    CONSTRAINT "Outfit_shoesItemId_fkey" FOREIGN KEY ("shoesItemId") REFERENCES "ClothingItem" ("id") ON DELETE SET NULL ON UPDATE CASCADE
);

-- CreateTable
CREATE TABLE "SavedItem" (
    "id" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
    "userId" INTEGER NOT NULL,
    "itemId" INTEGER NOT NULL,
    "customColor" TEXT NOT NULL,
    "name" TEXT,
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT "SavedItem_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User" ("id") ON DELETE CASCADE ON UPDATE CASCADE,
    CONSTRAINT "SavedItem_itemId_fkey" FOREIGN KEY ("itemId") REFERENCES "ClothingItem" ("id") ON DELETE CASCADE ON UPDATE CASCADE
);

-- CreateTable
CREATE TABLE "ContactMessage" (
    "id" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
    "name" TEXT NOT NULL,
    "email" TEXT NOT NULL,
    "subject" TEXT NOT NULL,
    "message" TEXT NOT NULL,
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP
);

-- CreateIndex
CREATE UNIQUE INDEX "User_username_key" ON "User"("username");

-- CreateIndex
CREATE UNIQUE INDEX "User_email_key" ON "User"("email");
