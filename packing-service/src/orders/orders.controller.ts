import { Controller, Post, Body, Get, Res } from '@nestjs/common';
import { ProcessOrdersDto } from './orders.dto'
import { OrderResponseDto } from './orders-response.dto';
import { PackingService } from './orders.service'
import type { Response } from 'express';
import { ApiBody, ApiTags, ApiExcludeEndpoint } from '@nestjs/swagger';

@ApiTags('Orders')
@Controller('orders')

export class OrdersController {
    constructor(private readonly packingService: PackingService) {}

    @Post()
    @ApiBody({ type: [ProcessOrdersDto] })
    process_order(@Body() body: ProcessOrdersDto): OrderResponseDto[] {
        const resultado = this.packingService.processingOrders(body.pedidos);
        return resultado;
    }

    
    @Get()
    @ApiExcludeEndpoint()
    redirectSwagger(@Res() res: Response) {
        return res.redirect('/api');
    }
}
