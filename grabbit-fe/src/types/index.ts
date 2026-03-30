export type Order = {
  _id: string;
  createdAt: Date;
  shippingAddress: {
    address: string;
    city: string;
    country: string;
    postalCode: string;
  };
  orderItems: {
    productId: string;
    name: string;
    price: number;
    quantity: number;
    image: string;
    color: string;
    size: string;
  }[];
  totalPrice: number;
  status: string;
  user: {
    _id: string;
    name: string;
    email: string;
  };
  isPaid?: boolean;
  isDelivered?: boolean;
  paymentMethod?: string;
  shippingMethod?: string;
};

export type Product = {
  _id: string;
  name: string;
  price: number;
  images: { url: string; altText: string }[];
  discountPrice?: number;
  description: string;
  countInStock: number;
  sku: string;
  category?: string;
  brand?: string;
  sizes: string[];
  colors: string[];
  collections: string;
  material?: string;
  gender?: string;
  rating?: number;
  numReviews?: number;
  isFeatured?: boolean;
  isPublished?: boolean;
  tags?: string[];
};

export type Filter = {
  category: string;
  gender: string;
  color: string;
  size: string[];
  material: string[];
  brand: string[];
  minPrice: number;
  maxPrice: number;
};

export type CartProduct = {
  productId: string;
  name: string;
  image: string;
  price: number;
  size?: string;
  color?: string;
  quantity: number;
};

export type Cart = {
  _id?: string;
  user?: string;
  guestId?: string;
  products: CartProduct[];
  totalPrice: number;
  createdAt?: Date;
  updatedAt?: Date;
};

export type AuthState = {
  user: User | null;
  guestId: string;
  loading: boolean;
  error: string | null;
};

export type CartState = {
  cart: Cart;
  loading: boolean;
  error: string | null;
};

export type AdminState = {
  users: User[];
  loading: boolean;
  error: string | null;
};

export type AdminProductState = {
  products: Product[];
  loading: boolean;
  error: string | null;
};

export type OrderState = {
  orders: Order[];
  totalOrders: number;
  orderDetails: Order | null;
  loading: boolean;
  error: string | null;
};

export type AdminOrderState = {
  orders: Order[];
  totalOrders: number;
  totalSales: number;
  loading: boolean;
  error: string | null;
};

export type ProductsState = {
  products: Product[];
  selectedProduct: Product | null;
  similarProducts: Product[];
  loading: boolean;
  error: string | null;
  filters: {
    category: string;
    size: string;
    color: string;
    gender: string;
    collection: string;
    brand: string;
    maxPrice: string;
    minPrice: string;
    sortBy: string;
    search: string;
    material: string;
  };
};

export type FetchCartParams = {
  userId?: string;
  guestId?: string;
};

export type AddProductParams = {
  userId?: string;
  guestId?: string;
  productId: string;
  quantity: number;
  color?: string;
  size?: string;
};

export type RemoveProductParams = {
  userId?: string | null;
  guestId?: string | null;
  productId: string;
  size?: string;
  color?: string;
};

export type UpdateQuantityParams = {
  userId?: string | null;
  guestId?: string | null;
  productId: string;
  quantity?: number;
  size?: string;
  color?: string;
};

export type MergeCartParams = {
  guestId: string;
  user: User;
};

export type ErrorResponse = {
  message?: string;
};

export type User = {
  _id: string;
  name: string;
  email: string;
  role: string;
  createdAt: Date;
  updatedAt: Date;
};
