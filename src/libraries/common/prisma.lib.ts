import { INestApplication, Injectable } from "@nestjs/common";
import { PrismaClient } from "@prisma/client";

@Injectable()
export class PrismaLibrary extends PrismaClient {
  async Init() {
    await this.$connect();
  }

  stopping(connection: INestApplication) {
    // eslint-disable-next-line @typescript-eslint/no-misused-promises
    this.$on("beforeExit", async () => {
      await connection.close();
    });
  }
}
