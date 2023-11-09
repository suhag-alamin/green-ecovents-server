export type IBookingFilters = {
  status?: string;
};
export type IConfirmBooking = {
  amount: number;
  currency: string;
  paymentId: string;
  userId: string;
  bookingId: string;
};
