-- CreateTable
CREATE TABLE "car-history" (
    "id" SERIAL NOT NULL,
    "carId" INTEGER NOT NULL,
    "buyed_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "sold_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "owerId" INTEGER,

    CONSTRAINT "car-history_pkey" PRIMARY KEY ("id")
);

-- AddForeignKey
ALTER TABLE "car-history" ADD CONSTRAINT "car-history_owerId_fkey" FOREIGN KEY ("owerId") REFERENCES "users"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "car-history" ADD CONSTRAINT "car-history_carId_fkey" FOREIGN KEY ("carId") REFERENCES "car"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
