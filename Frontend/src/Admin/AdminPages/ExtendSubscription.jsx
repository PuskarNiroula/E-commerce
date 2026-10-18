import { useCallback, useEffect, useRef, useState } from "react";
import api from "../../api.js";

const PAYMENT_METHODS = [
    {
        id: "stripe",
        name: "Stripe",
        description: "Pay securely by card",
        logo: "stripe",
        logoClass: "stripe-logo"
    },
    {
        id: "esewa",
        name: "eSewa",
        description: "Pay with your eSewa wallet",
        logo: "eSewa",
        logoClass: "esewa-logo"
    },
    {
        id: "khalti",
        name: "Khalti",
        description: "Pay with your Khalti wallet",
        logo: "K",
        logoClass: "khalti-logo"
    }
];

const formatPrice = (price) => {
    const amount = Number(price);

    if (!Number.isFinite(amount)) {
        return price;
    }

    return `Rs. ${amount.toLocaleString("en-IN")}`;
};

export default function ExtendSubscription() {
    const [plans, setPlans] = useState([]);
    const [selectedPlan, setSelectedPlan] = useState(null);
    const [paymentMethod, setPaymentMethod] = useState("");
    const [loading, setLoading] = useState(true);
    const [submitting, setSubmitting] = useState(false);
    const [error, setError] = useState("");
    const [paymentError, setPaymentError] = useState("");
    const [paymentMessage, setPaymentMessage] = useState("");
    const [paymentModalOpen, setPaymentModalOpen] = useState(false);


    const idempotencyKeyRef = useRef(null);

    if (idempotencyKeyRef.current === null) {
        const uuid = typeof crypto.randomUUID === 'function'
            ? crypto.randomUUID()
            : ([1e7]+-1e3+-4e3+-8e3+-1e11).replace(/[018]/g, c =>
                (c ^ crypto.getRandomValues(new Uint8Array(1))[0] & 15 >> c / 4).toString(16)
            );

        idempotencyKeyRef.current = `payment_${uuid}`;
    }

    const fetchPlans = useCallback(async () => {
        setLoading(true);
        setError("");

        try {
            const response = await api.get("/admin/plans");
            const list = response.data?.subscriptionPlan;

            setPlans(Array.isArray(list) ? list : []);
        } catch (err) {
            console.error("Error fetching plans:", err);
            setError("Unable to load subscription plans. Please try again.");
        } finally {
            setLoading(false);
        }
    }, []);

    useEffect(() => {
        fetchPlans();
    }, [fetchPlans]);

    const closePaymentModal = useCallback(() => {
        if (submitting) return;

        setPaymentModalOpen(false);
        setSelectedPlan(null);
        setPaymentMethod("");
        setPaymentError("");
        setPaymentMessage("");
    }, [submitting]);

    useEffect(() => {
        if (!paymentModalOpen) return undefined;

        const handleKeyDown = (event) => {
            if (event.key === "Escape") {
                closePaymentModal();
            }
        };

        const previousOverflow = document.body.style.overflow;
        document.body.style.overflow = "hidden";
        document.addEventListener("keydown", handleKeyDown);

        return () => {
            document.body.style.overflow = previousOverflow;
            document.removeEventListener("keydown", handleKeyDown);
        };
    }, [paymentModalOpen, closePaymentModal]);

    const openPaymentModal = (plan) => {
        setSelectedPlan(plan);
        setPaymentMethod("");
        setPaymentError("");
        setPaymentMessage("");
        setPaymentModalOpen(true);
    };

    const selectPaymentMethod = (methodId) => {
        if (submitting) return;

        setPaymentMethod(methodId);
        setPaymentError("");
        setPaymentMessage("");
    };

    const confirmPayment = async () => {
        if (!selectedPlan || !paymentMethod || submitting) {
            return;
        }

        setSubmitting(true);
        setPaymentError("");
        setPaymentMessage("");

        try {
            const idempotencyKey = idempotencyKeyRef.current;

            const response = await api.post(
                "/admin/payment",
                {
                    idempotency_key: idempotencyKey,
                    payment_method: paymentMethod,
                    plan_id: selectedPlan.id
                },
                {
                    headers: {
                        "Idempotency-Key": idempotencyKey
                    }
                }
            );

            const paymentUrl = response.data?.payment_url;

            if (paymentUrl) {
                window.location.assign(paymentUrl);
                return;
            }

            setPaymentMessage(
                response.data?.message ||
                "Your payment request has been created successfully."
            );
        } catch (err) {
            console.error("Error creating payment:", err);

            setPaymentError(
                err.response?.data?.message ||
                "Unable to initiate payment. Please try again."
            );
        } finally {
            setSubmitting(false);
        }
    };

    return (
        <div className="plans-page">
            <div className="plans-container">
                <header className="plans-header">
                    <div className="plans-eyebrow">
                        <span className="plans-eyebrow-dot"></span>
                        SUBSCRIPTION PLANS
                    </div>

                    <h1>
                        Your business deserves
                        <span> more.</span>
                    </h1>

                    <p className="plans-subtitle">
                        Choose the plan that works for you and keep your
                        business moving forward.
                    </p>

                    <div className="plans-benefits">
                        <span>
                            <span className="benefit-check">✓</span>
                            Simple pricing
                        </span>
                        <span>
                            <span className="benefit-check">✓</span>
                            Flexible plans
                        </span>
                        <span>
                            <span className="benefit-check">✓</span>
                            Secure payments
                        </span>
                    </div>
                </header>

                {loading ? (
                    <div className="plans-status" role="status" aria-live="polite">
                        <span className="plans-spinner"></span>
                        <p>Loading subscription plans...</p>
                    </div>
                ) : error ? (
                    <div className="plans-status plans-error" role="alert">
                        <p>{error}</p>
                        <button
                            type="button"
                            className="plans-retry"
                            onClick={fetchPlans}
                        >
                            Try again
                        </button>
                    </div>
                ) : plans.length === 0 ? (
                    <div className="plans-status">
                        <h3>No plans available yet</h3>
                        <p>Please check back later for available plans.</p>
                    </div>
                ) : (
                    <>
                        <div className="plans-section-heading">
                            <div>
                                <h2>Choose a plan</h2>
                                <p>Select a plan to extend your subscription.</p>
                            </div>

                            <span className="plans-count">
                                {plans.length}{" "}
                                {plans.length === 1 ? "plan" : "plans"} available
                            </span>
                        </div>

                        <div className="plans-grid">
                            {plans.map((plan) => {
                                const isSelected =
                                    paymentModalOpen &&
                                    selectedPlan?.id === plan.id;

                                return (
                                    <article
                                        key={plan.id}
                                        className={
                                            isSelected
                                                ? "plan-card plan-selected"
                                                : "plan-card"
                                        }
                                    >
                                        <div className="plan-card-content">
                                            <div className="plan-icon">
                                                <svg
                                                    viewBox="0 0 24 24"
                                                    fill="none"
                                                    stroke="currentColor"
                                                    strokeWidth="1.7"
                                                    strokeLinecap="round"
                                                    strokeLinejoin="round"
                                                    aria-hidden="true"
                                                >
                                                    <path d="M12 3l2.6 5.3 5.9.9-4.25 4.15 1 5.85L12 16.4l-5.25 2.8 1-5.85L3.5 9.2l5.9-.9L12 3z" />
                                                </svg>
                                            </div>

                                            <h3 className="plan-name">
                                                {plan.name}
                                            </h3>

                                            <p className="plan-description">
                                                Extend your subscription and
                                                keep your account active.
                                            </p>

                                            <div className="plan-price">
                                                <span className="plan-price-amount">
                                                    {formatPrice(plan.price)}
                                                </span>
                                            </div>

                                            <div className="plan-divider"></div>

                                            <div className="plan-detail">
                                                <span className="plan-detail-icon">
                                                    ✓
                                                </span>
                                                <span>
                                                    Subscription extension
                                                </span>
                                            </div>

                                            <div className="plan-detail">
                                                <span className="plan-detail-icon">
                                                    ✓
                                                </span>
                                                <span>
                                                    Pay with Stripe, eSewa or Khalti
                                                </span>
                                            </div>
                                        </div>

                                        <button
                                            type="button"
                                            className="plan-select-button"
                                            onClick={() => openPaymentModal(plan)}
                                        >
                                            Select this plan
                                            <span>→</span>
                                        </button>
                                    </article>
                                );
                            })}
                        </div>
                    </>
                )}

                <footer className="plans-footer">
                    <span>Choose with confidence.</span>
                    <p>
                        Select the subscription plan that best suits your needs.
                    </p>
                </footer>
            </div>

            {paymentModalOpen && selectedPlan && (
                <div
                    className="payment-modal-overlay"
                    onMouseDown={(event) => {
                        if (event.target === event.currentTarget) {
                            closePaymentModal();
                        }
                    }}
                >
                    <div
                        className="payment-modal"
                        role="dialog"
                        aria-modal="true"
                        aria-labelledby="payment-modal-title"
                    >
                        <button
                            type="button"
                            className="payment-modal-close"
                            onClick={closePaymentModal}
                            disabled={submitting}
                            aria-label="Close payment dialog"
                        >
                            ×
                        </button>

                        <div className="payment-modal-icon">
                            <svg
                                viewBox="0 0 24 24"
                                fill="none"
                                stroke="currentColor"
                                strokeWidth="1.7"
                                strokeLinecap="round"
                                strokeLinejoin="round"
                                aria-hidden="true"
                            >
                                <rect x="3" y="5" width="18" height="14" rx="3" />
                                <path d="M3 10h18M7 15h3" />
                            </svg>
                        </div>

                        <p className="payment-modal-eyebrow">
                            SECURE CHECKOUT
                        </p>

                        <h2 id="payment-modal-title">
                            Choose your payment method
                        </h2>

                        <p className="payment-modal-subtitle">
                            Select how you would like to pay for your plan.
                        </p>

                        <div className="payment-order-summary">
                            <div>
                                <span>Selected plan</span>
                                <strong>{selectedPlan.name}</strong>
                            </div>
                            <div>
                                <span>Total amount</span>
                                <strong>{formatPrice(selectedPlan.price)}</strong>
                            </div>
                        </div>

                        <div
                            className="payment-method-list"
                            role="group"
                            aria-label="Payment methods"
                        >
                            {PAYMENT_METHODS.map((method) => {
                                const active = paymentMethod === method.id;

                                return (
                                    <button
                                        key={method.id}
                                        type="button"
                                        className={`payment-method-option ${active ? "payment-method-active" : ""}`}
                                        onClick={() => selectPaymentMethod(method.id)}
                                        disabled={submitting}
                                        aria-pressed={active}
                                    >
                                        <span className={`payment-provider-logo ${method.logoClass}`}>
                                            {method.logo}
                                        </span>
                                        <span className="payment-method-description">
                                            <strong>{method.name}</strong>
                                            <small>{method.description}</small>
                                        </span>
                                        <span className="payment-radio">
                                            {active && "✓"}
                                        </span>
                                    </button>
                                );
                            })}
                        </div>

                        {paymentError && (
                            <p className="payment-feedback payment-feedback-error" role="alert">
                                {paymentError}
                            </p>
                        )}

                        {paymentMessage && (
                            <div className="payment-feedback payment-feedback-success" role="status">
                                {paymentMessage}
                            </div>
                        )}

                        <button
                            type="button"
                            className="payment-confirm-button"
                            onClick={confirmPayment}
                            disabled={!paymentMethod || submitting || Boolean(paymentMessage)}
                        >
                            {submitting
                                ? "Processing request..."
                                : paymentMessage
                                    ? "Request created"
                                    : "Confirm & Continue"}
                            {!submitting && !paymentMessage && <span>→</span>}
                        </button>

                        <p className="payment-secure-note">
                            Your payment will be processed by the selected provider.
                        </p>
                    </div>
                </div>
            )}
        </div>
    );
}