-- AlterTable
ALTER TABLE "dine_locations" ADD COLUMN     "height" INTEGER,
ADD COLUMN     "positionX" INTEGER,
ADD COLUMN     "positionY" INTEGER,
ADD COLUMN     "width" INTEGER;

-- AlterTable
ALTER TABLE "dine_tables" ADD COLUMN     "positionX" INTEGER,
ADD COLUMN     "positionY" INTEGER;
