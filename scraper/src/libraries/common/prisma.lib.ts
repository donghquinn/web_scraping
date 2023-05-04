import { PrismaClient } from "@prisma/client";

export class PrismaLibrary extends PrismaClient  {
    private static instance: PrismaClient;

    public static getInstance() {
        if (!this.instance) {
            this.instance = new PrismaClient();
        }
    
        return this.instance;
        }


    async onModuleInit() {
      await this.$connect();
    }
  
    stopping() {
      this.$on('beforeExit', async () => {
        await this.prisma.close();
      });
    }
  }
  