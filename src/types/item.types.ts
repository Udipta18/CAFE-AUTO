export interface Item {
  id: string;
  name: string;
  price: string;
  active: boolean;
  createdAt: Date;
}

export interface CreateItemInput {
  name: string;
  price: string;
}

export interface UpdateItemInput {
  id: string;
  name: string;
  price: string;
  active: boolean;
}
