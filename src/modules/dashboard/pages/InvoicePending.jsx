import { useDispatch, useSelector } from "react-redux";
import { GetInvoicePendingList } from "../slice";
import { useEffect } from "react";
const InvoicePending = () => {
  const dispatch = useDispatch();
  const { invoicePendingList, invoicePendingListLoading } = useSelector(
    (state) => ({
      invoicePendingList: state?.dashboard?.invoicePendingList,
      invoicePendingListLoading: state?.dashboard?.invoicePendingListLoading,
    })
  );
  console.log({ invoicePendingList, invoicePendingListLoading });
  useEffect(() => {
    dispatch(GetInvoicePendingList());
  }, []);
  return (
    <>
      <div>Invoice Pending</div>
    </>
  );
};
export default InvoicePending;
