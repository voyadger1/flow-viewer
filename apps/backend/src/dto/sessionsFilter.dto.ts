import { Type } from 'class-transformer';
import { IsOptional, IsString } from 'class-validator';

export class SessionsFilterDto {
  @IsOptional()
  @Type(() => String)
  @IsString()
  workFlow: string = '';

  @IsOptional()
  @Type(() => String)
  @IsString()
  runBy: string = '';
}
