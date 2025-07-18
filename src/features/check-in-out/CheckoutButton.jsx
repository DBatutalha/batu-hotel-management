/* eslint-disable no-unused-vars */
import Button from "../../ui/Button";
import { useCheckout } from "./useCheckout";

// eslint-disable-next-line react/prop-types
function CheckoutButton({ bookingId }) {
  const { checkout, isCheckingOut } = useCheckout();
  return (
    <Button
      variations="primary"
      size="small"
      onClick={() => checkout(bookingId)}
      disabled={isCheckingOut}
    >
      Check out
    </Button>
  );
}

export default CheckoutButton;
