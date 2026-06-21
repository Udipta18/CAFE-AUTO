export interface Customer {
  id: string;
  name: string;
  phone: string;
  createdAt: Date;
}

export interface CreateCustomerInput {
  name: string;
  phone: string;
}

export interface UpdateCustomerInput {
  id: string;
  name: string;
  phone: string;
}
