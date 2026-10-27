import api from "./axios";

// Get all plans
export const getPlans = () => {
  return api.get("/plans/");
};

// Get a single plan
export const getPlan = (planId) => {
  return api.get(`/plans/${planId}`);
};