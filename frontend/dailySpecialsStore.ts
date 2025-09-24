// In-memory store for Daily Specials (temporary). Replace with backend later.
export type SpecialItem = {
  id: number;
  name: string;
  price: number;
  available: boolean;
  imageUri?: string;
};

let nextId = 4;
let items: SpecialItem[] = [
  { id: 1, name: 'Vadapav', price: 20, available: true },
  { id: 2, name: 'Sandwich', price: 20, available: true },
  { id: 3, name: 'Juice', price: 20, available: false },
];

const listeners = new Set<() => void>();

export function getItems(): SpecialItem[] {
  return items.map(i => ({ ...i }));
}

export function subscribe(listener: () => void): () => void {
  listeners.add(listener);
  return () => listeners.delete(listener);
}

function notify() {
  listeners.forEach(l => l());
}

export function addItem(name: string, price: number, imageUri?: string) {
  items = [...items, { id: nextId++, name, price, available: true, imageUri }];
  notify();
}

export function updateItem(id: number, name: string, price: number, imageUri?: string) {
  items = items.map(i => (i.id === id ? { ...i, name, price, imageUri } : i));
  notify();
}

export function deleteItem(id: number) {
  items = items.filter(i => i.id !== id);
  notify();
}

export function setAvailable(id: number, available: boolean) {
  items = items.map(i => (i.id === id ? { ...i, available } : i));
  notify();
}

