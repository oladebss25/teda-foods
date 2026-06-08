export interface MenuItem {
  id: string;
  name: string;
  displayName: string;
  price: number;
  displayPrice: string;
  image: string;
}

export interface MenuCategory {
  category: string;
  items: MenuItem[];
}

export const menuData: MenuCategory[] = [
  {
    category: 'Rice Combos',
    items: [
      { id: '1', name: 'Jollof Rice + Chicken + Zobo (35cl)', displayName: 'Jollof Rice + Chicken + Zobo', price: 3000, displayPrice: '₦3,000', image: 'images/rice_combo.png' },
      { id: '2', name: 'Jollof Rice + Turkey + Zobo (35cl)', displayName: 'Jollof Rice + Turkey + Zobo', price: 4000, displayPrice: '₦4,000', image: 'images/rice_combo.png' },
      { id: '3', name: 'Asun Jollof + Chicken', displayName: 'Asun Jollof + Chicken', price: 3500, displayPrice: '₦3,500', image: 'images/rice_combo.png' },
      { id: '4', name: 'Asun Jollof + Turkey', displayName: 'Asun Jollof + Turkey', price: 4500, displayPrice: '₦4,500', image: 'images/rice_combo.png' },
      { id: '5', name: 'Fried Rice + Chicken', displayName: 'Fried Rice + Chicken', price: 2800, displayPrice: '₦2,800', image: 'images/fried_rice.png' },
      { id: '6', name: 'Fried Rice + Turkey', displayName: 'Fried Rice + Turkey', price: 4000, displayPrice: '₦4,000', image: 'images/fried_rice.png' },
      { id: '7', name: 'Ofada Rice Special (per pack)', displayName: 'Ofada Rice Special', price: 2700, displayPrice: '₦2,700 / pack', image: 'images/ofada_rice.png' },
    ],
  },
  {
    category: 'Pasta & Others',
    items: [
      { id: '8', name: 'Stir Fry Pasta + Chicken', displayName: 'Stir Fry Pasta + Chicken', price: 2500, displayPrice: '₦2,500', image: 'images/pasta.png' },
      { id: '9', name: 'Stir Fry Pasta + Turkey', displayName: 'Stir Fry Pasta + Turkey', price: 3500, displayPrice: '₦3,500', image: 'images/pasta.png' },
      { id: '10', name: 'Ewa-agoyin (per pack, with proteins)', displayName: 'Ewa-agoyin (with proteins)', price: 2500, displayPrice: '₦2,500 / pack', image: 'images/ewa_agoyin.png' },
    ],
  },
  {
    category: 'Sides & Extras',
    items: [
      { id: '11', name: 'Plantain (small pack)', displayName: 'Plantain (small pack)', price: 500, displayPrice: '₦500', image: 'images/sides_extras.png' },
      { id: '12', name: 'Plantain (medium pack)', displayName: 'Plantain (medium pack)', price: 700, displayPrice: '₦700', image: 'images/sides_extras.png' },
      { id: '13', name: 'Coleslaw (small pack)', displayName: 'Coleslaw (small pack)', price: 400, displayPrice: '₦400', image: 'images/sides_extras.png' },
      { id: '14', name: 'Coleslaw (medium pack)', displayName: 'Coleslaw (medium pack)', price: 700, displayPrice: '₦700', image: 'images/sides_extras.png' },
      { id: '15', name: 'Fried Fish', displayName: 'Fried Fish', price: 500, displayPrice: '₦500', image: 'images/sides_extras.png' },
      { id: '16', name: 'Egg', displayName: 'Egg', price: 300, displayPrice: '₦300', image: 'images/sides_extras.png' },
    ],
  },
  {
    category: 'Drinks',
    items: [
      { id: '17', name: "Teda's Zobo Drink (35cl)", displayName: "Teda's Zobo Drink (35cl)", price: 700, displayPrice: '₦700', image: 'images/drinks.png' },
      { id: '18', name: "Teda's Special Milkshake (50cl)", displayName: "Teda's Special Milkshake (50cl)", price: 2000, displayPrice: '₦2,000', image: 'images/drinks.png' },
    ],
  },
];
