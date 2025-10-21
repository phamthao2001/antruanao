import mongoose from 'mongoose';

// #region type order
export const all_people_hardcode = [
  'vunx',
  'bacnt',
  'thaopv1',
  'hiepbh',
  'thanhnx',
  'longnt',
  'nghiapd',
  'huydt',
  'hieunm2',
  'hungdv',
  'chungld',
  'huydvq',
  'namtv',
] as const;
export type TAllPeopleHardcode = (typeof all_people_hardcode)[number];

export type TAutoShare = {
  name_dep: TAllPeopleHardcode;
  description_dep?: string;
  quantity_dep: number;
  state_dep: 'no_paid' | 'paid';
};
export type TSpecificPrice = {
  name_dep: TAllPeopleHardcode;
  description_dep?: string;
  price_dep: number;
  state_dep: 'no_paid' | 'paid';
};

export type TOrder = {
  owner: TAllPeopleHardcode;
  list_dep_auto_share: TAutoShare[];
  list_dep_specific_price: TSpecificPrice[];
  description?: string;
  total_paid: number;
  date_order: string;
  status: 'created' | 'ordered' | 'paid';
};

export type TOrderDocument = TOrder & mongoose.Document;

// export type TOrderUpdate = {
//   list_update: {
//     order
//   }[]
// }
// #endregion

const name_object_type = {
  type: String,
  required: true,
  enum: all_people_hardcode,
};

const list_dep_auto_share = new mongoose.Schema({
  name_dep: name_object_type,
  description_dep: { type: String, required: false, default: 'gì cũng được' },
  quantity_dep: { type: Number, required: true, default: 1 },
  state_dep: { type: String, required: true, enum: ['no_paid', 'paid'], default: 'no_paid' },
});

const list_dep_specific_price = new mongoose.Schema({
  name_dep: name_object_type,
  description_dep: { type: String, required: false, default: 'gì cũng được' },
  price_dep: { type: Number, required: true },
  state_dep: { type: String, required: true, enum: ['no_paid', 'paid'], default: 'no_paid' },
});

const order_schema = new mongoose.Schema<TOrderDocument>({
  owner: name_object_type,
  list_dep_auto_share: { type: [list_dep_auto_share], required: true, default: [] },
  list_dep_specific_price: { type: [list_dep_specific_price], required: true, default: [] },
  description: { type: String, required: false },
  total_paid: { type: Number, required: true },
  date_order: { type: String, required: true },
  status: {
    type: String,
    required: true,
    enum: ['created', 'ordered', 'paid'],
    default: 'created',
  },
});

const order_model = mongoose.model('Order', order_schema);

export default order_model;
