/* eslint-disable no-unused-vars */
import { useQuery } from "@tanstack/react-query";
import { getSettings } from "../../services/apiSettings";

export function useSettings() {
  const {
    isLoading,
    error,
    data: settings,
  } = useQuery({ queryKey: ["settings"], queryFn: getSettings });

  return { isLoading, settings, error };
}
