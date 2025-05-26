import { useQueryClient, useQuery } from "@tanstack/react-query";
import { getBookings, getBookingsByName } from "../../services/apiBookings";
import { useSearchParams } from "react-router-dom";
import { PAGE_SIZE } from "../../utils/constants";

export function useBookings() {
  const queryClient = useQueryClient();
  const [searchParams] = useSearchParams();

  // search
  const searchQuery = searchParams.get("search");
  console.log("Search Query:", searchQuery); // Debug log

  // filter
  const filterValue = searchParams.get("status");
  const filter =
    !filterValue || filterValue === "all"
      ? null
      : { field: "status", value: filterValue };

  // sort
  const sortByRaw = searchParams.get("sortBy") || "startDate-desc";
  const [field, direction] = sortByRaw.split("-");
  const sortBy = { field, direction };

  // pagination
  const page = !searchParams.get("page") ? 1 : Number(searchParams.get("page"));

  // query
  const { isLoading, data, error } = useQuery({
    queryKey: ["bookings", filter, sortBy, page, searchQuery],
    queryFn: async () => {
      if (searchQuery) {
        const searchResults = await getBookingsByName(searchQuery);
        console.log("Search Results:", searchResults); // Debug log
        return { data: searchResults, count: searchResults?.length || 0 };
      }
      return getBookings({ filter, sortBy, page });
    },
  });

  console.log("Query Data:", data); // Debug log

  // Pre-fetching sadece normal liste görünümünde yapılsın
  if (!searchQuery) {
    const pageCount = Math.ceil((data?.count || 0) / PAGE_SIZE);
    if (page < pageCount)
      queryClient.prefetchQuery({
        queryKey: ["bookings", filter, sortBy, page + 1],
        queryFn: () => getBookings({ filter, sortBy, page: page + 1 }),
      });
    if (page > 1)
      queryClient.prefetchQuery({
        queryKey: ["bookings", filter, sortBy, page - 1],
        queryFn: () => getBookings({ filter, sortBy, page: page - 1 }),
      });
  }

  return {
    isLoading,
    error,
    bookings: data?.data || [],
    count: data?.count || 0,
  };
}
