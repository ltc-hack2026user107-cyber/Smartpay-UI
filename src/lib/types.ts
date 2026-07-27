export type Role = "buyer" | "seller" | "admin";

export type OrderStatus =
  | "Created"
  | "Accepted"
  | "Shipped"
  | "In Transit"
  | "Delivered"
  | "Refunded"
  | "Declined";

export type EscrowStatus = "Locked" | "Transferred" | "Refunded" | "-";

export interface TimelineStep {
  label: string;
  timestamp: string | null; // null = pending / not yet reached
  state: "done" | "current" | "pending";
}

export interface Order {
  id: string;
  buyer: string;
  seller: string;
  description: string;
  amount: number;
  deliveryDate: string;
  status: OrderStatus;
  escrowStatus: EscrowStatus;
  createdOn: string;
  timeline: TimelineStep[];
}

export interface BuyerAccount {
  id: string;
  name: string;
  walletBalance: number;
  escrowBalance: number;
  totalOrders: number;
  status: "Active" | "Suspended";
}

export interface SellerAccount {
  id: string;
  name: string;
  walletBalance: number;
  escrowBalance: number | null;
  totalOrders: number;
  status: "Active" | "Suspended";
}

export interface LedgerEntry {
  txnHash: string;
  orderId: string;
  event: string;
  timestamp: string;
  block: string;
}
