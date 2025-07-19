-- RedefineTables
PRAGMA defer_foreign_keys=ON;
PRAGMA foreign_keys=OFF;
CREATE TABLE "new_coupons" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "code" TEXT NOT NULL,
    "description" TEXT,
    "discountType" TEXT NOT NULL,
    "discountValue" REAL NOT NULL,
    "minAmount" REAL,
    "maxDiscount" REAL,
    "usageLimit" INTEGER,
    "usedCount" INTEGER NOT NULL DEFAULT 0,
    "isActive" BOOLEAN NOT NULL DEFAULT true,
    "validFrom" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "validUntil" DATETIME,
    "appliesToAllCourses" BOOLEAN NOT NULL DEFAULT true,
    "allowedCourseIds" TEXT,
    "canStackWithOtherCoupons" BOOLEAN NOT NULL DEFAULT false,
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" DATETIME NOT NULL
);
INSERT INTO "new_coupons" ("code", "createdAt", "description", "discountType", "discountValue", "id", "isActive", "maxDiscount", "minAmount", "updatedAt", "usageLimit", "usedCount", "validFrom", "validUntil") SELECT "code", "createdAt", "description", "discountType", "discountValue", "id", "isActive", "maxDiscount", "minAmount", "updatedAt", "usageLimit", "usedCount", "validFrom", "validUntil" FROM "coupons";
DROP TABLE "coupons";
ALTER TABLE "new_coupons" RENAME TO "coupons";
CREATE UNIQUE INDEX "coupons_code_key" ON "coupons"("code");
PRAGMA foreign_keys=ON;
PRAGMA defer_foreign_keys=OFF;
