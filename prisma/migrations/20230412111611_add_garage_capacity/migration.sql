/*
  Warnings:

  - Added the required column `capacity` to the `Garage` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE `Garage` ADD COLUMN `capacity` INTEGER NOT NULL;
