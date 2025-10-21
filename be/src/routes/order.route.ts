import express from 'express';
import { TAllPeopleHardcode } from '../models/order';
import { order_service } from '../services/order.service';

const route = express.Router();

const list_share: string[] = [];

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

route.delete('/orders', async (req, res, next) => {
  try {
    const order_id = req.body.order_id as string;

    if (list_share.includes(order_id)) {
      const index = list_share.indexOf(order_id);
      list_share.splice(index, 1);
    }

    await order_service.deleteOrder(order_id);

    res.json({ message: 'Delete order success' });
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

route.patch('/orders/status', async (req, res, next) => {
  try {
    const { order_id, status } = req.body;

    await order_service.updateStatusOrder(order_id, status);
    res.json({ message: 'PATCH order status', order_id, status });
  } catch (error) {
    next(error);
  }
});

route.patch('/orders/pay', async (req, res, next) => {
  try {
    const { order_id, amount } = req.body;

    if (list_share.includes(order_id)) {
      const index = list_share.indexOf(order_id);
      list_share.splice(index, 1);
    }

    await order_service.payOrder(order_id, amount);
    res.json({ message: 'PATCH order pay', order_id, amount });
  } catch (error) {
    next(error);
  }
});

route.patch('/orders/pay-depend', async (req, res, next) => {
  try {
    const { order_ids, name_dep } = req.body;

    await order_service.payDepend(order_ids, name_dep);
    res.json({ message: 'PATCH order pay-depend' });
  } catch (error) {
    next(error);
  }
});

route.post('/orders/share-link', async (req, res, next) => {
  try {
    const { order_id } = req.body;

    if (!list_share.includes(order_id)) {
      list_share.push(order_id);
    }

    return res.json({ share_success: true });
  } catch (error) {
    next(error);
  }
});

route.get('/orders/shared/:orderId', async (req, res, next) => {
  try {
    const { orderId } = req.params;
    if (!list_share.includes(orderId)) {
      return res.status(403).json({ message: 'Link chia sẻ không hợp lệ hoặc đã bị thu hồi.' });
    }
    const order = await order_service.getOrderById(orderId);
    return res.json(order);
  } catch (error) {
    next(error);
  }
});

route.put('/orders/shared/:orderId', async (req, res, next) => {
  try {
    const { orderId } = req.params;
    const { name_dep, auto_share, specific_price } = req.body;

    if (!list_share.includes(orderId)) {
      return res.status(403).json({ message: 'Link chia sẻ không hợp lệ hoặc đã bị thu hồi.' });
    }
    const updated_order = await order_service.updateOrderShared(
      orderId,
      name_dep,
      auto_share,
      specific_price,
    );
    return res.json({ message: 'Cập nhật đơn hàng thành công.', order: updated_order });
  } catch (error) {
    next(error);
  }
});

export const order_router = route;
