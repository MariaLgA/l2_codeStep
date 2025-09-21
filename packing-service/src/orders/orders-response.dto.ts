import { ApiProperty } from '@nestjs/swagger';

export class BoxModelDto {
  @ApiProperty({ nullable: true })
  caixa_id: string | null;

  @ApiProperty({ type: [String] })
  produtos: string[];
}

export class OrderResponseDto {
  @ApiProperty()
  pedido_id: number;

  @ApiProperty({ type: [BoxModelDto] })
  caixas: BoxModelDto[];
}
