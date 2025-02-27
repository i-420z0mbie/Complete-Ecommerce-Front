// OrderPage.js
import React, { useState } from 'react';
import OrderList from './OrderList';
import PlaceOrderButton from './PlaceOrderButton';
import '../OrderPage.css';

const OrderPage = () => {
    const [reload, setReload] = useState(0);

    const refreshOrders = () => {
        setReload((prev) => prev + 1);
    };

    return (
        <div className="order-page-container">
            <div className="gradient-header">
                <h1 className="page-title animate-float">Order Management</h1>
                <PlaceOrderButton onOrderPlaced={refreshOrders} />
            </div>
            <OrderList key={reload} />
        </div>
    );
};

export default OrderPage;