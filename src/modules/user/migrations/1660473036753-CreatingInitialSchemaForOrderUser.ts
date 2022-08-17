import { MigrationInterface, QueryRunner } from 'typeorm';

export class CreatingInitialSchemaForOrderUser1660473036753
  implements MigrationInterface
{
  public async up(queryRunner: QueryRunner): Promise<void> {
    //user:
    await queryRunner.query(
      `CREATE TABLE "user" (
                "created_at" timestamptz NOT NULL DEFAULT now(),
                "updated_at" timestamptz NOT NULL DEFAULT now(),
                "deleted_at" timestamptz NULL,
                "id" SERIAL NOT NULL,
                "name" varchar NOT NULL,
                "cash_balance" double precision NOT NULL,
                CONSTRAINT "PK_8bc0dbbae8fe2f06c5f471ca977d1e25" PRIMARY KEY ("id")
            );`,
      undefined,
    );

    //order:
    await queryRunner.query(
      `CREATE TABLE "order" (
                "created_at" timestamptz NOT NULL DEFAULT now(),
                "updated_at" timestamptz NOT NULL DEFAULT now(),
                "deleted_at" timestamptz NULL,
                "id" SERIAL NOT NULL,
                "user_id" integer NOT NULL,
                "dish_name" varchar NOT NULL,
                "restaurant_id" integer NOT NULL,
                "placed_on" timestamptz NOT NULL,
                "amount" double precision NOT NULL CHECK (amount > '0'),
                CONSTRAINT "PK_9b295529612587db2eab3e5d255c452c" PRIMARY KEY ("id")
            );`,
      undefined,
    );

    await queryRunner.query(
      `ALTER TABLE "order" ADD CONSTRAINT "FK_690917153926774f01eb6c17e01eb13e" FOREIGN KEY ("user_id") REFERENCES "user"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`,
      undefined,
    );

    await queryRunner.query(
      `ALTER TABLE "order" ADD CONSTRAINT "FK_f150afc4a159f61388f49b9af3815372" FOREIGN KEY ("restaurant_id") REFERENCES "restaurant"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`,
      undefined,
    );

    await queryRunner.query(
      `CREATE INDEX IF NOT EXISTS "IDX_345704a937c541543ef603e4bf0b8baf" ON "order" USING btree ("user_id");`,
      undefined,
    );

    await queryRunner.query(
      `CREATE INDEX IF NOT EXISTS "IDX_7887436e83504b65d14d0ca0a7b8353a" ON "order" USING btree ("restaurant_id");`,
      undefined,
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    //order:
    await queryRunner.query(
      `ALTER TABLE "order" DROP CONSTRAINT "FK_690917153926774f01eb6c17e01eb13e"`,
      undefined,
    );

    await queryRunner.query(
      `ALTER TABLE "order" DROP CONSTRAINT "FK_f150afc4a159f61388f49b9af3815372"`,
      undefined,
    );

    await queryRunner.query(
      `DROP INDEX "IDX_345704a937c541543ef603e4bf0b8baf";`,
      undefined,
    );

    await queryRunner.query(
      `DROP INDEX "IDX_7887436e83504b65d14d0ca0a7b8353a";`,
      undefined,
    );

    await queryRunner.query(`DROP TABLE "order";`, undefined);

    //user:
    await queryRunner.query(`DROP TABLE "user";`, undefined);
  }
}
