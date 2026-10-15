
import { useEffect, useRef, useState } from "react";
import securedApi from "../../securedApi.js";
import "../css/ExtendSubscription.css";

const PAYMENT_METHODS = [
    {
        id: "esewa",
        name: "eSewa",
        description: "Pay securely with eSewa",
    },
    {
        id: "khalti",
        name: "Khalti",
        description: "Pay securely with Khalti",
    },
    {
        id: "stripe",
        name: "Stripe",
        description: "Pay securely with a card",
    },
];

const PAYMENT_ORIGINS = {
    esewa: [
        "https://esewa.com.np",
        "https://rc-epay.esewa.com.np",
        "https://epay.esewa.com.np",
    ],
    khalti: [
        "https://khalti.com",
        "https://pay.khalti.com",
    ],
    stripe: [
        "https://checkout.stripe.com",
    ],
};

export default function ExtendSubscription() {
    const [plans, setPlans] = useState([]);
    const [selectedPlan, setSelectedPlan] = useState(null);
    const [selectedMethod, setSelectedMethod] = useState("");
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState("");
    const [paymentError, setPaymentError] = useState("");
    const [paymentLoading, setPaymentLoading] = useState(false);

    const attemptRef = useRef(null);
    const inFlightRef = useRef(false);

    useEffect(() => {
        let active = true;

        const fetchPlans = async () => {
            try {
                const response = await securedApi.get("/admin/plans");
                const availablePlans = response.data?.subscriptionPlan;

                if (active) {
                    setPlans(
                        Array.isArray(availablePlans)
                            ? availablePlans
                            : []
                    );
                }
            } catch {
                if (active) {
                    setError(
                        "Unable to load subscription plans. Please try again."
                    );
                }
            } finally {
                if (active) {
                    setLoading(false);
                }
            }
        };

        fetchPlans();

        return () => {
            active = false;
        };
    }, []);

    const formatPrice = (price) => {
        const amount = Number(price);

        if (!Number.isFinite(amount)) {
            return price;
        }

        return `Rs. ${amount.toLocaleString("en-IN")}`;
    };

    const handlePlanSelect = (plan) => {
        if (inFlightRef.current) {
            return;
        }

        if (selectedPlan?.id !== plan.id) {
            attemptRef.current = null;
            setSelectedMethod("");
            setPaymentError("");
        }

        setSelectedPlan(plan);
    };

    const handleMethodSelect = (method) => {
        if (inFlightRef.current) {
            return;
        }

        if (selectedMethod !== method) {
            setPaymentError("");
        }

        setSelectedMethod(method);
    };

    const getIdempotencyKey = (fingerprint) => {
        if (attemptRef.current?.fingerprint === fingerprint) {
            return attemptRef.current.key;
        }

        if (!globalThis.crypto?.randomUUID) {
            throw new Error(
                "Secure payment initialization is unavailable. Please use a supported browser."
            );
        }

        const key = globalThis.crypto.randomUUID();

        attemptRef.current = {
            fingerprint,
            key,
        };

        return key;
    };

    const handlePayment = async () => {
        if (
            !selectedPlan ||
            !selectedMethod ||
            inFlightRef.current
        ) {
            return;
        }

        if (
            !PAYMENT_METHODS.some(
                (method) => method.id === selectedMethod
            )
        ) {
            setPaymentError("Please select a valid payment method.");
            return;
        }

        const planId = Number(selectedPlan.id);

        if (
            !Number.isSafeInteger(planId) ||
            planId <= 0
        ) {
            setPaymentError(
                "Invalid subscription plan. Please select another plan."
            );
            return;
        }

        const fingerprint = `${planId}:${selectedMethod}`;

        let idempotencyKey;

        try {
            idempotencyKey = getIdempotencyKey(fingerprint);
        } catch (error) {
            setPaymentError(error.message);
            return;
        }

        inFlightRef.current = true;
        setPaymentLoading(true);
        setPaymentError("");

        try {
            const response = await securedApi.post(
                "/payments",
                {
                    plan_id: planId,
                    payment_method: selectedMethod,
                },
                {
                    headers: {
                        "Idempotency-Key": idempotencyKey,
                    },
                }
            );

            const checkoutUrl = response.data?.checkout_url;

            let parsedUrl;

            try {
                if (typeof checkoutUrl !== "string") {
                    throw new Error("Missing checkout URL");
                }

                parsedUrl = new URL(checkoutUrl);
            } catch {
                setPaymentError(
                    "The payment service returned an invalid checkout URL. Check your payment status before retrying."
                );
                return;
            }

            const isLocalDevelopment =
                import.meta.env.DEV &&
                parsedUrl.protocol === "http:" &&
                ["localhost", "127.0.0.1","192.168.18.6:5173",'192.168.18.139:5173'].includes(
                    parsedUrl.hostname
                );

            const isTrustedProvider =
                parsedUrl.protocol === "https:" &&
                PAYMENT_ORIGINS[selectedMethod]?.includes(
                    parsedUrl.origin
                );

            if (!isLocalDevelopment && !isTrustedProvider) {
                setPaymentError(
                    "The payment service returned an untrusted checkout destination. Please contact support."
                );
                return;
            }

            window.location.assign(parsedUrl.href);
        } catch (error) {
            setPaymentError(
                error.response?.data?.message ||
                "We couldn't confirm the payment request. Retry with the same plan and payment method to reuse this payment attempt."
            );
        } finally {
            inFlightRef.current = false;
            setPaymentLoading(false);
        }
    };

    const handleChangePlan = () => {
        if (inFlightRef.current) {
            return;
        }

        setSelectedPlan(null);
        setSelectedMethod("");
        setPaymentError("");
        attemptRef.current = null;
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
                        business moving forward. Find the right option
                        for your next stage of growth.
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
                            Easy to choose
                        </span>
                    </div>
                </header>

                {loading ? (
                    <div className="plans-status">
                        <span className="plans-spinner"></span>
                        <p>Finding the right plan for you...</p>
                    </div>
                ) : error ? (
                    <div className="plans-status plans-error">
                        <p>{error}</p>
                        <button
                            type="button"
                            className="plans-retry"
                            onClick={() => window.location.reload()}
                        >
                            Try again
                        </button>
                    </div>
                ) : plans.length === 0 ? (
                    <div className="plans-status">
                        <h3>No plans available yet</h3>
                        <p>
                            Please check back later for available plans.
                        </p>
                    </div>
                ) : (
                    <>
                        <div className="plans-section-heading">
                            <div>
                                <h2>Find your perfect plan</h2>
                                <p>
                                    Select a plan to extend your subscription.
                                </p>
                            </div>

                            <span className="plans-count">
                                {plans.length}{" "}
                                {plans.length === 1 ? "plan" : "plans"}{" "}
                                available
                            </span>
                        </div>

                        <div className="plans-grid">
                            {plans.map((plan, index) => {
                                const isSelected =
                                    selectedPlan?.id === plan.id;

                                const isFeatured =
                                    plans.length > 1 &&
                                    index === Math.floor(plans.length / 2);

                                return (
                                    <article
                                        key={plan.id}
                                        className={[
                                            "plan-card",
                                            isFeatured ? "plan-featured" : "",
                                            isSelected ? "plan-selected" : "",
                                        ]
                                            .filter(Boolean)
                                            .join(" ")}
                                    >
                                        {isFeatured && (
                                            <div className="plan-ribbon">
                                                EXPLORE THIS PLAN
                                            </div>
                                        )}

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
                                                A subscription option to help
                                                you keep moving forward.
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
                                                    Subscription extension option
                                                </span>
                                            </div>

                                            <div className="plan-detail">
                                                <span className="plan-detail-icon">
                                                    ✓
                                                </span>
                                                <span>
                                                    Plan ID: {plan.id}
                                                </span>
                                            </div>
                                        </div>

                                        <button
                                            type="button"
                                            className="plan-select-button"
                                            onClick={() =>
                                                handlePlanSelect(plan)
                                            }
                                            aria-pressed={isSelected}
                                            disabled={paymentLoading}
                                        >
                                            {isSelected ? (
                                                <>
                                                    <span>✓</span>
                                                    Selected
                                                </>
                                            ) : (
                                                <>
                                                    Select this plan
                                                    <span>→</span>
                                                </>
                                            )}
                                        </button>
                                    </article>
                                );
                            })}
                        </div>

                        {selectedPlan && (
                            <section
                                className="payment-section"
                                aria-labelledby="payment-heading"
                            >
                                <div className="payment-heading">
                                    <div>
                                        <span className="payment-eyebrow">
                                            YOUR SELECTED PLAN
                                        </span>

                                        <h2 id="payment-heading">
                                            Choose a payment method
                                        </h2>

                                        <p>
                                            {selectedPlan.name} ·{" "}
                                            {formatPrice(selectedPlan.price)}
                                        </p>
                                    </div>

                                    <button
                                        type="button"
                                        className="change-plan-button"
                                        onClick={handleChangePlan}
                                        disabled={paymentLoading}
                                    >
                                        Change plan
                                    </button>
                                </div>

                                <div className="payment-methods">
                                    {PAYMENT_METHODS.map((method) => {
                                        const isMethodSelected =
                                            selectedMethod === method.id;

                                        return (
                                            <button
                                                key={method.id}
                                                type="button"
                                                className={[
                                                    "payment-method",
                                                    isMethodSelected
                                                        ? "payment-method-selected"
                                                        : "",
                                                ]
                                                    .filter(Boolean)
                                                    .join(" ")}
                                                onClick={() =>
                                                    handleMethodSelect(
                                                        method.id
                                                    )
                                                }
                                                aria-pressed={isMethodSelected}
                                                disabled={paymentLoading}
                                            >
                                                <span
                                                    className={`payment-logo payment-logo-${method.id}`}
                                                >
                                                    {method.name}
                                                </span>

                                                <span className="payment-method-description">
                                                    {method.description}
                                                </span>

                                                <span className="payment-method-radio">
                                                    {isMethodSelected ? "✓" : ""}
                                                </span>
                                            </button>
                                        );
                                    })}
                                </div>

                                {paymentError && (
                                    <div
                                        className="payment-error"
                                        role="alert"
                                    >
                                        {paymentError}
                                    </div>
                                )}

                                <button
                                    type="button"
                                    className="payment-submit"
                                    onClick={handlePayment}
                                    disabled={
                                        !selectedMethod || paymentLoading
                                    }
                                >
                                    {paymentLoading ? (
                                        <>
                                            <span className="payment-button-spinner"></span>
                                            Processing request...
                                        </>
                                    ) : (
                                        <>
                                            Continue to payment
                                            <span>→</span>
                                        </>
                                    )}
                                </button>

                                <p className="payment-security-note">
                                    <span>🔒</span>
                                    Your payment will be processed through
                                    the selected payment provider.
                                </p>
                            </section>
                        )}
                    </>
                )}

                <footer className="plans-footer">
                    <span>Choose with confidence.</span>
                    <p>
                        Select the subscription plan that best suits your
                        needs.
                    </p>
                </footer>
            </div>
        </div>
    );
}
