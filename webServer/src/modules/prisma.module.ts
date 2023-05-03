import { Global, Module } from '@nestjs/common';
import { PrismaLibrary } from 'libraries/common/prisma.lib';

@Global()
@Module({
  providers: [PrismaLibrary],
  // 재사용 가능하도록 해당 모듈 노출
  exports: [PrismaLibrary],
})
export class PrismaModule {}
