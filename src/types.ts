export interface Seller {
  id: string;
  name: string;
  ratePerCubicMeter: number;
  rateUnderThree: number;
  rateOverThree: number;
  minimumOrderCount: number;
}

export interface Order {
  id: string;
  sellerId: string;
  month: string;
  quantityUnderThree: number;
  quantityOverThree: number;
  volume: number;
}

export interface MonthlyStats {
  month: string;
  totalOrders: number;
  totalSellers: number;
  totalAmount: number;
  totalVolume: number;
  totalOrderAmount: number;
  totalVolumeAmount: number;
}

export interface SellerStats {
  sellerId: string;
  sellerName: string;
  totalAmount: number;
  percentage: number;
  totalOrders: number;
}