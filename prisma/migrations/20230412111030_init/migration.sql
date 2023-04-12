-- CreateTable
CREATE TABLE `Bus` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `manufacturer` VARCHAR(191) NOT NULL,
    `model` VARCHAR(191) NOT NULL,
    `fuel` VARCHAR(191) NOT NULL,
    `inventoryNum` BIGINT NOT NULL,
    `licensePlate` VARCHAR(191) NOT NULL,
    `garageId` INTEGER NOT NULL,

    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `Garage` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `name` VARCHAR(191) NOT NULL,
    `location` VARCHAR(191) NOT NULL,

    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `Line` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `name` VARCHAR(191) NOT NULL,
    `startName` VARCHAR(191) NOT NULL,
    `endName` VARCHAR(191) NOT NULL,
    `monthlyRidership` INTEGER NOT NULL,
    `startGarageId` INTEGER NOT NULL,
    `endGarageId` INTEGER NOT NULL,

    UNIQUE INDEX `Line_name_key`(`name`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `Station` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `name` VARCHAR(191) NOT NULL,
    `stationSignId` INTEGER NULL,

    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `LineStop` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `stationId` INTEGER NOT NULL,
    `lineId` INTEGER NOT NULL,
    `direction` VARCHAR(191) NOT NULL,
    `isServicedInWeekends` BOOLEAN NOT NULL,

    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `StationSign` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `stationId` INTEGER NOT NULL,
    `externalLinesInfo` VARCHAR(191) NOT NULL,
    `hasBothSides` BOOLEAN NOT NULL,
    `administration` VARCHAR(191) NOT NULL,

    UNIQUE INDEX `StationSign_stationId_key`(`stationId`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- AddForeignKey
ALTER TABLE `Bus` ADD CONSTRAINT `Bus_garageId_fkey` FOREIGN KEY (`garageId`) REFERENCES `Garage`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `Line` ADD CONSTRAINT `Line_startGarageId_fkey` FOREIGN KEY (`startGarageId`) REFERENCES `Garage`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `Line` ADD CONSTRAINT `Line_endGarageId_fkey` FOREIGN KEY (`endGarageId`) REFERENCES `Garage`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `LineStop` ADD CONSTRAINT `LineStop_stationId_fkey` FOREIGN KEY (`stationId`) REFERENCES `Station`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `LineStop` ADD CONSTRAINT `LineStop_lineId_fkey` FOREIGN KEY (`lineId`) REFERENCES `Line`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `StationSign` ADD CONSTRAINT `StationSign_stationId_fkey` FOREIGN KEY (`stationId`) REFERENCES `Station`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;
