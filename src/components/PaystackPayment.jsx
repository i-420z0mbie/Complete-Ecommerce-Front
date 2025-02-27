// src/components/PaystackPayment.jsx
import React, { useEffect, useState } from "react";
import { PaystackButton } from "react-paystack";
import api from "../api";

export default function PaystackPayment({ email, amount, orderId, onSuccess }) {
    const publicKey = import.meta.env.VITE_PAYSTACK_PUBLIC_KEY;
    const [paymentReference, setPaymentReference] = useState(null);
    const [loading, setLoading] = useState(true);

    // Create a Payment record on your backend when the component mounts
    useEffect(() => {
        const createPaymentRecord = async () => {
            try {
                const { data } = await api.post("/store/payments/", {
                    order: orderId,
                    amount: amount,
                });
                // Assume your response includes { payment_reference: "..." }
                setPaymentReference(data.payment_reference);
            } catch (error) {
                console.error("Error creating payment record:", error);
            } finally {
                setLoading(false);
            }
        };
        createPaymentRecord();
    }, [orderId, amount]);

    // Called when Paystack reports a successful payment
    const handleSuccess = async (response) => {
        console.log("Payment successful on Paystack:", response);
        try {
            // Call your backend verification endpoint using the returned reference
            const { data: verifyResponse } = await api.post("/api/paystack/verify/", {
                reference: response.reference,
            });
            console.log("Backend verification response:", verifyResponse);
            // Alert the user or update UI based on verifyResponse
            alert("Payment verified successfully!");
            if (onSuccess) onSuccess(response);
        } catch (error) {
            console.error("Payment verification error:", error);
            alert(
                "Payment was successful on Paystack, but verification failed in our system. Please contact support."
            );
        }
    };

    // Called when the user closes the payment window before completing payment
    const handleClose = () => {
        console.log("Payment window closed");
    };

    if (loading) {
        return <div>Loading payment details...</div>;
    }

    if (!paymentReference) {
        return <div>Error creating payment record. Please try again.</div>;
    }

    const componentProps = {
        email: email, // Must be a valid email string
        amount: amount * 100, // Convert amount to the smallest unit (e.g., for GHS, amount in pesewas)
        currency: "GHS",
        reference: paymentReference, // Use the backend-generated payment reference
        publicKey: publicKey,
        onSuccess: handleSuccess,
        onClose: handleClose,
        text: "Pay Now",
    };

    return (
        <PaystackButton
            {...componentProps}
            className="btn btn-primary px-4 py-2 rounded-pill shadow"
        />
    );
}
