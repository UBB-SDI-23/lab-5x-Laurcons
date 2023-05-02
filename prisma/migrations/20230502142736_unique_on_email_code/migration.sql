/*
  Warnings:

  - A unique constraint covering the columns `[emailActivationCode]` on the table `User` will be added. If there are existing duplicate values, this will fail.

*/
-- CreateIndex
CREATE UNIQUE INDEX `User_emailActivationCode_key` ON `User`(`emailActivationCode`);
