const STORAGE_KEY = 'jugueton-cart-id';

let memoryCartId: string | null = null;

function generateId(): string {
  if (typeof crypto !== 'undefined' && 'randomUUID' in crypto) {
    return crypto.randomUUID();
  }
  return `cart-${Date.now()}-${Math.random().toString(36).slice(2)}`;
}

// Identificador del carrito de este navegador. Se crea una sola vez y se guarda
// en localStorage, así el carrito sobrevive a recargas sin necesidad de login.
export function getCartId(): string {
  try {
    const saved = localStorage.getItem(STORAGE_KEY);
    if (saved) {
      return saved;
    }
    const id = generateId();
    localStorage.setItem(STORAGE_KEY, id);
    return id;
  } catch {
    // Navegación privada o almacenamiento bloqueado: usamos un id en memoria.
    memoryCartId ??= generateId();
    return memoryCartId;
  }
}
