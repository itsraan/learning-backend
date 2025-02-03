-- DropForeignKey
ALTER TABLE `Course` DROP FOREIGN KEY `Course_authorId_fkey`;

-- DropIndex
DROP INDEX `Course_authorId_fkey` ON `Course`;

-- AddForeignKey
ALTER TABLE `Course` ADD CONSTRAINT `Course_authorId_fkey` FOREIGN KEY (`authorId`) REFERENCES `User`(`id`) ON DELETE CASCADE ON UPDATE CASCADE;
