import { ApiProperty } from '@nestjs/swagger';


export class DimensionsDto {
  @ApiProperty()
  altura: number;
  @ApiProperty()
  largura: number;
  @ApiProperty()
  comprimento: number
}

export class ProductDto {
  @ApiProperty()
  produto_id: string;
  @ApiProperty({ type: DimensionsDto })
  dimensoes: DimensionsDto;
}

export class OrderDto {
  @ApiProperty()
  pedido_id: number;
  @ApiProperty({ type: [ProductDto] })
  produtos: ProductDto[]
}

export class ProcessOrdersDto {
  @ApiProperty({ type: [OrderDto] })
  pedidos: OrderDto[];
}