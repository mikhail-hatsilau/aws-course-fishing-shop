import { DataSource } from 'typeorm';
import { Cart } from './entities/cart.entity';
import { CartItem } from './entities/cartItem.entity';
import path from 'path';
import { ConfigService } from '@nestjs/config';
import { config } from 'dotenv';

config();

const configService = new ConfigService();

export default new DataSource({
  type: 'postgres',
  host: configService.get<string>('DB_HOST'),
  port: Number(configService.get<string>('DB_PORT')),
  username: configService.get<string>('DB_USER'),
  password: configService.get<string>('DB_SECRET'),
  database: configService.get<string>('DB_NAME'),
  entities: [Cart, CartItem],
  migrations: [path.resolve(__dirname, './migrations/*.js')],
});
