
import { createDefaultAccounts, getUsers, saveUsers } from "./shared/store.js";


createDefaultAccounts();


function displayAccountInfo() {
  const users = getUsers();
  const adminUser = users.find((u) => u.email === "many@admin.com");
  const sellerUser = users.find((u) => u.email === "seller@store.com");

  console.log("=== DEMO ACCOUNTS CREATED ===");
  console.log("");
  console.log("🔑 ADMIN ACCOUNT:");
  console.log("   Email: many@admin.com");
  console.log("   Password: many");
  console.log(
    "   Access: Admin Dashboard, Order Management, Customer Management"
  );
  console.log("");
  console.log("🏪 SELLER ACCOUNT:");
  console.log("   Email: seller@store.com");
  console.log("   Password: seller123");
  console.log(
    "   Access: Seller Dashboard, Product Management, Order Tracking"
  );
  console.log("");
  console.log("📝 HOW TO TEST:");
  console.log("1. Go to the website");
  console.log("2. Click on the profile icon in the navbar");
  console.log('3. Click "Login"');
  console.log("4. Use either admin or seller credentials");
  console.log("5. After login, click the profile icon again");
  console.log("6. You will see role-specific dashboard links!");
  console.log("");
  console.log("🎯 FEATURES:");
  console.log("- Role-based navbar dropdown");
  console.log("- Admin: Full dashboard access");
  console.log("- Seller: Seller-specific dashboard");
  console.log("- Customer: Account and wishlist access");
  console.log("- Automatic account creation");
}


window.displayAccountInfo = displayAccountInfo;


if (typeof window !== "undefined") {
  displayAccountInfo();
}
