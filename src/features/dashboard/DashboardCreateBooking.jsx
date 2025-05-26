import Button from "../../ui/Button";
import Modal from "../../ui/Modal";
import BookingForm from "../bookings/BookingForm";

function DashboardCreateBooking() {
  return (
    <div>
      <Modal>
        <Modal.Open opensWindowName="create-form">
          <Button>Add Guest</Button>
        </Modal.Open>

        <Modal.Window name="create-form">
          <BookingForm onCloseModal={() => {}} />
        </Modal.Window>
      </Modal>
    </div>
  );
}

export default DashboardCreateBooking;
