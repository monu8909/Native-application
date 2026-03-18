import { api } from "./apiClient";

export type Booking = {
  _id: string;
  serviceType: string;
  status: string;
  scheduledAt: string;
  estimatedPrice?: number;
  finalPrice?: number;
  address: {
    line1: string;
    city: string;
    state: string;
  };
  description?: string;
  createdAt: string;
};

export async function fetchMyBookings() {
  const res = await api.get<{ items: Booking[] }>("/api/bookings");
  return res.data.items;
}

export type Service = {
  id: string;
  title: string;
  subtitle: string;
  key: "wall_design" | "pop" | "putty" | "ceiling" | "other";
  baseFrom: number;
};

export async function fetchServices(): Promise<Service[]> {
  // backend services endpoint can be added later; for now it's app-defined
  return [
    { id: "1", title: "Wall Design", subtitle: "Textures • Wallpapers • Accent walls", key: "wall_design", baseFrom: 120 },
    { id: "2", title: "POP", subtitle: "False ceiling • Cove lighting", key: "pop", baseFrom: 180 },
    { id: "3", title: "Putty", subtitle: "Premium finish • Crack repair", key: "putty", baseFrom: 90 },
    { id: "4", title: "Ceiling", subtitle: "Modern ceiling designs", key: "ceiling", baseFrom: 150 },
  ];
}

