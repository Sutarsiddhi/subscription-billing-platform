import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import {
  FaCheck,
  FaBoxOpen,
  FaArrowRight,
  FaSpinner,
  FaCalendarAlt,
  FaGift,
} from "react-icons/fa";
import CustomerLayout from "../../components/CustomerLayout";
import PageHeader from "../../components/PageHeader";
import { getPlans } from "../../api/plans";
import { changePlan, createSubscription } from "../../api/billing";
import { useCurrentSubscription } from "../../hooks/useCurrentSubscription";

const planFeatures = {
  Basic: ["Up to 3 team members", "Automated monthly billing", "Branded invoices"],
  Standard: ["Up to 15 team members", "Smart payment retries", "Priority email support"],
  Premium: ["Unlimited team members", "Advanced revenue reporting", "Priority support"],
};

function Plans() {
  const [plans, setPlans] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [selectingId, setSelectingId] = useState(null);
  const { user, subscription, plan: currentPlan } = useCurrentSubscription();
  const navigate = useNavigate();

  useEffect(() => {
    fetchPlans();
  }, []);

  const fetchPlans = async () => {
    try {
      setLoading(true);
      setError("");
      const response = await getPlans();
      setPlans(response.data);
    } catch (err) {
      setError(
        err.response?.data?.detail || "Unable to load plans. Please try again."
      );
    } finally {
      setLoading(false);
    }
  };

  const activePlans = plans.filter((plan) => plan.is_active);

  const selectPlan = async (plan) => {
    if (!user?.customer_id) {
      setError("This account is not linked to a billing customer. Please sign out and register again.");
      return;
    }
    try {
      setSelectingId(plan.id);
      if (subscription) {
        await changePlan(subscription.id, plan.id);
        navigate("/customer/mysubscription", { state: { message: `${plan.name} is now your selected plan.` } });
      } else {
        const response = await createSubscription({ customer_id: user.customer_id, plan_id: plan.id });
        const isTrial = response.data.status === "trial";
        navigate("/customer/mysubscription", { state: { message: isTrial ? `${plan.name} trial started.` : `${plan.name} selected. Complete the invoice payment to activate it.`, subscription: response.data, plan } });
      }
    } catch (err) {
      setError(err.response?.data?.detail || "Unable to start this subscription.");
    } finally {
      setSelectingId(null);
    }
  };

  return (
    <CustomerLayout>
      <PageHeader
        eyebrow="Catalog"
        title="Choose a plan"
        description="Select the plan that fits your team. You can upgrade or change plans as your needs grow."
      />

      {loading && (
        <div className="flex flex-col items-center py-20 text-ink-soft">
          <FaSpinner className="animate-spin text-2xl text-brand" />
          <p className="mt-3 text-sm">Loading plans...</p>
        </div>
      )}

      {!loading && error && (
        <div className="rounded-2xl border border-brand/25 bg-gold-dim p-8 text-center">
          <h2 className="font-semibold text-red-600">Unable to load plans</h2>
          <p className="mt-2 text-sm text-ink-soft">{error}</p>
          <button
            onClick={fetchPlans}
            className="mt-4 rounded-xl bg-brand px-5 py-2.5 text-sm font-semibold text-void"
          >
            Try again
          </button>
        </div>
      )}

      {!loading && !error && activePlans.length === 0 && (
        <div className="rounded-2xl border border-brand/15 bg-surface p-10 text-center">
          <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-full bg-gold-dim text-brand">
            <FaBoxOpen className="text-xl" />
          </div>
          <h2 className="mt-4 text-lg font-semibold">No plans available</h2>
          <p className="mt-1 text-sm text-ink-soft">There are no active subscription plans yet.</p>
        </div>
      )}

      {!loading && !error && activePlans.length > 0 && (
        <div className="grid grid-cols-1 gap-5 md:grid-cols-2 lg:grid-cols-3">
          {activePlans.map((plan, index) => (
            <article
              key={plan.id}
              className={`relative overflow-hidden rounded-2xl border bg-surface p-6 ${
                index === 1 ? "border-brand ring-2 ring-brand/25" : "border-brand/15"
              }`}
            >
              {index === 1 && (
                <span className="absolute right-4 top-4 rounded-full bg-brand px-2 py-0.5 text-[11px] font-semibold text-void">
                  Popular
                </span>
              )}
              {currentPlan?.id === plan.id && (
                <span className="absolute left-4 top-4 rounded-full bg-gold-dim px-2 py-0.5 text-[11px] font-semibold text-brand">Current plan</span>
              )}
              <p className="text-xs font-semibold uppercase tracking-[0.14em] text-brand">{plan.platform}</p>
              <h2 className="text-xl font-semibold">{plan.name}</h2>
              <p className="mt-2 min-h-10 text-sm leading-5 text-ink-soft">{plan.description}</p>
              <p className="mt-4">
                <span className="text-4xl font-semibold tracking-tight">₹{plan.price}</span>
                <span className="ml-1 text-sm text-ink-soft">
                  / {String(plan.billing_interval).toLowerCase()}
                </span>
              </p>
              <div className="mt-5 space-y-3 text-sm">
                <p className="flex items-center gap-2 text-ink-soft">
                  <FaCalendarAlt className="text-brand" />
                  {String(plan.billing_interval)} billing
                </p>
                <p className="flex items-center gap-2 text-ink-soft">
                  <FaGift className="text-brand" />
                  {plan.trial_days > 0 ? `${plan.trial_days} day trial` : "No trial"}
                </p>
                <p className="flex items-center gap-2 text-ink-soft">
                  <FaBoxOpen className="text-brand" />
                  {plan.customer_limit ? `Up to ${plan.customer_limit} customers` : "Unlimited customers"}
                </p>
              </div>
              <ul className="mt-5 space-y-2 border-t border-brand/15 pt-5 text-sm text-ink-soft">
                {(planFeatures[plan.name] || ["Subscription access", "Automated billing", "Invoice generation"]).map((f) => (
                  <li key={f} className="flex items-center gap-2">
                    <FaCheck className="text-brand" /> {f}
                  </li>
                ))}
                <li className="flex items-center gap-2">
                  <FaCheck className="text-brand" /> {plan.invoice_limit ? `Up to ${plan.invoice_limit} invoices / month` : "Unlimited invoices"}
                </li>
              </ul>
              <button
                onClick={() => selectPlan(plan)}
                disabled={selectingId !== null || currentPlan?.id === plan.id}
                className={`mt-6 inline-flex w-full items-center justify-center gap-2 rounded-xl py-2.5 text-sm font-semibold ${
                  index === 1
                    ? "bg-brand text-void hover:bg-brand-dark"
                    : "bg-void text-brand hover:bg-gold-dim"
                }`}
              >
                {currentPlan?.id === plan.id ? "Current plan" : selectingId === plan.id ? "Updating plan..." : subscription ? "Switch to this plan" : "Choose plan"} <FaArrowRight className="text-xs" />
              </button>
            </article>
          ))}
        </div>
      )}
    </CustomerLayout>
  );
}

export default Plans;
