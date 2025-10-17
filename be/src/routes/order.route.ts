import express from 'express';
import { TAllPeopleHardcode } from '../models/order';
import { order_service } from '../services/order.service';

const route = express.Router();

route.get('/dashboard', async (req, res, next) => {
  try {
    const params = req.query;

    const owner = params.owner as TAllPeopleHardcode | undefined;
    const list_depend = (<string>(params.list_depend ?? '')).split(',').filter((i) => i);
    const from = params.from as string | undefined;
    const to = params.to as string | undefined;

    const data = await order_service.dashboard({
      owner,
      list_depend,
      from,
      to,
    });

    res.json(data);
  } catch (error) {
    next(error);
  }
});

route.get('/orders', async (req, res, next) => {
  try {
    const params = req.query;

    const owner = params.owner as TAllPeopleHardcode | undefined;
    const list_depend = (<string>(params.list_depend ?? '')).split(',').filter((i) => i);
    const from = params.from as string | undefined;
    const to = params.to as string | undefined;

    const orders = await order_service.getAllOrders({
      owner,
      list_depend,
      from,
      to,
    });

    res.json(orders);
  } catch (error) {
    next(error);
  }
});

route.post('/orders', async (req, res, next) => {
  try {
    const data = req.body;
    const new_order = await order_service.createOrder(data);
    res.status(201).json({ message: 'Create order success', order: new_order });
  } catch (error) {
    next(error);
  }
});

route.put('/orders', async (req, res, next) => {
  try {
    res.json({ message: 'PUT order' });
  } catch (error) {
    next(error);
  }
});

export const order_router = route;
