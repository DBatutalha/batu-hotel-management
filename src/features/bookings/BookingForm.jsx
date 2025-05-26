/* eslint-disable react/prop-types */
/* eslint-disable no-unused-vars */
import { useForm } from "react-hook-form";
import { useNavigate } from "react-router-dom";
import { useCreateBooking } from "../dashboard/useCreateBooking";
import { useCreateGuest } from "../guests/useCreateGuest";
import { useCabins } from "../cabins/useCabins";
import { useGuests } from "../guests/useGuests";
import { useSettings } from "../settings/useSettings";
import { formatCurrency } from "../../utils/helpers";
import { subtractDates } from "../../utils/helpers";
import { useState } from "react";
import { toast } from "react-hot-toast";
import { getGuests } from "../../services/apiGuests";

import Form from "../../ui/Form";
import FormRow from "../../ui/FormRow";
import Input from "../../ui/Input";
import Select from "../../ui/Select";
import Textarea from "../../ui/Textarea";
import Button from "../../ui/Button";
import ButtonText from "../../ui/ButtonText";
import Spinner from "../../ui/Spinner";
import { useMoveBack } from "../../hooks/useMoveBack";
import Heading from "../../ui/Heading";

function BookingForm({ onCloseModal }) {
  const { createBooking, isPending: isCreatingBooking } = useCreateBooking();
  const { createGuest, isPending: isCreatingGuest } = useCreateGuest();
  const { cabins, isLoading: isLoadingCabins } = useCabins();
  const { settings, isLoading: isLoadingSettings } = useSettings();
  const { guests, isLoading: isLoadingGuests } = useGuests();
  const navigate = useNavigate();
  const moveBack = useMoveBack();
  const [guestId, setGuestId] = useState(null);

  const {
    register,
    handleSubmit,
    reset,
    watch,
    formState: { errors },
  } = useForm();
  const {
    register: registerGuest,
    handleSubmit: handleSubmitGuest,
    reset: resetGuest,
    formState: { errors: guestErrors },
  } = useForm();

  const watchStartDate = watch("startDate");
  const watchEndDate = watch("endDate");
  const watchNumNights = watch("numNights");
  const watchCabinId = watch("cabinId");
  const watchNumGuests = watch("numGuests");
  const watchHasBreakfast = watch("hasBreakfast");

  const selectedCabin = cabins?.find(
    (cabin) => cabin.id === Number(watchCabinId)
  );
  const cabinPrice = selectedCabin?.regularPrice || 0;
  const breakfastPrice = settings?.breakfastPrice || 0;
  const maxCapacity = selectedCabin?.maxCapacity || 0;

  const numNights =
    !watchStartDate || !watchEndDate
      ? 0
      : Math.round(
          (new Date(watchEndDate) - new Date(watchStartDate)) /
            (1000 * 60 * 60 * 24)
        );

  const cabinPriceTotal = cabinPrice * numNights;
  const breakfastPriceTotal =
    breakfastPrice * numNights * (watchNumGuests || 0);
  const totalPrice =
    cabinPriceTotal + (watchHasBreakfast ? breakfastPriceTotal : 0);

  function onSubmitGuest(data) {
    createGuest(
      {
        fullName: `${data.firstName} ${data.lastName}`,
        email: data.email,
        nationalID: data.nationalID,
      },
      {
        onSuccess: (guest) => {
          setGuestId(guest.id);
          resetGuest();
        },
      }
    );
  }

  function onSubmit(data) {
    if (!guestId) {
      toast.error("Please fill in guest information first");
      return;
    }

    const bookingData = {
      ...data,
      guestId,
      status: "unconfirmed",
      totalPrice,
      numNights,
      cabinPrice,
      isPaid: false,
    };

    createBooking(bookingData, {
      onSuccess: () => {
        reset();
        setGuestId(null);
        navigate("/bookings");
      },
    });
  }

  const isLoading = isLoadingSettings || isLoadingCabins || isLoadingGuests;

  if (isLoading) return <Spinner />;

  return (
    <div>
      {!guestId ? (
        <Form onSubmit={handleSubmitGuest(onSubmitGuest)}>
          <Heading> Create Guest</Heading>
          <FormRow label="First Name" error={guestErrors?.firstName?.message}>
            <Input
              type="text"
              id="firstName"
              disabled={isCreatingGuest}
              {...registerGuest("firstName", {
                required: "This field is required",
                minLength: {
                  value: 2,
                  message: "First name must be at least 2 characters",
                },
                maxLength: {
                  value: 50,
                  message: "First name cannot exceed 50 characters",
                },
                pattern: {
                  value: /^[a-zA-ZğüşıöçĞÜŞİÖÇ\s]*$/,
                  message: "First name can only contain letters",
                },
              })}
            />
          </FormRow>

          <FormRow label="Last Name" error={guestErrors?.lastName?.message}>
            <Input
              type="text"
              id="lastName"
              disabled={isCreatingGuest}
              {...registerGuest("lastName", {
                required: "This field is required",
                minLength: {
                  value: 2,
                  message: "Last name must be at least 2 characters",
                },
                maxLength: {
                  value: 50,
                  message: "Last name cannot exceed 50 characters",
                },
                pattern: {
                  value: /^[a-zA-ZğüşıöçĞÜŞİÖÇ\s]*$/,
                  message: "Last name can only contain letters",
                },
              })}
            />
          </FormRow>

          <FormRow label="Email" error={guestErrors?.email?.message}>
            <Input
              type="email"
              id="email"
              disabled={isCreatingGuest}
              {...registerGuest("email", {
                required: "This field is required",
                pattern: {
                  value: /^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}$/i,
                  message: "Please enter a valid email address",
                },
                validate: async (value) => {
                  const guests = await getGuests();
                  const emailExists = guests.some(
                    (guest) => guest.email === value
                  );
                  return !emailExists || "This email is already registered";
                },
              })}
            />
          </FormRow>

          <FormRow label="Phone" error={guestErrors?.nationalID?.message}>
            <Input
              type="tel"
              id="nationalID"
              disabled={isCreatingGuest}
              {...registerGuest("nationalID", {
                required: "This field is required",
                pattern: {
                  value: /^[0-9]+$/,
                  message: "Phone number can only contain numbers",
                },
                validate: async (value) => {
                  const guests = await getGuests();
                  const phoneExists = guests.some(
                    (guest) => guest.nationalID === value
                  );
                  return (
                    !phoneExists || "This phone number is already registered"
                  );
                },
              })}
            />
          </FormRow>

          <FormRow>
            <Button
              variation="secondary"
              type="submit"
              disabled={isCreatingGuest}
            >
              {isCreatingGuest ? "Creating..." : "Create Guest"}
            </Button>
          </FormRow>
        </Form>
      ) : (
        <Form onSubmit={handleSubmit(onSubmit)}>
          <Heading> Create Booking</Heading>
          <FormRow label="Select Cabin" error={errors?.cabinId?.message}>
            <Select
              id="cabinId"
              disabled={isCreatingBooking}
              {...register("cabinId", {
                required: "This field is required",
                valueAsNumber: true,
              })}
            >
              <option value="" disabled>
                Select a cabin...
              </option>
              {cabins?.map((cabin) => (
                <option value={cabin.id} key={cabin.id}>
                  {cabin.name} (Capacity: {cabin.maxCapacity} guests)
                </option>
              ))}
            </Select>
          </FormRow>

          <FormRow label="Start Date" error={errors?.startDate?.message}>
            <Input
              type="date"
              id="startDate"
              disabled={isCreatingBooking}
              {...register("startDate", {
                required: "This field is required",
                validate: (value) =>
                  new Date(value) >= new Date().setHours(0, 0, 0, 0) ||
                  "Start date cannot be in the past",
              })}
            />
          </FormRow>

          <FormRow label="End Date" error={errors?.endDate?.message}>
            <Input
              type="date"
              id="endDate"
              disabled={isCreatingBooking}
              {...register("endDate", {
                required: "This field is required",
                validate: (value) =>
                  new Date(value) > new Date(watchStartDate) ||
                  "End date must be after start date",
              })}
            />
          </FormRow>

          <FormRow label="Number of Guests" error={errors?.numGuests?.message}>
            <Input
              type="number"
              id="numGuests"
              disabled={isCreatingBooking}
              {...register("numGuests", {
                required: "This field is required",
                min: {
                  value: 1,
                  message: "Minimum 1 guest required",
                },
                max: {
                  value: maxCapacity,
                  message: `This cabin can accommodate maximum ${maxCapacity} guests`,
                },
                valueAsNumber: true,
              })}
            />
          </FormRow>

          <FormRow label="Include Breakfast?">
            <input
              type="checkbox"
              id="hasBreakfast"
              disabled={isCreatingBooking}
              {...register("hasBreakfast")}
            />
          </FormRow>

          <FormRow label="Notes">
            <Textarea
              type="number"
              id="observations"
              disabled={isCreatingBooking}
              {...register("observations")}
            />
          </FormRow>

          <FormRow>
            <div
              style={{
                display: "flex",
                flexDirection: "column",
                gap: "1.2rem",
              }}
            >
              <div>
                <span>Cabin Price: </span>
                <span>{formatCurrency(cabinPriceTotal)}</span>
              </div>
              {watchHasBreakfast && (
                <div>
                  <span>Breakfast Price: </span>
                  <span>{formatCurrency(breakfastPriceTotal)}</span>
                </div>
              )}
              <div>
                <span>Total Price: </span>
                <span>{formatCurrency(totalPrice)}</span>
              </div>
            </div>
          </FormRow>

          <FormRow>
            <Button
              variation="secondary"
              type="button"
              onClick={() => {
                reset();
                setGuestId(null);
              }}
            >
              Cancel
            </Button>
            <Button disabled={isCreatingBooking}>
              {isCreatingBooking ? "Creating..." : "Create Booking"}
            </Button>
          </FormRow>
        </Form>
      )}
    </div>
  );
}

export default BookingForm;
