import CommonButton from "@/components/common/buttons/CommonButton";
import CommonModal from "@/components/common/modal/CommonModal";
import { useEffect, useState } from "react";
import AddEditTicket from "../components/AddEditTicket";
import { useDispatch, useSelector } from "react-redux";
import { getTicketList } from "../../slice";
import SkeletonLoader from "@/components/common/loaders/Skeleton";
import CommonTable from "@/components/common/dataTable/CommonTable";
import routesConstants from "@/routes/routesConstants";
import { useNavigate } from "react-router-dom";

const GenerateTicket = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const [modal, setModal] = useState({ isOpen: false, type: null });
  const [filteredData, setFilteredData] = useState([]);
  const { userDetail, ticketListing, ticketListingLoading } = useSelector(
    (state) => ({
      userDetail: state?.profile?.userDetail,
      ticketListing: state?.pages?.ticketListing,
      ticketListingLoading: state?.pages?.ticketListingLoading,
    })
  );
  useEffect(() => {
    setFilteredData(ticketListing);
  }, [ticketListing]);

  useEffect(() => {
    dispatch(getTicketList());
  }, []);

  const columns = [
    { field: "ticket_no", headerName: "Ticket Number", width: 200 },
    {
      field: "subscriptionReferenceNumber",
      headerName: "Subscription Reference Number",
      width: 300,
    },
    { field: "productLine", headerName: "Product Line", width: 250 },
    { field: "ticket_raised_by_name", headerName: "Raised By", width: 200 },
    { field: "priority", headerName: "Priority", width: 200 },
    { field: "account_name", headerName: "Account Name", width: 200 },
    { field: "issue_name", headerName: "Issue", width: 200 },
    { field: "ticket_status", headerName: "Status", width: 200 },
    {
      field: "view_progress",
      headerName: "View Progress",
      width: 200,
      renderCell: (params) => {
        return (
          <a
            onClick={() =>
              navigate(`${routesConstants?.GENERATE_TICKET}/${params?.id}`)
            }
            // target="_blank"
            className="text-decoration-underline cursor-pointer text-primary" 
          >
            View Progress
          </a>
        );
      },
    },
    {
      field: "sla_resolution_due",
      headerName: "Service Time",
      width: 200,
    },
    {
      field: "sla_response_due",
      headerName: "Response Time",
      width: 200,
    },
  ];

  return (
    <div>
      <div className="generate-ticket-header mb-5">
        <div>
          <div className="commom-header-title mb-0">Generate Ticket</div>
          <span className="common-breadcrum-msg">Manage your tickets</span>
        </div>
        <div className="product-master-filter">
          <CommonButton
            className="add-product-master"
            onClick={() => {
              setModal({ isOpen: true, type: 1 });
            }}
          >
            Generate Ticket
          </CommonButton>
        </div>
      </div>
      <div className="generate-ticket-container">
        {ticketListingLoading ? (
          <SkeletonLoader />
        ) : (
          <CommonTable
            rows={filteredData}
            columns={columns}
            getRowId={(row) => row?.id}
            toolbar
            moduleName="Manage Team"
          />
        )}
      </div>
      <CommonModal
        title={modal?.type === 1 ? "Generate Ticket" : ""}
        isOpen={modal?.isOpen}
        handleClose={() => setModal({ isOpen: false, type: null })}
        // scrollable
      >
        <AddEditTicket
          handleClose={() => {
            setModal({ isOpen: false, type: null });
          }}
        />
      </CommonModal>
    </div>
  );
};

export default GenerateTicket;
