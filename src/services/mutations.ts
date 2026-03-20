import { api } from "./apiClient";

export type OtpRequestInput = { phone: string };
export type OtpVerifyInput = { phone: string; code: string; name?: string };

export async function requestOtp(input: OtpRequestInput) {
  console.log("requesting otp for", input.phone);
  const res = await api.post("/api/auth/otp/request", input);
  console.log("otp requested", res.data);
  return res.data as { ok: true; devCode?: string };
}

export async function verifyOtp(input: OtpVerifyInput) {
  console.log("verifying otp for", input.phone);
  const res = await api.post("/api/auth/otp/verify", input);
  console.log("otp verified", res.data);
  return res.data as {
    accessToken: string;
    refreshToken: string;
    user: { id: string; role: "customer" | "worker" | "admin"; name?: string; phone?: string; email?: string };
  };
}

export type LoginInput = { phoneOrEmail: string; password: string ,mode:string};

export async function loginPassword(input: LoginInput) {
  console.log("input9999999999>",input);
  
  const res = await api.post("/api/auth/login", input);
  return res.data as {
    accessToken: string;
    refreshToken: string;
    user: { id: string; role: "customer" | "worker" | "admin"; name?: string; phone?: string; email?: string };
  };
}

export type CreateBookingInput = {
  address: {
    line1: string;
    city: string;
    state: string;
  };
  serviceID:string;
  scheduledAt: string;
  description?: string;
};

export async function createBooking(input: CreateBookingInput) {
  const res = await api.post("/api/bookings", input);
  return res.data;
}

// ============== Admin Mutations ==============

export type CreateServiceInput = {
  title: string;
  subtitle?: string;
  icon?: string;
  basePrice: number;
  features?: string[];
};

export async function updateAdminBookingStatus({ id, status }: { id: string; status: string }) {
  const res = await api.patch(`/api/admin/bookings/${id}`, { status });
  return res.data;
}

export async function createService(input: CreateServiceInput) {
  const res = await api.post("/api/services", input);
  return res.data;
}

export async function deleteService(id: string) {
  const res = await api.delete(`/api/services/${id}`);
  return res.data;
}

export async function uploadDesign(formData: FormData) {
  // formData requires multipart/form-data
  const res = await api.post("/api/designs", formData, {
    headers: { "Content-Type": "multipart/form-data" },
  });
  return res.data;
}

export async function uploadGalleryImage(formData: FormData) {
  const res = await api.post("/api/gallery/upload", formData, {
    headers: { "Content-Type": "multipart/form-data" },
  });
  return res.data;
}

export async function markWorkerAttendance(input: { workerId: string; date: string; status: "present" | "leave"; note?: string }) {
  const res = await api.post("/api/admin/attendance", input);
  return res.data;
}

export async function recordWorkerPayment(workerId: string, input: { amount: number; notes?: string; method?: string }) {
  const res = await api.post(`/api/admin/workers/${workerId}/pay`, input);
  return res.data;
}


