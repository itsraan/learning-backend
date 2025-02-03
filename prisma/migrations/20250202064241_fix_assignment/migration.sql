-- DropForeignKey
ALTER TABLE `Assignment` DROP FOREIGN KEY `Assignment_authorId_fkey`;

-- DropIndex
DROP INDEX `Assignment_authorId_fkey` ON `Assignment`;

-- AddForeignKey
ALTER TABLE `Assignment` ADD CONSTRAINT `Assignment_authorId_fkey` FOREIGN KEY (`authorId`) REFERENCES `User`(`id`) ON DELETE CASCADE ON UPDATE CASCADE;
