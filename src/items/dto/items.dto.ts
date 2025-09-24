import { IsArray, ValidateNested } from 'class-validator';
import { Type } from 'class-transformer';

export class BatchMetaDto {
  ticket: string;
  seq: number;
  total?: number;
}

export class ImportItemsDto {
  @ValidateNested()
  @Type(() => BatchMetaDto)
  meta: BatchMetaDto;

  @IsArray()
  records: any[];

  done?: boolean;
}