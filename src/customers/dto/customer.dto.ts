import { IsArray, IsOptional, ValidateNested } from 'class-validator';
import { Type } from 'class-transformer';

export class BatchMetaDto {
  ticket: string;
  seq: number;
  total?: number;
}

export class ImportCustomersDto {
  @ValidateNested()
  @Type(() => BatchMetaDto)
  meta: BatchMetaDto;

  @IsArray()
  records: any[];

  @IsOptional()
  done?: boolean;
}