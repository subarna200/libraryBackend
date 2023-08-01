/*
  Warnings:

  - You are about to alter the column `createdAt` on the `BookTransaction` table. The data in that column could be lost. The data in that column will be cast from `DateTime(0)` to `DateTime`.
  - You are about to alter the column `UpdatedAt` on the `BookTransaction` table. The data in that column could be lost. The data in that column will be cast from `DateTime(0)` to `DateTime`.
  - You are about to alter the column `CreatedAt` on the `Books` table. The data in that column could be lost. The data in that column will be cast from `DateTime(0)` to `DateTime`.
  - You are about to alter the column `UpdatedAt` on the `Books` table. The data in that column could be lost. The data in that column will be cast from `DateTime(0)` to `DateTime`.
  - You are about to alter the column `createdAt` on the `FineTransaction` table. The data in that column could be lost. The data in that column will be cast from `DateTime(0)` to `DateTime`.
  - You are about to alter the column `UpdatedAt` on the `FineTransaction` table. The data in that column could be lost. The data in that column will be cast from `DateTime(0)` to `DateTime`.
  - You are about to alter the column `CreatedAt` on the `Students` table. The data in that column could be lost. The data in that column will be cast from `DateTime(0)` to `DateTime`.
  - You are about to alter the column `UpdatedAt` on the `Students` table. The data in that column could be lost. The data in that column will be cast from `DateTime(0)` to `DateTime`.
  - You are about to alter the column `CreatedAt` on the `User` table. The data in that column could be lost. The data in that column will be cast from `DateTime(0)` to `DateTime`.
  - You are about to alter the column `UpdatedAt` on the `User` table. The data in that column could be lost. The data in that column will be cast from `DateTime(0)` to `DateTime`.

*/
-- AlterTable
ALTER TABLE `BookTransaction` MODIFY `createdAt` DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    MODIFY `UpdatedAt` DATETIME NULL;

-- AlterTable
ALTER TABLE `Books` MODIFY `CreatedAt` DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    MODIFY `UpdatedAt` DATETIME NULL;

-- AlterTable
ALTER TABLE `FineTransaction` MODIFY `createdAt` DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    MODIFY `UpdatedAt` DATETIME NULL;

-- AlterTable
ALTER TABLE `Students` MODIFY `CreatedAt` DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    MODIFY `UpdatedAt` DATETIME NULL;

-- AlterTable
ALTER TABLE `User` MODIFY `CreatedAt` DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    MODIFY `UpdatedAt` DATETIME NULL;
