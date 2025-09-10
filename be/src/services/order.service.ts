import order_model from '../models/order';

const getAllOrders = async () => {
  const query = order_model.find();
  const res = await query.exec();

  if (res) return res;

  return [];
};

export const order_service = { getAllOrders };
