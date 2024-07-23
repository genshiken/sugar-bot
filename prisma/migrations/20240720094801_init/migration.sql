-- CreateTable
CREATE TABLE "danbooruusers" (
    "id" TEXT NOT NULL,
    "discord_uid" TEXT NOT NULL,
    "api_key" TEXT NOT NULL,
    "username" TEXT NOT NULL,

    CONSTRAINT "danbooruusers_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "feedrecord" (
    "id" TEXT NOT NULL,
    "amount" INTEGER NOT NULL,
    "date" DATE NOT NULL,
    "uid" TEXT NOT NULL,

    CONSTRAINT "feedrecord_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "users" (
    "id" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "uid" TEXT NOT NULL,
    "powerup" TEXT[],
    "active_powerup" TEXT,

    CONSTRAINT "users_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "userstate" (
    "id" TEXT NOT NULL,
    "actionPoint" INTEGER NOT NULL,
    "uid" TEXT NOT NULL,
    "physical" INTEGER NOT NULL,
    "affection" INTEGER NOT NULL,
    "fatigue" INTEGER NOT NULL,
    "boredom" INTEGER NOT NULL,

    CONSTRAINT "userstate_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Playlist" (
    "id" TEXT NOT NULL,
    "userId" TEXT NOT NULL,
    "guildId" TEXT NOT NULL,
    "tracks" JSONB NOT NULL,
    "dateCreated" TIMESTAMP(3) NOT NULL,
    "name" TEXT NOT NULL,
    "private" BOOLEAN,

    CONSTRAINT "Playlist_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "Playlist_userId_name_key" ON "Playlist"("userId", "name");
