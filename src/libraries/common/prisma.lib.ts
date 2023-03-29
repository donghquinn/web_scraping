import { INestApplication, Injectable, OnModuleInit } from '@nestjs/common';
import { PrismaClient } from '@prisma/client';

@Injectable()
export class PrismaLibrary extends PrismaClient implements OnModuleInit {
  async onModuleInit() {
    await this.$connect();
  }

  stopping(connection: INestApplication) {
    this.$on('beforeExit', async () => {
      await connection.close();
    });
  }
}
