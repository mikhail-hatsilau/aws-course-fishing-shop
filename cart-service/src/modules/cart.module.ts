import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Cart } from '../entities/cart.entity';
import { CartItem } from '../entities/cartItem.entity';
import { DefaultCartService } from '../services/cart.service';

@Module({
  providers: [DefaultCartService],
  imports: [TypeOrmModule.forFeature([Cart, CartItem])],
})
export class CartModule {}
