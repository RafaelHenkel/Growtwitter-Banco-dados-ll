/*
  Warnings:

  - A unique constraint covering the columns `[reference_id]` on the table `replies` will be added. If there are existing duplicate values, this will fail.
  - Added the required column `reference_id` to the `replies` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "replies" ADD COLUMN     "reference_id" UUID NOT NULL;

-- CreateIndex
CREATE UNIQUE INDEX "replies_reference_id_key" ON "replies"("reference_id");

-- RenameForeignKey
ALTER TABLE "replies" RENAME CONSTRAINT "replies_tweets_id_fkey" TO "tweets_id";

-- AddForeignKey
ALTER TABLE "replies" ADD CONSTRAINT "replies_reference_id_fkey" FOREIGN KEY ("reference_id") REFERENCES "tweets"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
