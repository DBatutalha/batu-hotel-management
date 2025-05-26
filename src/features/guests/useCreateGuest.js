import { useMutation, useQueryClient } from "@tanstack/react-query";
import { createGuest } from "../../services/apiGuests";
import { toast } from "react-hot-toast";

export function useCreateGuest() {
  const queryClient = useQueryClient();

  const { mutate: createGuestMutation, isPending } = useMutation({
    mutationFn: createGuest,
    onSuccess: () => {
      toast.success("Guest created successfully");
      queryClient.invalidateQueries({
        queryKey: ["guests"],
      });
    },
    onError: (err) => toast.error(err.message),
  });

  return { createGuest: createGuestMutation, isPending };
}
