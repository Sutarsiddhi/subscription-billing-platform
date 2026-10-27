import api from "./axios";

export const getCustomerSubscriptions = (customerId) =>
  api.get(`/subscriptions/customer/${customerId}`);
