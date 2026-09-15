    -- CreateTable
    CREATE TABLE "spots" (
        "id" SERIAL NOT NULL,
        "user_id" INTEGER NOT NULL,
        "name" VARCHAR(150) NOT NULL,
        "description" TEXT,
        "latitude" DECIMAL(10,8) NOT NULL,
        "longitude" DECIMAL(11,8) NOT NULL,
        "category" VARCHAR(50) NOT NULL,
        "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
        "updated_at" TIMESTAMP(3) NOT NULL,

        CONSTRAINT "spots_pkey" PRIMARY KEY ("id")
    );

    -- AddForeignKey
    ALTER TABLE "spots" ADD CONSTRAINT "spots_user_id_fkey" FOREIGN KEY ("user_id") REFERENCES "users"("id") ON DELETE CASCADE ON UPDATE CASCADE;
