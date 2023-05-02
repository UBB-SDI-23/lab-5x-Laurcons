-- add default user
INSERT IGNORE INTO `User` (username, password, status) VALUES ('_default', '-', 'not_activated');
UPDATE `User` SET id=0 WHERE username='_default';

-- AlterTable
ALTER TABLE `Bus` ADD COLUMN `ownerId` INTEGER NOT NULL DEFAULT 0;

-- AlterTable
ALTER TABLE `Garage` ADD COLUMN `ownerId` INTEGER NOT NULL DEFAULT 0;

-- AlterTable
ALTER TABLE `Line` ADD COLUMN `ownerId` INTEGER NOT NULL DEFAULT 0;

-- AlterTable
ALTER TABLE `LineStop` ADD COLUMN `ownerId` INTEGER NOT NULL DEFAULT 0;

-- AlterTable
ALTER TABLE `Station` ADD COLUMN `ownerId` INTEGER NOT NULL DEFAULT 0;

-- AlterTable
ALTER TABLE `StationSign` ADD COLUMN `ownerId` INTEGER NOT NULL DEFAULT 0;

-- AddForeignKey
ALTER TABLE `Bus` ADD CONSTRAINT `Bus_ownerId_fkey` FOREIGN KEY (`ownerId`) REFERENCES `User`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `Garage` ADD CONSTRAINT `Garage_ownerId_fkey` FOREIGN KEY (`ownerId`) REFERENCES `User`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `Line` ADD CONSTRAINT `Line_ownerId_fkey` FOREIGN KEY (`ownerId`) REFERENCES `User`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `Station` ADD CONSTRAINT `Station_ownerId_fkey` FOREIGN KEY (`ownerId`) REFERENCES `User`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `LineStop` ADD CONSTRAINT `LineStop_ownerId_fkey` FOREIGN KEY (`ownerId`) REFERENCES `User`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `StationSign` ADD CONSTRAINT `StationSign_ownerId_fkey` FOREIGN KEY (`ownerId`) REFERENCES `User`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;
