import { api } from "./apiClient";

export type OtpRequestInput = { phone: string };
export type OtpVerifyInput = { phone: string; code: string; name?: string };

export async function requestOtp(input: OtpRequestInput) {
  const res = await api.post("/api/auth/otp/request", input);
  return res.data as { ok: true; devCode?: string };
}

export async function verifyOtp(input: OtpVerifyInput) {
  const res = await api.post("/api/auth/otp/verify", input);
  return res.data as {
    accessToken: string;
    refreshToken: string;
    user: { id: string; role: "customer" | "worker" | "admin"; name?: string; phone?: string; email?: string };
  };
}

export type LoginInput = { phoneOrEmail: string; password: string };

export async function loginPassword(input: LoginInput) {
  const res = await api.post("/api/auth/login", input);
  return res.data as {
    accessToken: string;
    refreshToken: string;
    user: { id: string; role: "customer" | "worker" | "admin"; name?: string; phone?: string; email?: string };
  };
}

export type CreateBookingInput = {
  serviceType: "wall_design" | "pop" | "putty" | "ceiling" | "other";
  address: {
    line1: string;
    city: string;
    state: string;
  };
  scheduledAt: string;
  description?: string;
};

export async function createBooking(input: CreateBookingInput) {
  const res = await api.post("/api/bookings", input);
  return res.data;
}

