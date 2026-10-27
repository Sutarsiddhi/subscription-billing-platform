import api from "./axios";

export const createSubscription = (data) => api.post("/subscriptions/", data);
export const changePlan = (subscriptionId, planId) => api.post(`/billing/subscriptions/${subscriptionId}/change-plan`, { plan_id: planId });
export const getInvoices = (customerId) => api.get("/billing/invoices", { params: customerId ? { customer_id: customerId } : {} });
export const getPayments = (customerId) => api.get("/billing/payments", { params: customerId ? { customer_id: customerId } : {} });
export const getBillingMetrics = () => api.get("/billing/dashboard");
