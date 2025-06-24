import { useDispatch, useSelector } from "react-redux";
import { GetPaymentOverdueList } from "../slice";
import { useEffect } from "react";

const PaymentOverdue = () => {
  const dispatch = useDispatch();
  const { paymentOverdueList, paymentOverdueListLoading } = useSelector(
    (state) => ({
      paymentOverdueList: state?.dashboard?.paymentOverdueList,
      paymentOverdueListLoading: state?.dashboard?.paymentOverdueListLoading,
    })
  );
  console.log({ paymentOverdueList, paymentOverdueListLoading });
  useEffect(() => {
    dispatch(GetPaymentOverdueList());
  }, []);
  return (
    <>
      <div>Payment Overdue</div>
    </>
  );
};
export default PaymentOverdue;
