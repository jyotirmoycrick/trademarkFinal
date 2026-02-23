import { create } from 'zustand';
import { persist } from 'zustand/middleware';

const useCartStore = create(
  persist(
    (set, get) => ({
      items: [],
      
      addItem: (service) => {
        const items = get().items;
        const existingItem = items.find(item => item.id === service.id);
        
        if (existingItem) {
          set({
            items: items.map(item =>
              item.id === service.id
                ? { ...item, quantity: item.quantity + 1 }
                : item
            )
          });
        } else {
          set({ items: [...items, { ...service, quantity: 1 }] });
        }
      },
      
      removeItem: (serviceId) => {
        set({ items: get().items.filter(item => item.id !== serviceId) });
      },
      
      updateQuantity: (serviceId, quantity) => {
        if (quantity <= 0) {
          get().removeItem(serviceId);
          return;
        }
        set({
          items: get().items.map(item =>
            item.id === serviceId ? { ...item, quantity } : item
          )
        });
      },
      
      clearCart: () => {
        set({ items: [] });
      },
      
      getTotal: () => {
        return get().items.reduce((total, item) => {
          const itemTotal = item.price + (item.govt_fee || 0);
          return total + (itemTotal * item.quantity);
        }, 0);
      },
      
      getItemCount: () => {
        return get().items.reduce((count, item) => count + item.quantity, 0);
      },
    }),
    {
      name: 'cart-storage',
    }
  )
);

export default useCartStore;