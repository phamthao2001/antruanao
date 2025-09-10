import mongoose from 'mongoose';

const all_people_hardcode = ['thaopv1', 'vunx', 'bacnt'];

const name_object_type = {
  type: String,
  required: true,
  enum: all_people_hardcode,
};

const list_dep_auto_share = new mongoose.Schema({
  name_dep: name_object_type,
  quantity_dep: { type: Number, required: true, default: 1 },
  state_dep: { type: String, required: true, enum: ['no_paid', 'paid'], default: 'no_paid' },
});

const list_dep_specific_price = new mongoose.Schema({
  name_dep: name_object_type,
  price_dep: { type: Number, required: true },
  state_dep: { type: String, required: true, enum: ['no_paid', 'paid'], default: 'no_paid' },
});

const order_schema = new mongoose.Schema({
  owner: name_object_type,
  list_dep_auto_share: { type: [list_dep_auto_share], required: true, default: [] },
  list_dep_specific_price: { type: [list_dep_specific_price], required: true, default: [] },
  description: { type: String, required: false },
  total_paid: { type: Number, required: true },
  date_order: { type: String, required: true },
});

const order_model = mongoose.model('Order', order_schema);

export default order_model;
