import { api } from "./apiClient";
export type Booking = {
  _id: string;
  serviceType: string;
  serviceID: string;
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
  id: string; // Changed from `_id` on backend sometimes, we'll use `_id` and map or just use `_id` below. Let's define it properly based on backend models.
  _id: string;
  title: string;
  subtitle: string;
  rating:string,
  icon: string;
  basePrice: number;
  image:string,
  price:number,
  reviews:number
};

export async function fetchServices() {
  const res = await api.get<{ services: Service[] }>("/api/services");
  return res.data.services;
}

export type Design = {
  _id: string;
  title: string;
  description: string;
  imageUrl: string;
  createdAt: string;
};

export async function fetchDesigns() {
  const res = await api.get<{ designs: Design[] }>("/api/designs");
  return res.data.designs;
}

export type GalleryItem = {
  _id: string;
  title?: string;
  description?: string;
  imageUrl: string;
  createdAt: string;
};

export async function fetchGallery() {
  const res = await api.get<{ items: GalleryItem[] }>("/api/gallery");
  return res.data.items;
}

export async function fetchAdminDashboard() {
  const res = await api.get("/api/admin/dashboard");

  return res.data as {
    bookingsTotal: number;
    userTotal: number;
    workersTotal: number;
    bookingsByStatus: { _id: string; count: number }[];
  };
}

export async function fetchAdminBookings(page = 1, limit = 20) {
  const res = await api.get(`/api/admin/bookings?page=${page}&limit=${limit}`);
  return res.data as {
    items: any[];
    total: number;
    page: number;
    limit: number;
  };
}

export async function fetchAdminWorkers(page = 1, limit = 20) {
  const res = await api.get(`/api/admin/workers?page=${page}&limit=${limit}`);

  return res.data as {
    items: any[];
    total: number;
    page: number;
    limit: number;
  };
}


export async function fetchAdminPayments(page = 1, limit = 20) {
  const res = await api.get(`/api/payments?page=${page}&limit=${limit}`);
  return res.data;
}

export async function fetchWorkerStats(workerId: string) {
  const res = await api.get(`/api/admin/workers/${workerId}/stats`);
  return res.data as {
    worker: any;
    stats: {
      tasksCount: number;
      attendanceDays: number;
      totalEarned: number;
      totalPaid: number;
      balance: number;
      advance: number;
    };
    attendanceHistory: any[];
    payments: any[];
  };
}


 