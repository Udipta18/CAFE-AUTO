import { CustomerRepository } from "@/repositories/customer.repository";
import { customerSchema } from "@/utils/validators";
import type { CreateCustomerInput, UpdateCustomerInput } from "@/types";

export const CustomerService = {
  async getAll() {
    return CustomerRepository.findAll();
  },

  async getById(id: string) {
    const customer = await CustomerRepository.findById(id);
    if (!customer) {
      throw new Error("Customer not found");
    }
    return customer;
  },

  async create(input: CreateCustomerInput) {
    const validated = customerSchema.parse(input);
    return CustomerRepository.create(validated);
  },

  async update(input: UpdateCustomerInput) {
    const validated = customerSchema.parse({
      name: input.name,
      phone: input.phone,
    });
    return CustomerRepository.update({ id: input.id, ...validated });
  },

  async remove(id: string) {
    await CustomerRepository.remove(id);
  },

  async search(query: string) {
    if (!query.trim()) {
      return CustomerRepository.findAll();
    }
    return CustomerRepository.search(query);
  },
};
