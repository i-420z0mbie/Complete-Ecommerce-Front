
import axios from 'axios';

const API_URL = process.env.REACT_APP_API_URL;

// Creates a payment record in the backend
export const createPayment = async (paymentData) => {
    try {
        // Adjust the URL if necessary based on your routing (e.g., '/api/payments/')
        const response = await axios.post(`${API_URL}/api/payments/`, paymentData, {
            withCredentials: true, // if you are using cookies for auth
        });
        return response.data; // Expecting { payment_reference, amount, email, ... }
    } catch (error) {
        console.error("Error creating payment record:", error.response || error);
        throw error;
    }
};

// Verifies the payment using the transaction reference from Paystack
export const verifyPayment = async (reference) => {
    try {
        const response = await axios.post(
            `${API_URL}/verify_paystack_payment/`,
            { reference },
            { withCredentials: true }
        );
        return response.data; // Expecting a success message or error details
    } catch (error) {
        console.error("Error verifying payment:", error.response || error);
        throw error;
    }
};
