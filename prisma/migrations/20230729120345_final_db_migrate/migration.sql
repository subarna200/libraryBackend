-- CreateTable
CREATE TABLE `User` (
    `User_Id` INTEGER NOT NULL AUTO_INCREMENT,
    `First_Name` VARCHAR(191) NOT NULL,
    `Last_Name` VARCHAR(191) NOT NULL,
    `Email` VARCHAR(191) NOT NULL,
    `Password` VARCHAR(191) NOT NULL,
    `photo` VARCHAR(191) NULL,
    `CreatedAt` DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    `UpdatedAt` DATETIME NULL,
    `photo_public_id` VARCHAR(191) NULL,

    UNIQUE INDEX `User_Email_key`(`Email`),
    PRIMARY KEY (`User_Id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `Students` (
    `Student_Id` INTEGER NOT NULL AUTO_INCREMENT,
    `First_Name` VARCHAR(191) NOT NULL,
    `Last_Name` VARCHAR(191) NOT NULL,
    `Email` VARCHAR(191) NOT NULL,
    `Password` VARCHAR(191) NULL,
    `photo` VARCHAR(191) NULL,
    `photo_public_id` VARCHAR(191) NULL,
    `Academics` VARCHAR(191) NOT NULL,
    `isEmailVerified` INTEGER NOT NULL DEFAULT 0,
    `OTP` INTEGER NULL,
    `OTP_EXPIRY` VARCHAR(191) NULL,
    `CreatedAt` DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    `UpdatedAt` DATETIME NULL,

    UNIQUE INDEX `Students_Email_key`(`Email`),
    PRIMARY KEY (`Student_Id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `Books` (
    `Book_Id` INTEGER NOT NULL AUTO_INCREMENT,
    `Book_Name` VARCHAR(191) NOT NULL,
    `Author_Name` VARCHAR(191) NOT NULL,
    `Publication` VARCHAR(191) NOT NULL,
    `Published_Date` VARCHAR(191) NOT NULL,
    `Quantity` INTEGER NOT NULL,
    `CreatedAt` DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    `UpdatedAt` DATETIME NULL,

    PRIMARY KEY (`Book_Id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `BookTransaction` (
    `Id` INTEGER NOT NULL AUTO_INCREMENT,
    `NepaliDate` VARCHAR(191) NOT NULL,
    `Status` VARCHAR(191) NOT NULL,
    `Due_Date` VARCHAR(191) NOT NULL,
    `Fine_Amt` INTEGER NOT NULL DEFAULT 0,
    `returnedAt` VARCHAR(191) NULL,
    `createdAt` DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    `UpdatedAt` DATETIME NULL,
    `Book_Id` INTEGER NOT NULL,
    `Student_Id` INTEGER NOT NULL,

    PRIMARY KEY (`Id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `FineTransaction` (
    `Id` INTEGER NOT NULL AUTO_INCREMENT,
    `NepaliDate` VARCHAR(191) NOT NULL,
    `Amount_Recieved` INTEGER NOT NULL,
    `TransactionId` INTEGER NOT NULL,
    `createdAt` DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    `UpdatedAt` DATETIME NULL,

    PRIMARY KEY (`Id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- AddForeignKey
ALTER TABLE `BookTransaction` ADD CONSTRAINT `BookTransaction_Book_Id_fkey` FOREIGN KEY (`Book_Id`) REFERENCES `Books`(`Book_Id`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `BookTransaction` ADD CONSTRAINT `BookTransaction_Student_Id_fkey` FOREIGN KEY (`Student_Id`) REFERENCES `Students`(`Student_Id`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `FineTransaction` ADD CONSTRAINT `FineTransaction_TransactionId_fkey` FOREIGN KEY (`TransactionId`) REFERENCES `BookTransaction`(`Id`) ON DELETE RESTRICT ON UPDATE CASCADE;
