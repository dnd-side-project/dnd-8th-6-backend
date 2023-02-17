import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { WidgetRepository } from './repository/widget.repository';

@Module({
  imports: [TypeOrmModule.forFeature([WidgetRepository])],
  providers: [],
})
export class WidgetModule {}
