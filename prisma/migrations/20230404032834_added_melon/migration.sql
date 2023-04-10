-- CreateTable
CREATE TABLE "NaverNews" (
    "uuid" TEXT NOT NULL,
    "keyWord" TEXT NOT NULL,
    "title" TEXT NOT NULL,
    "description" TEXT NOT NULL,
    "originallink" TEXT NOT NULL,
    "url" TEXT NOT NULL,
    "postedTime" TEXT NOT NULL,
    "founded" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "NaverNews_pkey" PRIMARY KEY ("uuid")
);

-- CreateTable
CREATE TABLE "Metro" (
    "id" TEXT NOT NULL,
    "station" TEXT NOT NULL,
    "year" TEXT NOT NULL,
    "date" TEXT NOT NULL,
    "isOn" TEXT NOT NULL,
    "morning" TEXT NOT NULL,
    "noon" TEXT NOT NULL,
    "afterNoon" TEXT NOT NULL,
    "evening" TEXT NOT NULL,

    CONSTRAINT "Metro_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Melon" (
    "uuid" TEXT NOT NULL,
    "rank" SERIAL NOT NULL,
    "title" TEXT NOT NULL,
    "artist" TEXT NOT NULL,
    "founded" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "Melon_pkey" PRIMARY KEY ("uuid")
);

-- CreateTable
CREATE TABLE "Climate" (
    "uuid" TEXT NOT NULL,
    "dataTime" TEXT NOT NULL,
    "pm25Value" TEXT,
    "pm10Value" TEXT NOT NULL,
    "no2Value" TEXT NOT NULL,
    "o3Value" TEXT NOT NULL,
    "coValue" TEXT NOT NULL,
    "so2Value" TEXT NOT NULL,
    "khaiValue" TEXT NOT NULL,
    "o3Grade" TEXT NOT NULL,
    "so2Grade" TEXT NOT NULL,
    "no2Grade" TEXT NOT NULL,
    "coGrade" TEXT NOT NULL,
    "khaiGrade" TEXT NOT NULL,
    "khaiStatus" TEXT NOT NULL DEFAULT 'normal',
    "created" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "Climate_pkey" PRIMARY KEY ("uuid")
);
