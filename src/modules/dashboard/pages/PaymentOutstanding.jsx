import { useDispatch, useSelector } from "react-redux";
import { GetPaymentOutstandingList } from "../slice";
import { useEffect } from "react";

const PaymentOutstanding = () => {
  const dispatch = useDispatch();
  const { paymentOutstandingList, paymentOutstandingListLoading } = useSelector(
    (state) => ({
      paymentOutstandingList: state?.dashboard?.paymentOutstandingList,
      paymentOutstandingListLoading:
        state?.dashboard?.paymentOutstandingListLoading,
    })
  );
  console.log({ paymentOutstandingList, paymentOutstandingListLoading });
  useEffect(() => {
    dispatch(GetPaymentOutstandingList());
  }, []);
  return (
    <>
      <div>Payment Outstanding</div>
    </>
  );
};
export default PaymentOutstanding;
