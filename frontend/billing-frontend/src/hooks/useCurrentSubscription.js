import { useContext, useEffect, useState } from "react";
import { AuthContext } from "../context/AuthContext";
import { getCustomerSubscriptions } from "../api/subscription";
import { getPlans } from "../api/plans";

export function useCurrentSubscription() {
  const { user } = useContext(AuthContext);
  const [subscription, setSubscription] = useState(null);
  const [plan, setPlan] = useState(null);
  const [loading, setLoading] = useState(Boolean(user?.customer_id));

  useEffect(() => {
    if (!user?.customer_id) {
      setLoading(false);
      return;
    }
    Promise.all([getCustomerSubscriptions(user.customer_id), getPlans()])
      .then(([subscriptionsResponse, plansResponse]) => {
        const current = subscriptionsResponse.data
          .filter((item) => item.status !== "cancelled")
          .sort((a, b) => b.id - a.id)[0];
        setSubscription(current ?? null);
        setPlan(plansResponse.data.find((item) => item.id === current?.plan_id) ?? null);
      })
      .catch(() => {
        setSubscription(null);
        setPlan(null);
      })
      .finally(() => setLoading(false));
  }, [user?.customer_id]);

  return { user, subscription, plan, loading };
}
