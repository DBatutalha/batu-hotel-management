import { useMutation } from "@tanstack/react-query";
import { createBooking } from "../../services/apiBookings";
import { toast } from "react-hot-toast";

export function useCreateBooking() {
  const { mutate: createBookingMutation, isPending } = useMutation({
    mutationFn: (newBooking) => createBooking(newBooking),
    onSuccess: () => {
      toast.success("Rezervasyon başarıyla oluşturuldu");
    },
    onError: (error) => {
      toast.error(error.message);
    },
  });

  return { createBooking: createBookingMutation, isPending };
}
