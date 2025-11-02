


import { addOrder, getUsers, saveUsers } from "./shared/store.js";


function addSampleUsers() {
  const users = getUsers();
  if (users.length === 0) {
    const sampleUsers = [
      {
        id: "user1",
        firstName: "John",
        lastName: "Doe",
        email: "john.doe@example.com",
        password: "password123",
        createdAt: Date.now(),
      },
      {
        id: "user2",
        firstName: "Jane",
        lastName: "Smith",
        email: "jane.smith@example.com",
        password: "password123",
        createdAt: Date.now(),
      },
      {
        id: "user3",
        firstName: "Mike",
        lastName: "Johnson",
        email: "mike.johnson@example.com",
        password: "password123",
        createdAt: Date.now(),
      },
    ];
    saveUsers(sampleUsers);
    console.log("Sample users added");
  }
}


function addSampleOrders() {
  const sampleOrders = [
    {
      id: "ORD-" + Date.now(),
      userEmail: "john.doe@example.com",
      items: [
        {
          id: "p-iph-17",
          title: "iPhone 17",
          price: 150,
          qty: 1,
          image: "../imgs/IP.png",
        },
        {
          id: "p-air-3",
          title: "AirPods 3rd Gen",
          price: 199,
          qty: 1,
          image: "../imgs/Airpodes.webp",
        },
      ],
      pricing: { subtotal: 349, tax: 6.98, shipping: 10, total: 365.98 },
      shippingInfo: {
        firstName: "John",
        lastName: "Doe",
        address: "123 Main St",
        city: "New York",
        state: "NY",
        country: "USA",
        zip: "10001",
      },
      deliveryMethod: { method: "standard", price: 10 },
      payment: {
        method: "card",
        holder: "John Doe",
        number: "1234567890123456",
        expiry: "12/25",
        cvc: "123",
      },
      status: "pending",
      sellerId: "default-seller",
      sellerName: "Store Admin",
      createdAt: Date.now() - 86400000,
      updatedAt: Date.now() - 86400000,
    },
    {
      id: "ORD-" + (Date.now() + 1),
      userEmail: "jane.smith@example.com",
      items: [
        {
          id: "p-lap-m1",
          title: "MacBook Air M1",
          price: 999,
          qty: 1,
          image: "../imgs/mac air m1.jpg",
        },
      ],
      pricing: { subtotal: 999, tax: 19.98, shipping: 10, total: 1028.98 },
      shippingInfo: {
        firstName: "Jane",
        lastName: "Smith",
        address: "456 Oak Ave",
        city: "Los Angeles",
        state: "CA",
        country: "USA",
        zip: "90210",
      },
      deliveryMethod: { method: "express", price: 15 },
      payment: {
        method: "card",
        holder: "Jane Smith",
        number: "9876543210987654",
        expiry: "06/26",
        cvc: "456",
      },
      status: "completed",
      sellerId: "default-seller",
      sellerName: "Store Admin",
      createdAt: Date.now() - 172800000,
      updatedAt: Date.now() - 86400000,
    },
    {
      id: "ORD-" + (Date.now() + 2),
      userEmail: "mike.johnson@example.com",
      items: [
        {
          id: "p-watch-9",
          title: "Apple Watch Series 9",
          price: 399,
          qty: 1,
          image: "../imgs/applewatch series9.png",
        },
        {
          id: "p-air-pro",
          title: "AirPods Pro 2",
          price: 249,
          qty: 1,
          image: "../imgs/Airpodes.webp",
        },
      ],
      pricing: { subtotal: 648, tax: 12.96, shipping: 10, total: 670.96 },
      shippingInfo: {
        firstName: "Mike",
        lastName: "Johnson",
        address: "789 Pine St",
        city: "Chicago",
        state: "IL",
        country: "USA",
        zip: "60601",
      },
      deliveryMethod: { method: "standard", price: 10 },
      payment: {
        method: "card",
        holder: "Mike Johnson",
        number: "5555444433332222",
        expiry: "09/27",
        cvc: "789",
      },
      status: "processing",
      sellerId: "default-seller",
      sellerName: "Store Admin",
      createdAt: Date.now() - 259200000,
      updatedAt: Date.now() - 43200000,
    },
  ];


  sampleOrders.forEach((order) => {

    const existingOrders = JSON.parse(
      localStorage.getItem("orders_v1") || "[]"
    );
    existingOrders.push(order);
    localStorage.setItem("orders_v1", JSON.stringify(existingOrders));
  });


  window.dispatchEvent(
    new CustomEvent("ordersUpdated", {
      detail: { orders: JSON.parse(localStorage.getItem("orders_v1") || "[]") },
    })
  );

  console.log("Sample orders added");
}


function initializeDemoData() {
  addSampleUsers();
  addSampleOrders();
  console.log(
    "Demo data initialized! You can now see real orders in the dashboards."
  );
}


window.initializeDemoData = initializeDemoData;


if (typeof window !== "undefined") {
  console.log(
    "Demo script loaded. Run initializeDemoData() to add sample data."
  );
}
