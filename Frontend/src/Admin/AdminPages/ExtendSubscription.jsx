
import { useEffect, useState } from "react";
import securedApi from "../../securedApi.js";
import "../css/ExtendSubscription.css";

export default function ExtendSubscription() {
    const [plans, setPlans] = useState([]);
    const [selectedPlan, setSelectedPlan] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState("");

    useEffect(() => {
        const fetchPlans = async () => {
            try {
                const response = await securedApi.get("/admin/plans");
                setPlans(response.data);
            } catch (error) {
                console.error("Error fetching plans:", error);
                setError("Unable to load subscription plans. Please try again.");
            } finally {
                setLoading(false);
            }
        };

        fetchPlans();
    }, []);

    const formatPrice = (price) => {
        const amount = Number(price);

        if (!Number.isFinite(amount)) {
            return price;
        }

        return `Rs. ${amount.toLocaleString("en-IN")}`;
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
                        <p>Please check back later for available plans.</p>
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
                                {plans.length === 1 ? "plan" : "plans"} available
                            </span>
                        </div>

                        <div className="plans-grid">
                            {plans.map((plan, index) => {
                                const isSelected = selectedPlan?.id === plan.id;
                                const isFeatured = plans.length > 1 &&
                                    index === Math.floor(plans.length / 2);

                                return (
                                    <article
                                        key={plan.id}
                                        className={[
                                            "plan-card",
                                            isFeatured ? "plan-featured" : "",
                                            isSelected ? "plan-selected" : "",
                                        ].filter(Boolean).join(" ")}
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
                                            onClick={() => setSelectedPlan(plan)}
                                            aria-pressed={isSelected}
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
                            <div className="plan-selection-summary" role="status">
                                <div className="selection-info">
                                    <div className="selection-check">✓</div>

                                    <div>
                                        <p className="selection-label">
                                            YOUR SELECTED PLAN
                                        </p>
                                        <h3>{selectedPlan.name}</h3>
                                        <p className="selection-price">
                                            {formatPrice(selectedPlan.price)}
                                        </p>
                                    </div>
                                </div>

                                <button
                                    type="button"
                                    className="change-plan-button"
                                    onClick={() => setSelectedPlan(null)}
                                >
                                    Clear selection
                                </button>
                            </div>
                        )}
                    </>
                )}

                <footer className="plans-footer">
                    <span>Choose with confidence.</span>
                    <p>
                        Select the subscription plan that best suits your needs.
                    </p>
                </footer>
            </div>
        </div>
    );
}

