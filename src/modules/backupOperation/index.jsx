import CommonButton from "@/components/common/buttons/CommonButton";
import CommonDatePicker from "@/components/common/date/CommonDatePicker";
import { useState } from "react";
import { useDispatch } from "react-redux";
import { backupOperation, getDeletedData } from "../dashboard/slice";
import CustomSweetAlert from "@/components/common/customSweetAlert/CustomSweetAlert";
import moment from "moment";
import { toast } from "react-toastify";

const BackupOperation = () => {
  const dispatch = useDispatch();
  const [selectedData, setSelectedData] = useState("");
  const handleTriger = () => {
    dispatch(getDeletedData(selectedData)).then((res) => {
      let data = res?.payload?.data;
      if (res?.payload?.status === 200) {
        CustomSweetAlert(
          "Trigger Backup?",
          `Are you sure you want to trigger the backup? This may affect ChangeAlertSubscription ${
            data?.counts?.ChangeAlertSubscription
          }, ChangeLogSubscription ${
            data?.counts?.ChangeLogSubscription
          }, DeletedSubscription ${
            data?.counts?.DeletedSubscription
          }, NewedSubscription ${
            data?.counts?.NewedSubscription
          }, Notification ${data?.counts?.Notification}, and UserNotification ${
            data?.counts?.UserNotification
          } for data dated ${moment(data?.delete_date).format("DD/MM/YYYY")}.`,
          "Warning",
          true,
          "Yes, Trigger Backup",
          "Cancel",
          (result) => {
            if (result.isConfirmed) {
              dispatch(backupOperation({ target_date: selectedData })).then(
                (res) => {
                  if (res?.payload?.status === 200) {
                    toast.success("Trigger backup successfully.");
                    setSelectedData("");
                  }
                }
              );
            }
          }
        );
      }
    });
  };
  return (
    <>
      <div className="mb-5">
        <div className="commom-header-title mb-0">Backup Operation</div>
        <span className="common-breadcrum-msg">
          Trigger the backup for selected date.
        </span>
      </div>
      <div className="backup-container">
        <CommonDatePicker
          value={selectedData}
          onChange={(date) => setSelectedData(date)}
        />
        <CommonButton isDisabled={!selectedData} onClick={handleTriger}>
          Trigger Backup
        </CommonButton>
      </div>
    </>
  );
};

export default BackupOperation;
