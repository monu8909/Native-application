import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { createBooking } from "../services/mutations";
import { fetchMyBookings } from "../services/queries";

export function useMyBookings() {
  return useQuery({
    queryKey: ["bookings", "me"],
    queryFn: fetchMyBookings,
  });
}

export function useCreateBooking() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: createBooking,
    onSuccess: async () => {
      await qc.invalidateQueries({ queryKey: ["bookings", "me"] });
    },
  });
}

