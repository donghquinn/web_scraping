import { PrismaClient } from '@prisma/client';
import { Logger } from 'utils/logger.util';

export class PrismaLibrary extends PrismaClient {
  // private prisma: PrismaClient;

  // constructor() {
  //   this.prisma = new PrismaClient();
  // }

  async onModuleInit() {
    await this.$connect();
  }

  gracefuleStopping() {
    this.$on('beforeExit', () => {
      this.stopping().catch((error) => {
        Logger.error('Prisma Error: %o', { error: error instanceof Error ? error : new Error(JSON.stringify(error)) });
      });
    });
  }

  async stopping() {
    await this.$disconnect();
  }
}
