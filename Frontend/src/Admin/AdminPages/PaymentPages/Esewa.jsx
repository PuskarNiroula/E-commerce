
import { useEffect, useRef, useState } from "react";
import api from "../../../api.js";

export default function Esewa() {
    const formRef = useRef(null);
    const [payment, setPayment] = useState(null);
    const [countdown, setCountdown] = useState(3);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState("");
    const [redirecting, setRedirecting] = useState(false);

    useEffect(() => {
        let mounted = true;

        async function initializePayment() {
            try {
                const response = await api.post("/payments/esewa/initiate");

                if (!mounted) return;

                const data = response.data;

                if (!data.form_url || !data.fields) {
                    throw new Error("Invalid payment information received.");
                }

                setPayment(data);
                setLoading(false);
            } catch (err) {
                if (!mounted) return;

                setError(
                    err.response?.data?.message ||
                    err.message ||
                    "Unable to initialize eSewa payment."
                );
                setLoading(false);
            }
        }

        initializePayment();

        return () => {
            mounted = false;
        };
    }, []);

    useEffect(() => {
        if (!payment || loading || error || redirecting) return;

        if (countdown <= 0) {
            submitPayment();
            return;
        }

        const timer = setTimeout(() => {
            setCountdown((previous) => previous - 1);
        }, 1000);

        return () => clearTimeout(timer);
    }, [payment, countdown, loading, error, redirecting]);

    function submitPayment() {
        if (!formRef.current || redirecting) return;

        setRedirecting(true);
        formRef.current.submit();
    }

    if (loading) {
        return (
            <main className="esewa-page">
                <div className="esewa-card">
                    <h2>Preparing your payment</h2>
                    <p>Please wait while we connect to eSewa...</p>
                </div>
            </main>
        );
    }

    if (error) {
        return (
            <main className="esewa-page">
                <div className="esewa-card">
                    <h2>Payment initialization failed</h2>
                    <p className="esewa-error">{error}</p>
                    <button onClick={() => window.location.reload()}>
                        Try Again
                    </button>
                </div>
            </main>
        );
    }

    return (
        <main className="esewa-page">
            <div className="esewa-card">
                <div className="esewa-logo">eSewa</div>

                <h2>Complete your payment</h2>
                <p>You will be redirected to eSewa securely.</p>

                <div className="payment-details">
                    <div>
                        <span>Amount</span>
                        <strong>
                            NPR {Number(payment.fields.total_amount).toFixed(2)}
                        </strong>
                    </div>

                    <div>
                        <span>Transaction ID</span>
                        <strong className="transaction-id">
                            {payment.fields.transaction_uuid}
                        </strong>
                    </div>
                </div>

                {!redirecting && (
                    <>
                        <div className="countdown">
                            <div className="spinner" />
                            <p>
                                Redirecting to eSewa in{" "}
                                <strong>{countdown}</strong> seconds...
                            </p>
                        </div>

                        <button
                            className="pay-button"
                            onClick={submitPayment}
                        >
                            Pay with eSewa
                        </button>

                        <p className="secure-note">
                            Do not refresh or close this page during payment.
                        </p>
                    </>
                )}

                {redirecting && (
                    <p>Redirecting to eSewa. Please wait...</p>
                )}

                <form
                    ref={formRef}
                    action={payment.form_url}
                    method="POST"
                    style={{ display: "none" }}
                >
                    {Object.entries(payment.fields).map(([key, value]) => (
                        <input
                            key={key}
                            type="hidden"
                            name={key}
                            value={value ?? ""}
                        />
                    ))}
                </form>
            </div>
        </main>
    );
}
