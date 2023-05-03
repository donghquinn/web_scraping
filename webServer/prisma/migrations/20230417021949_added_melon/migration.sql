-- CreateTable
CREATE TABLE "Hackers" (
    "uuid" TEXT NOT NULL,
    "rank" TEXT NOT NULL,
    "post" TEXT NOT NULL,
    "link" TEXT NOT NULL,
    "founded" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "Hackers_pkey" PRIMARY KEY ("uuid")
);

-- CreateTable
CREATE TABLE "BbcTechNews" (
    "uuid" TEXT NOT NULL,
    "rank" TEXT NOT NULL,
    "post" TEXT NOT NULL,
    "link" TEXT NOT NULL,
    "founded" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "BbcTechNews_pkey" PRIMARY KEY ("uuid")
);

-- CreateTable
CREATE TABLE "NaverNews" (
    "uuid" TEXT NOT NULL,
    "keyWord" TEXT NOT NULL,
    "title" TEXT NOT NULL,
    "description" TEXT NOT NULL,
    "originallink" TEXT NOT NULL,
    "url" TEXT NOT NULL,
    "postedTime" TEXT NOT NULL,
    "founded" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "NaverNews_pkey" PRIMARY KEY ("uuid")
);

-- CreateTable
CREATE TABLE "Melon" (
    "uuid" TEXT NOT NULL,
    "rank" SERIAL NOT NULL,
    "title" TEXT NOT NULL,
    "artist" TEXT NOT NULL,
    "founded" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "Melon_pkey" PRIMARY KEY ("uuid")
);

-- CreateTable
CREATE TABLE "Climate" (
    "uuid" TEXT NOT NULL,
    "dataTime" TEXT NOT NULL,
    "pm25Value" TEXT,
    "pm10Value" TEXT,
    "no2Value" TEXT,
    "o3Value" TEXT,
    "coValue" TEXT,
    "so2Value" TEXT,
    "khaiValue" TEXT,
    "o3Grade" TEXT,
    "so2Grade" TEXT,
    "no2Grade" TEXT,
    "coGrade" TEXT,
    "khaiGrade" TEXT,
    "khaiStatus" TEXT NOT NULL DEFAULT 'normal',
    "created" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "Climate_pkey" PRIMARY KEY ("uuid")
);
