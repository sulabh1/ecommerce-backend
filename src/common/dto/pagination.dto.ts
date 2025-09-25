import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { Type } from 'class-transformer';
import { IsOptional, IsPositive, Min } from 'class-validator';

export class PaginationDto {
  @ApiPropertyOptional({
    description: 'Page number(starting from 1)',
    example: 1,
    default: 1,
  })
  @IsOptional()
  @Type(() => Number)
  @IsPositive()
  @Min(1)
  page?: number = 1;

  @ApiPropertyOptional({
    description: 'Number of item per page',
    example: 10,
    default: 10,
  })
  @IsOptional()
  @Type(() => Number)
  @IsPositive()
  @Min(1)
  limit?: number = 10;

  get skip(): number {
    const page = this.page ?? 1;
    const limit = this.limit ?? 10;
    return (page - 1) * limit;
  }
}

export class PaginatedResponseDto<T> {
  @ApiProperty({
    description: 'Array of item',
    type: [Object],
  })
  data: T[];

  @ApiProperty({
    description: 'Current page number',
    example: 1,
  })
  page: number;

  @ApiProperty({
    description: 'Number of items per page',
    example: 10,
  })
  limit: number;

  @ApiProperty({
    description: 'Total number of items',
    example: 100,
  })
  total: number;

  @ApiProperty({
    description: 'Total number of pages',
    example: 10,
  })
  totalPages: number;

  @ApiProperty({
    description: 'Has next page?',
    example: true,
  })
  hasNext: boolean;

  @ApiProperty({
    description: 'Has previous page?',
    example: false,
  })
  hasPrevious: boolean;

  constructor(data: T[], total: number, paginationDto: PaginationDto) {
    this.data = data;
    this.page = paginationDto.page ?? 1;
    this.limit = paginationDto.limit ?? 10;
    this.total = total;
    this.totalPages = Math.ceil(total / (paginationDto.limit ?? 10));
    this.hasNext = this.page < this.totalPages;
    this.hasPrevious = this.page > 1;
  }
}
