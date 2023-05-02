/*
  Warnings:

  - Added the required column `status` to the `User` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE `User` ADD COLUMN `emailActivationCode` VARCHAR(191) NULL,
    ADD COLUMN `status` ENUM('not_activated', 'activated') NOT NULL;
