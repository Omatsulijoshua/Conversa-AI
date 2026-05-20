import { Module } from '@nestjs/common';
import { TrainingController } from './training.controller';
import { KnowledgeModule } from '../knowledge/knowledge.module';

@Module({
  imports: [KnowledgeModule],
  controllers: [TrainingController],
})
export class TrainingModule {}
