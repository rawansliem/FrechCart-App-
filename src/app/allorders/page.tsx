"use client";

import { useEffect, useState } from "react";
import Image from "next/image";


type Product = {
  _id: string;
  title: string;
  imageCover: string;
};

type CartItem = {
  _id: string;
  count: number;
  price: number;
  product: Product;
};

type ShippingAddress = {
  details?: string;
  phone?: string;
  city?: string;
};

type User = {
  _id: string;
  name: string;
  email: string;
};

type Order = {
  _id: string;
  totalOrderPrice: number;
  createdAt: string;
  paymentMethodType: "card" | "cash";
  cartItems: CartItem[];
  shippingAddress: ShippingAddress;
  user: User;
};

export default function OrdersPage() {
  const [orders, setOrders] = useState<Order[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedOrder, setSelectedOrder] = useState<Order | null>(null);
  const [notLoggedIn, setNotLoggedIn] = useState(false);

  useEffect(() => {
    async function fetchOrders() {
      try {
        const res = await fetch("/api/allorders");

        if (res.status === 401) {
          setNotLoggedIn(true);
          setOrders([]);
          return;
        }

        const data = await res.json();
        setOrders(Array.isArray(data) ? data : []);
      } catch  {
        setOrders([]);
      } finally {
        setLoading(false);
      }
    }

    fetchOrders();
  }, []);

  if (loading)
    return (
      <div className="flex justify-center items-center h-64">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-emerald-600"></div>
      </div>
    );

  if (notLoggedIn)
    return (
      <p className="p-8 text-center text-red-600 font-semibold">
        You are not logged in. Please{" "}
        <a href="/login" className="text-blue-500 underline">
          login
        </a>{" "}
        to view your orders.
      </p>
    );

  if (orders.length === 0)
    return <p className="p-8 text-center text-gray-600">No orders found.</p>;

  function getStatusBadge(paymentType: string) {
    return paymentType === "card" ? (
      <span className="px-3 py-1 bg-green-100 text-green-700 text-sm font-medium rounded-full">
        Paid
      </span>
    ) : (
      <span className="px-3 py-1 bg-red-100 text-red-700 text-sm font-medium rounded-full">
        Cash on Delivery
      </span>
    );
  }

  return (
    <div className="container mx-auto my-8">
      <h1 className="text-3xl font-bold text-green-500 text-center mb-8">
        Orders Page
      </h1>

      <div className="grid w-1/2 gap-6">
        {orders.map((order) => (
          <div
            key={order._id}
            className="flex flex-col md:flex-row items-center md:items-stretch border rounded-xl shadow-md bg-white overflow-hidden relative"
          >
            <div className="absolute top-3 right-3">
              {getStatusBadge(order.paymentMethodType)}
            </div>

            <div className="flex-1 p-6 ">
              <h2 className="text-lg text-green-500 font-semibold mb-2">
                Order ID:{" "}
                <span className="text-gray-700 font-normal">{order._id}</span>
              </h2>
              <p>
                <strong className="text-lg text-green-500 font-semibold">
                  Total Price:
                </strong>{" "}
                {order.totalOrderPrice} EGP
              </p>
              <p>
                <strong className="text-lg text-green-500 font-semibold">
                  Date:
                </strong>{" "}
                {new Date(order.createdAt).toLocaleDateString()}
              </p>
              <div className="mt-4">
                <button
                  onClick={() => setSelectedOrder(order)}
                  className="px-4 py-2 bg-emerald-700 text-white rounded-lg hover:bg-emerald-500 transition"
                >
                  View Details
                </button>
              </div>
            </div>
          </div>
        ))}
      </div>

      {selectedOrder && (
        <div className="fixed inset-0 bg-gray-100 bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white w-full max-w-lg rounded-xl shadow-lg p-6 relative">
            <button
              className="absolute top-2 right-2 text-gray-600 hover:text-black"
              onClick={() => setSelectedOrder(null)}
            >
              ✕
            </button>
            <h2 className="text-2xl text-green-500 text-center font-bold mb-4">
              Order Details
            </h2>
            <p>
              <strong className="text-lg text-green-500 font-semibold">
                Customer:
              </strong>{" "}
              {selectedOrder.user?.name}
            </p>
            <p>
              <strong className="text-lg text-green-500 font-semibold">
                Phone:
              </strong>{" "}
              {selectedOrder.shippingAddress?.phone}
            </p>
            <p>
              <strong className="text-lg text-green-500 font-semibold">
                City:
              </strong>{" "}
              {selectedOrder.shippingAddress?.city}
            </p>
            <p>
              <strong className="text-lg text-green-500 font-semibold">
                Payment Method:
              </strong>{" "}
              {getStatusBadge(selectedOrder.paymentMethodType)}
            </p>

            <h3 className="mt-4 text-lg text-green-500 font-semibold">
              Products:
            </h3>
            <ul className="space-y-2 mt-2">
              {selectedOrder.cartItems?.map((item) => (
                <li
                  key={item._id}
                  className="flex items-center gap-3 border p-2 rounded-lg"
                >
                  <Image
  src={item.product?.imageCover}
  alt={item.product?.title || "Product image"}
  width={48}
  height={48}
  className="rounded object-cover m-3"
/>

                  <div>
                    <p className="font-semibold">{item.product?.title}</p>
                    <p className="text-sm text-gray-600">
                      {item.count} pcs × {item.price} EGP
                    </p>
                  </div>
                </li>
              ))}
            </ul>
          </div>
        </div>
      )}
    </div>
  );
}
