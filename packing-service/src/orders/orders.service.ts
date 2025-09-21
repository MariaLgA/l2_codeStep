import { Injectable } from '@nestjs/common';
import { OrderDto, ProductDto, DimensionsDto } from './orders.dto';
import { OrderResponseDto, BoxModelDto } from './orders-response.dto';


@Injectable()
export class PackingService {
  private boxes = 
  [
    { caixa: 'Caixa 1', dimensoes: { altura: 30, largura: 40, comprimento: 80 } },
    { caixa: 'Caixa 2', dimensoes: { altura: 50, largura: 50, comprimento: 40 } },
    { caixa: 'Caixa 3', dimensoes: { altura: 50, largura: 80, comprimento: 60 } },
  ];

  private generateRotations(d: DimensionsDto): DimensionsDto[] {
    const { altura: h, largura: w, comprimento: l } = d;
    return [
      { altura: h, largura: w, comprimento: l },
      { altura: h, largura: l, comprimento: w },
      { altura: w, largura: h, comprimento: l },
      { altura: w, largura: l, comprimento: h },
      { altura: l, largura: h, comprimento: w },
      { altura: l, largura: w, comprimento: h },
    ];
  }

  private fits(product: DimensionsDto, box: DimensionsDto, usedVolume: number): boolean {
    return product.altura <= box.altura &&
           product.largura <= box.largura &&
           product.comprimento <= box.comprimento &&
           usedVolume + this.calcVolume(product) <= this.calcVolume(box);
  }

  private calcVolume(d: DimensionsDto): number {
    return d.altura * d.largura * d.comprimento;
  }

  processingOrders(orders: OrderDto[]): OrderResponseDto[] {
  const responses: OrderResponseDto[] = [];

  for (const order of orders) 
  {
    const usedBoxes: { caixa_id: string | null, produtos: ProductDto[] }[] = [];

    const sortedProducts = order.produtos.slice().sort((a, b) => 
      this.calcVolume(b.dimensoes) - this.calcVolume(a.dimensoes)
    );

    for (const product of sortedProducts) 
    {
      const rotations = this.generateRotations(product.dimensoes);
      let fit = false;

      const sortedBoxes = this.boxes.slice().sort((a, b) =>
        this.calcVolume(a.dimensoes) - this.calcVolume(b.dimensoes)
      );

        for (const boxDef of sortedBoxes) 
        {
          for (const rot of rotations) 
          {
            let box = usedBoxes
              .filter(b => b.caixa_id === boxDef.caixa)
              .find(b => {
                  const usedVolume = b.produtos.reduce((sum, p) => sum + this.calcVolume(p.dimensoes), 0);
                  return this.fits(rot, boxDef.dimensoes, usedVolume);
              });

            if (!box && this.fits(rot, boxDef.dimensoes, 0)) 
            {
                box = { caixa_id: boxDef.caixa, produtos: [] };
                usedBoxes.push(box);
            }

            if (box)
            {
                box.produtos.push({ ...product, dimensoes: rot });
                fit = true;
                break;
            }
          }
          if (fit) break;
        }

        if (!fit) 
        {
          usedBoxes.push({
          caixa_id: null,
          produtos: [product]
          });
        }
    }

    const boxesResponse: BoxModelDto[] = usedBoxes.map(b => ({
      caixa_id: b.caixa_id,
      produtos: b.produtos.map(p => p.produto_id)
    }));

    responses.push({
      pedido_id: order.pedido_id,
      caixas: boxesResponse
    });
  }

    return responses;
  }
}
