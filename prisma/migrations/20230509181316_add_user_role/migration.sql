-- AlterTable
ALTER TABLE `User` ADD COLUMN `role` ENUM('regular', 'moderator', 'admin') NOT NULL DEFAULT 'regular';
