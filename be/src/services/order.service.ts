import order_model, { TOrder, TOrderDocument } from '../models/order';

const getAllOrders = async (params: {
  owner?: string;
  list_depend?: string[];
  from?: string;
  to?: string;
}) => {
  const query = order_model.find();

  if (params.from && params.to) {
    query.where('date_order', { $gte: params.from, $lte: params.to });
  }

  if (params.owner) {
    query.where('owner').equals(params.owner);
  }

  if (params.list_depend && params.list_depend.length > 0) {
    query.or([
      {
        list_dep_auto_share: {
          $elemMatch: { name_dep: { $in: params.list_depend } },
        },
      },
      {
        list_dep_specific_price: {
          $elemMatch: { name_dep: { $in: params.list_depend } },
        },
      },
    ]);
  }

  const res = await query.exec();

  if (res) return res;

  return [];
};

const createOrder = async (data: TOrder): Promise<TOrderDocument> => {
  const new_order = new order_model(data);
  const res = await new_order.save();

  return res;
};

const dashboard = async (params: {
  owner?: string;
  list_depend?: string[];
  from?: string;
  to?: string;
}) => {
  const query = order_model.find();

  if (params.from && params.to) {
    query.where('date_order', { $gte: params.from, $lte: params.to });
  }

  const or_condition = [];

  if (params.owner) {
    or_condition.push({ owner: params.owner });
  }

  if (params.list_depend && params.list_depend.length > 0) {
    or_condition.push(
      {
        list_dep_auto_share: {
          $elemMatch: { name_dep: { $in: params.list_depend } },
        },
      },
      {
        list_dep_specific_price: {
          $elemMatch: { name_dep: { $in: params.list_depend } },
        },
      },
    );
  }

  if (or_condition.length > 0) {
    query.or(or_condition);
  }

  const res = await query.exec();

  if (res) return res;

  return [];
};

const deleteOrder = async (order_id: string): Promise<void> => {
  await order_model.findByIdAndDelete(order_id).exec();
};

const updateStatusOrder = async (
  order_id: string,
  status: 'created' | 'ordered' | 'paid',
): Promise<void> => {
  await order_model.findByIdAndUpdate(order_id, { status }).exec();
};

const payOrder = async (order_id: string, amount: number): Promise<void> => {
  const model = await order_model.findById(order_id).exec();
  if (!model) throw new Error('Order not found');

  model.list_dep_auto_share.forEach((dep) => {
    if (dep.name_dep === model.owner) dep.state_dep = 'paid';
  });
  model.list_dep_specific_price.forEach((dep) => {
    if (dep.name_dep === model.owner) dep.state_dep = 'paid';
  });

  model.status = 'paid';
  model.total_paid = amount;
  await model.save();
};

const payDepend = async (order_ids: string[], name_dep: string): Promise<void> => {
  for (const order_id of order_ids) {
    const model = await order_model.findById(order_id).exec();
    if (!model) throw new Error('Order not found');
    model.list_dep_auto_share.forEach((dep) => {
      if (dep.name_dep === name_dep) dep.state_dep = 'paid';
    });
    model.list_dep_specific_price.forEach((dep) => {
      if (dep.name_dep === name_dep) dep.state_dep = 'paid';
    });
    await model.save();
  }
};

const getOrderById = async (order_id: string): Promise<TOrderDocument | null> => {
  const model = await order_model.findById(order_id).exec();
  return model;
};

export const order_service = {
  getAllOrders,
  createOrder,
  dashboard,
  deleteOrder,
  updateStatusOrder,
  payOrder,
  payDepend,
  getOrderById,
};
