-- CreateTable
CREATE TABLE "Hackers" (
    "uuid" TEXT NOT NULL,
    "rank" TEXT NOT NULL,
    "post" TEXT NOT NULL,
    "link" TEXT NOT NULL,
    "founded" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "Hackers_pkey" PRIMARY KEY ("uuid")
);

-- CreateTable
CREATE TABLE "BbcTechNews" (
    "uuid" TEXT NOT NULL,
    "rank" TEXT NOT NULL,
    "post" TEXT NOT NULL,
    "link" TEXT NOT NULL,
    "founded" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "BbcTechNews_pkey" PRIMARY KEY ("uuid")
);
