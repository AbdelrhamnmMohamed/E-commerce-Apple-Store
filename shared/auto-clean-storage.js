
// Auto-clean localStorage to manage size at website
export function autoCleanStorage() {
  try {

    let totalSize = 0;
    for (let key in localStorage) {
      if (localStorage.hasOwnProperty(key)) {
        totalSize += (localStorage[key].length + key.length) * 2;
      }
    }
    const maxSize = 5 * 1024 * 1024;
    const warningThreshold = maxSize * 0.7;
    const criticalThreshold = maxSize * 0.9;
    
    if (totalSize > warningThreshold) {
      console.warn(`⚠️ Storage is ${Math.round(totalSize / maxSize * 100)}% full. Running cleanup...`);
      
      const products = JSON.parse(localStorage.getItem('allProducts') || '[]');
      let cleaned = 0;
      // clean images from products
      products.forEach(p => {
        if (p.image && p.image.startsWith('data:')) {
          p.image = 'imgs/store.png';
          cleaned++;
        }
      });
      
      if (cleaned > 0) {
        localStorage.setItem('allProducts', JSON.stringify(products));
        console.log(`✅ Cleaned ${cleaned} base64 images from products`);
      }
      // clean old orders, keep only latest 50
      const orders = JSON.parse(localStorage.getItem('orders_v1') || '[]');
      if (orders.length > 50) {
        const sorted = orders.sort((a, b) => (b.createdAt || 0) - (a.createdAt || 0));
        const kept = sorted.slice(0, 50);
        localStorage.setItem('orders_v1', JSON.stringify(kept));
        console.log(`✅ Removed ${orders.length - 50} old orders`);
      }
      
      if (totalSize > criticalThreshold) {
        const currentUser = JSON.parse(localStorage.getItem('currentUser') || 'null');
        const currentUserId = currentUser ? currentUser.id : null;
        
        for (let key in localStorage) {
          if (key.startsWith('cart_v1_') && !key.endsWith(currentUserId)) {
            localStorage.removeItem(key);
          }
        }
        console.log('✅ Cleaned other users\' carts');
      }
      
      totalSize = 0;
      for (let key in localStorage) {
        if (localStorage.hasOwnProperty(key)) {
          totalSize += (localStorage[key].length + key.length) * 2;
        }
      }
      
      console.log(`✅ Storage now at ${Math.round(totalSize / maxSize * 100)}%`);
    }
    
  } catch (error) {
    console.error('Error in auto-clean:', error);
  }
}


autoCleanStorage();


setInterval(autoCleanStorage, 5 * 60 * 1000);

