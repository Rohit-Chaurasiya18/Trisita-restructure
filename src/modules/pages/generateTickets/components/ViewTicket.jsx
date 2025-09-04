import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate, useParams } from "react-router-dom";
import { getTicketDetails, markAsClosed, sendTicketMessage } from "../../slice";

// MUI Timeline imports
import Timeline from "@mui/lab/Timeline";
import TimelineItem from "@mui/lab/TimelineItem";
import TimelineSeparator from "@mui/lab/TimelineSeparator";
import TimelineConnector from "@mui/lab/TimelineConnector";
import TimelineContent from "@mui/lab/TimelineContent";
import TimelineDot from "@mui/lab/TimelineDot";
import Typography from "@mui/material/Typography";
import SkeletonLoader from "@/components/common/loaders/Skeleton";
import { Button, TextField } from "@mui/material";
import RefreshIcon from "@mui/icons-material/Refresh";
import { toast } from "react-toastify";
import { somethingWentWrong } from "@/constants/SchemaValidation";
import CommonButton from "@/components/common/buttons/CommonButton";
import routesConstants from "@/routes/routesConstants";
import { userType } from "@/constants";

const ViewTicket = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { ticketDetails, ticketDetailsLoading, userDetail } = useSelector(
    (state) => ({
      ticketDetails: state.pages.ticketDetails,
      ticketDetailsLoading: state.pages.ticketDetailsLoading,
      userDetail: state?.login?.userDetail,
    })
  );
  const { ticketId } = useParams();
  const [message, setMessage] = useState("");

  useEffect(() => {
    dispatch(getTicketDetails(ticketId));
  }, [dispatch, ticketId]);

  const renderAttachment = (url) => {
    const fileExt = url.split(".").pop().toLowerCase();
    if (["jpg", "jpeg", "png", "gif", "webp"].includes(fileExt)) {
      return (
        <img
          src={url}
          alt="ticket attachment"
          className="img-fluid rounded border"
          style={{ maxWidth: "200px", marginRight: "10px" }}
        />
      );
    } else if (["mp4", "webm", "ogg"].includes(fileExt)) {
      return (
        <video
          controls
          className="rounded border"
          style={{ maxWidth: "300px", marginRight: "10px" }}
        >
          <source src={url} type={`video/${fileExt}`} />
          Your browser does not support the video tag.
        </video>
      );
    } else {
      return (
        <a href={url} target="_blank" rel="noopener noreferrer">
          Download File
        </a>
      );
    }
  };

  const handleSendMessage = () => {
    if (!message.trim()) return;

    dispatch(sendTicketMessage({ ticket_id: ticketId, message: message })).then(
      (res) => {
        if (res?.payload?.status === 200 || res?.payload?.status === 201) {
          setMessage("");
          dispatch(getTicketDetails(ticketId));
        } else {
          toast.error(somethingWentWrong);
        }
      }
    );
  };
  return (
    <>
      {ticketDetailsLoading ? (
        <SkeletonLoader />
      ) : (
        <div className="">
          {/* Header */}
          <div className="mb-4">
            <div className="commom-header-title mb-0">View Ticket</div>
            <span className="common-breadcrum-msg">
              Check the status of ticket
            </span>
          </div>
          {/* Ticket Card */}
          <div className="row g-0 border rounded shadow-sm">
            <div className="col-md-12 border-end p-3 bg-light">
              <div className="d-flex justify-content-between align-items-center flex-wrap">
                <h6 className="fw-bold text-primary">
                  Ticket Number#:{" "}
                  <span className="text-dark">{ticketDetails?.ticket_no}</span>
                </h6>
                <div className="d-flex gap-3 flex-wrap align-items-center">
                  <span className="badge bg-light text-danger border border-danger">
                    {ticketDetails?.ticket_level}
                  </span>
                  {ticketDetails?.ticket_status !== "closed" &&
                    userDetail?.user_type !== userType.client && (
                      <CommonButton
                        className="closed-ticket"
                        onClick={() => {
                          dispatch(markAsClosed(ticketId)).then((res) => {
                            if (res?.payload?.status === 200) {
                              toast.success("Ticket closed successfully.");
                              navigate(routesConstants.GENERATE_TICKET);
                            }
                          });
                        }}
                      >
                        Mark as closed
                      </CommonButton>
                    )}
                </div>
              </div>

              <div className="d-flex justify-content-between flex-wrap">
                <div className="w-50">
                  <div className="d-flex">
                    <label className="col-md-6">
                      <b>Contact Person Name</b>
                    </label>
                    <p className="col-md-6">
                      {ticketDetails?.contect_person_name || "N/A"}
                    </p>
                  </div>
                  <div className="d-flex">
                    <label className="col-md-6">
                      <b>Contact Person Phone</b>
                    </label>
                    <p className="col-md-6">
                      {ticketDetails?.contect_person_phone || "N/A"}
                    </p>
                  </div>
                  <div className="d-flex">
                    <label className="col-md-6">
                      <b>Contact Person Email</b>
                    </label>
                    <p className="col-md-6">
                      {ticketDetails?.contect_person_email || "N/A"}
                    </p>
                  </div>
                  <div className="d-flex">
                    <label className="col-md-6">
                      <b>Issue Type</b>
                    </label>
                    <p className="col-md-6">
                      {ticketDetails?.issue_name || "N/A"}
                    </p>
                  </div>
                  <div className="d-flex">
                    <label className="col-md-6">
                      <b>Priority</b>
                    </label>
                    <p className="col-md-6">
                      {ticketDetails?.priority || "N/A"}
                    </p>
                  </div>
                </div>
                {/* <div className="w-50">
              <div className="d-flex">
                <label className="col-md-6">Name</label>
                <p className="col-md-6">Test</p>
              </div>
            </div> */}
              </div>

              {/* Attachments */}
              <div className="mt-3">
                <label>
                  <b>Attachments</b>
                </label>
                <div className="d-flex flex-wrap mt-2">
                  {ticketDetails?.ticketimage?.length > 0 ? (
                    ticketDetails.ticketimage.map((item) => (
                      <div key={item.id} className="me-2 mb-2">
                        {renderAttachment(item.attachment)}
                      </div>
                    ))
                  ) : (
                    <p>No attachments</p>
                  )}
                </div>
              </div>
            </div>
          </div>
          {/* Timeline Section */}
          <div className="mt-4">
            <div className="d-flex justify-content-between align-items-center mb-2">
              <h6 className="fw-bold mb-0">Timeline</h6>
              <Button
                variant="outlined"
                size="small"
                startIcon={<RefreshIcon />}
                onClick={() => dispatch(getTicketDetails(ticketId))}
              >
                Refresh
              </Button>
            </div>
            {ticketDetails?.timeline?.length > 0 ? (
              <Timeline position="right" className="activity-log-tickets">
                {ticketDetails.timeline.map((event, index) => (
                  <TimelineItem key={index}>
                    <TimelineSeparator>
                      <TimelineDot color="primary" />
                      {index < ticketDetails.timeline.length - 1 && (
                        <TimelineConnector />
                      )}
                    </TimelineSeparator>
                    <TimelineContent>
                      {event.type === "chat" ? (
                        // ✅ Chat-style UI
                        <div
                          className="border rounded p-2 mb-2"
                          style={{ background: "#fff3e0" }}
                        >
                          <Typography variant="body2" className="fw-bold">
                            {event.sender?.first_name} {event.sender?.last_name}{" "}
                            <span
                              className="text-muted"
                              style={{ fontSize: "0.8rem" }}
                            >
                              {event.timestamp}
                            </span>
                          </Typography>
                          <Typography
                            variant="body2"
                            dangerouslySetInnerHTML={{ __html: event.message }}
                          />
                        </div>
                      ) : (
                        // ✅ Default timeline UI
                        <>
                          <Typography
                            variant="body2"
                            dangerouslySetInnerHTML={{ __html: event.message }}
                          />
                          <Typography variant="caption" color="textSecondary">
                            {event.timestamp}
                          </Typography>
                        </>
                      )}
                    </TimelineContent>
                  </TimelineItem>
                ))}
              </Timeline>
            ) : (
              <p>No timeline events</p>
            )}
          </div>

          {/* Chat Input Section */}
          {ticketDetails?.ticket_status !== "closed" && (
            <div className="mt-4 border-top pt-3">
              <h6 className="fw-bold mb-2">Send a Message</h6>
              <div className="d-flex gap-2">
                <TextField
                  fullWidth
                  multiline
                  minRows={1}
                  maxRows={4}
                  placeholder="Type your message..."
                  value={message}
                  onChange={(e) => setMessage(e.target.value)}
                />
                <Button
                  variant="contained"
                  color="primary"
                  onClick={handleSendMessage}
                  disabled={!message.trim()}
                >
                  Send
                </Button>
              </div>
            </div>
          )}
        </div>
      )}
    </>
  );
};

export default ViewTicket;
