import { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { GetRenewalEmailSentList } from "../slice";

const RenewalEmailSent = () => {
  const dispatch = useDispatch();
  const { renewalEmailSentList, renewalEmailSentListLoading } = useSelector(
    (state) => ({
      renewalEmailSentList: state?.dashboard?.renewalEmailSentList,
      renewalEmailSentListLoading:
        state?.dashboard?.renewalEmailSentListLoading,
    })
  );
  console.log({ renewalEmailSentList, renewalEmailSentListLoading });
  useEffect(() => {
    dispatch(GetRenewalEmailSentList());
  }, []);
  return (
    <>
      <div>Renewal Email Sent</div>
    </>
  );
};
export default RenewalEmailSent;
