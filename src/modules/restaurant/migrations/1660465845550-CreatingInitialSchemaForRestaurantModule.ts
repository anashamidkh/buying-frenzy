import { MigrationInterface, QueryRunner } from "typeorm";

export class CreatingInitialSchemaForRestaurantModule1660465845550 implements MigrationInterface {

    public async up(queryRunner: QueryRunner): Promise<void> {
        //restaurant:
        await queryRunner.query(
            `CREATE TABLE "restaurant" (
                      "created_at" timestamptz NOT NULL DEFAULT now(),
                      "updated_at" timestamptz NOT NULL DEFAULT now(),
                      "deleted_at" timestamptz NULL,
                      "id" SERIAL NOT NULL,
                      "name" varchar NOT NULL,
                      "cash_balance" double precision NOT NULL,
                      "ts_name" tsvector GENERATED ALWAYS AS (to_tsvector('english', name)) STORED,
                      CONSTRAINT "PK_bf41722f777a31acd84e8024d72e5494" PRIMARY KEY ("id")
                  );`,
            undefined
        );
        await queryRunner.query(`CREATE INDEX IF NOT EXISTS "IDX_914699ad39f752670495e629d5464eef" ON restaurant USING GIN ("ts_name");`, undefined);

        //operational_schedule:
        await queryRunner.query(
            `CREATE TABLE "operational_schedule" (
                "created_at" timestamptz NOT NULL DEFAULT now(),
                "updated_at" timestamptz NOT NULL DEFAULT now(),
                "deleted_at" timestamptz NULL,
                "id" SERIAL NOT NULL,
                "restaurant_id" integer NOT NULL,
                "day" varchar NOT NULL,
                "open_at" TIME NOT NULL,
                "close_at" TIME NOT NULL,
                CONSTRAINT "PK_c68618565345c0bd3fe21a2f606305be" PRIMARY KEY ("id")
            );`,
            undefined
        );

        await queryRunner.query(`ALTER TABLE "operational_schedule" ADD CONSTRAINT "FK_9802e27813b54b13622226b6141c7232" FOREIGN KEY ("restaurant_id") REFERENCES "restaurant"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`, undefined);
        await queryRunner.query(`CREATE INDEX IF NOT EXISTS "IDX_6c4b9f2ef5448d9ab52786f4b04b9941" ON operational_schedule USING btree ("restaurant_id");`, undefined);

        //menu:
        await queryRunner.query(
            `CREATE TABLE "menu" (
                      "created_at" timestamptz NOT NULL DEFAULT now(),
                      "updated_at" timestamptz NOT NULL DEFAULT now(),
                      "deleted_at" timestamptz NULL,
                      "id" SERIAL NOT NULL,
                      "dish_name" varchar NOT NULL,
                      "price" double precision NOT NULL CHECK (price > '0'),
                      "restaurant_id" integer NOT NULL,
                      CONSTRAINT "PK_f2dda682188f6d5c74f2d135b945679e" PRIMARY KEY ("id")
                  );`,
            undefined
        );

        await queryRunner.query(`ALTER TABLE "menu" ADD CONSTRAINT "FK_326b60e3d5b5aeeb850ce165ba3a9f13" FOREIGN KEY ("restaurant_id") REFERENCES "restaurant"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`, undefined);
        await queryRunner.query(`CREATE INDEX IF NOT EXISTS "IDX_9a876cf237541309cc90fc33929650c3" ON menu USING btree ("restaurant_id");`, undefined);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        //operational_schedule:
        await queryRunner.query(`ALTER TABLE "operational_schedule" DROP CONSTRAINT "FK_9802e27813b54b13622226b6141c7232"`, undefined);
        await queryRunner.query(`DROP INDEX "IDX_6c4b9f2ef5448d9ab52786f4b04b9941";`, undefined);
        await queryRunner.query(`DROP TABLE "operational_schedule";`, undefined);

        //menu:
        await queryRunner.query(`ALTER TABLE "menu" DROP CONSTRAINT "FK_326b60e3d5b5aeeb850ce165ba3a9f13"`, undefined);
        await queryRunner.query(`DROP INDEX "IDX_9a876cf237541309cc90fc33929650c3";`, undefined);
        await queryRunner.query(`DROP TABLE "menu";`, undefined);

        //restaurant:
        await queryRunner.query(`DROP INDEX "IDX_914699ad39f752670495e629d5464eef";`, undefined);
        await queryRunner.query(`DROP TABLE "restaurant";`, undefined);
    }

}
