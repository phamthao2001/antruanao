import express from 'express';
import { order_service } from '../services/order.service';

const route = express.Router();

route.get('/orders', async (req, res, next) => {
  try {
    const orders = await order_service.getAllOrders();

    res.json(orders);
  } catch (error) {
    next(error);
  }
});

export const order_router = route;
