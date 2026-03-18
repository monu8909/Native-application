import { useQuery } from "@tanstack/react-query";
import { fetchServices } from "../services/queries";

export function useServices() {
  return useQuery({
    queryKey: ["services"],
    queryFn: fetchServices,
  });
}

