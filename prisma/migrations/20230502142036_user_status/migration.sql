-- AlterTable
ALTER TABLE `User` MODIFY `status` ENUM('not_activated', 'activated') NOT NULL DEFAULT 'not_activated';
