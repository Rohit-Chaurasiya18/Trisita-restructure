import { useEffect, useMemo, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { getAllUserList, updateUserPermission } from "../slice";
import {
  Autocomplete,
  TextField,
  Card,
  CardContent,
  Typography,
  FormGroup,
  FormControlLabel,
  Switch,
} from "@mui/material";
import { moduleId } from "@/constants/ConstantConfig";
import CustomSweetAlert from "@/components/common/customSweetAlert/CustomSweetAlert";
import { toast } from "react-toastify";
import { userType } from "@/constants";
import CommonAutocomplete from "@/components/common/dropdown/CommonAutocomplete";

const PermissionProfile = () => {
  const dispatch = useDispatch();
  const { allUserList, allUserListLoading } = useSelector((state) => ({
    allUserList: state?.superAdminConsole?.allUserList,
    allUserListLoading: state?.superAdminConsole?.allUserListLoading,
  }));
  const [userList, setUserList] = useState([]);

  const [selectedUser, setSelectedUser] = useState(null);
  const isClient = useMemo(
    () => selectedUser?.user_type === userType.client,
    [selectedUser]
  );

  // All permissions
  const [permissions, setPermissions] = useState({
    dashboard: false,
    // Customer Success APIs
    insightMetrics: false,
    insightMetricsV2: false,
    rorAlert: false,
    getUsage: false,
    licenseOptimization: false,

    // Sales API
    account: false,
    addAccount: false,
    thirdPartyAccount: false,
    renewalOpportunity: false,
    newOpportunity: false,
    newQuotation: false,

    // Subscription API
    subscription: false,
    newSubscription: false,
    deletedSubscription: false,
    changeLogComparison: false,
    subscriptionDataComparison: false,

    // Order Loading API
    orderLoadingHO: false,
    orderLoadingDistributor: false,
    raOrder: false,

    // Data
    manageTeam: false,
    manageTemplate: false,
    upload: false,
    downloadHistory: false,
    uploadHistory: false,
    productMaster: false,
    product: false,
    runCampaign: false,
    campaignHistory: false,
    contactsInfo: false,
    renewEmailHistory: false,

    // Pages
    generateTicket: false,
    calendar: false,
    faqPage: false,

    // Knowledge Portal
    learningLab: false,
    productKnowledge: false,
    requestTraningSession: false,
  });

  const handleToggle = (name, id) => {
    CustomSweetAlert(
      "Update Permission?",
      "Are you sure, you want to update the permision?",
      "Warning",
      true,
      "Yes, Update",
      "Cancel",
      (result) => {
        if (result.isConfirmed) {
          dispatch(
            updateUserPermission({
              user_id: selectedUser?.id,
              module_id: id,
            })
          ).then((res) => {
            if (res?.payload?.status === 200) {
              toast.success(res?.payload?.data?.message);
              setPermissions((prev) => ({
                ...prev,
                [name]: !prev[name],
              }));
              if (name === "account") {
                if (permissions?.addAccount && permissions?.account) {
                  setPermissions((prev) => ({
                    ...prev,
                    addAccount: false,
                  }));
                }
              }
              dispatch(getAllUserList());
            }
          });
        }
      }
    );
  };

  useEffect(() => {
    dispatch(getAllUserList());
  }, [dispatch]);

  const handleUserSelect = (newValue) => {
    // Reset everything to false first
    const resetPermissions = {
      dashboard: false,
      insightMetrics: false,
      insightMetricsV2: false,
      rorAlert: false,
      getUsage: false,
      licenseOptimization: false,
      account: false,
      addAccount: false,
      thirdPartyAccount: false,
      renewalOpportunity: false,
      newOpportunity: false,
      newQuotation: false,
      subscription: false,
      newSubscription: false,
      deletedSubscription: false,
      changeLogComparison: false,
      subscriptionDataComparison: false,
      orderLoadingHO: false,
      orderLoadingDistributor: false,
      raOrder: false,
      manageTeam: false,
      manageTemplate: false,
      upload: false,
      downloadHistory: false,
      uploadHistory: false,
      productMaster: false,
      product: false,
      runCampaign: false,
      campaignHistory: false,
      contactsInfo: false,
      renewEmailHistory: false,
      generateTicket: false,
      calendar: false,
      faqPage: false,
      learningLab: false,
      productKnowledge: false,
      requestTraningSession: false,
    };

    if (newValue?.module_assigned_id?.length > 0) {
      // Copy reset values
      const updated = { ...resetPermissions };

      // Turn ON only those included in module_assigned_id
      newValue.module_assigned_id.forEach((item) => {
        switch (item) {
          case moduleId.Dashboard:
            updated.dashboard = true;
            break;
          case moduleId.InsightMetrics:
            updated.insightMetrics = true;
            break;
          case moduleId.InsightMetricsV2:
            updated.insightMetricsV2 = true;
            break;
          case moduleId.RorAlert:
            updated.rorAlert = true;
            break;
          case moduleId.GetUsages:
            updated.getUsage = true;
            break;
          case moduleId.LicenseOptimization:
            updated.licenseOptimization = true;
            break;
          case moduleId.Account:
            updated.account = true;
            break;
          case moduleId.AddAccount:
            updated.addAccount = true;
            break;
          case moduleId.ThirdPartyAccount:
            updated.thirdPartyAccount = true;
            break;
          case moduleId.RenewalOpportunity:
            updated.renewalOpportunity = true;
            break;
          case moduleId.NewOpportunity:
            updated.newOpportunity = true;
            break;
          case moduleId.NewQuotation:
            updated.newQuotation = true;
            break;
          case moduleId.Subscription:
            updated.subscription = true;
            break;
          case moduleId.NewSubscription:
            updated.newSubscription = true;
            break;
          case moduleId.DeletedSubscription:
            updated.deletedSubscription = true;
            break;
          case moduleId.ChangeLogComparison:
            updated.changeLogComparison = true;
            break;
          case moduleId.SubscriptionDataComparison:
            updated.subscriptionDataComparison = true;
            break;
          case moduleId.OrderLoadingHO:
            updated.orderLoadingHO = true;
            break;
          case moduleId.OrderLoadingDistributor:
            updated.orderLoadingDistributor = true;
            break;
          case moduleId.RAOrder:
            updated.raOrder = true;
            break;
          case moduleId.ManageTeam:
            updated.manageTeam = true;
            break;
          case moduleId.ManageTemplate:
            updated.manageTemplate = true;
            break;
          case moduleId.Upload:
            updated.upload = true;
            break;
          case moduleId.DownloadHistory:
            updated.downloadHistory = true;
            break;
          case moduleId.UploadHistory:
            updated.uploadHistory = true;
            break;
          case moduleId.ProductMaster:
            updated.productMaster = true;
            break;
          case moduleId.Product:
            updated.product = true;
            break;
          case moduleId.RunCampaign:
            updated.runCampaign = true;
            break;
          case moduleId.CampaignHistory:
            updated.campaignHistory = true;
            break;
          case moduleId.ContactInformation:
            updated.contactsInfo = true;
            break;
          case moduleId.RenewEmailHistory:
            updated.renewEmailHistory = true;
            break;
          case moduleId.GenerateTicket:
            updated.generateTicket = true;
            break;
          case moduleId.Calendar:
            updated.calendar = true;
            break;
          case moduleId.Faqs:
            updated.faqPage = true;
            break;
          case moduleId.ProductKnowledge:
            updated.productKnowledge = true;
            break;
          case moduleId.LearningLab:
            updated.learningLab = true;
            break;
          case moduleId.RequestTrainingSession:
            updated.requestTraningSession = true;
            break;
          default:
            break;
        }
      });

      setPermissions(updated);
    } else {
      // If no permissions, keep all false
      setPermissions(resetPermissions);
    }
  };
  return (
    <>
      <div className="mb-5">
        <div className="commom-header-title mb-0">Profile Permission</div>
        <span className="common-breadcrum-msg">
          Update the permissions of user
        </span>
      </div>

      {/* User Dropdown */}
      <div className="d-flex gap-3 flex-wrap">
        <CommonAutocomplete
          onChange={(event, newValue) => {
            if (newValue?.value) {
              setUserList(
                allUserList?.filter(
                  (item) => item?.user_type === newValue?.value
                )
              );
              setSelectedUser(null);
            } else {
              setUserList([]);
              setSelectedUser(null);
            }
          }}
          options={[
            { value: userType.primaryAdmin, label: "Primary Admin" },
            { value: userType.bdManager, label: "BD Manager" },
            { value: userType.client, label: "Client" },
          ]}
          label="Select a User Type"
        />
        <Autocomplete
          value={selectedUser}
          onChange={(event, newValues) => {
            setSelectedUser(newValues);
            handleUserSelect(newValues);
          }}
          options={userList}
          getOptionLabel={(option) =>
            `${option?.first_name} ${option?.last_name}  (${option?.user_type})`
          }
          loading={allUserListLoading}
          disabled={allUserListLoading}
          sx={{ width: 300 }}
          renderInput={(params) => (
            <TextField
              {...params}
              label="Select a User"
              variant="outlined"
              InputProps={{
                ...params.InputProps,
                endAdornment: (
                  <>
                    {params.InputProps.endAdornment}
                    {allUserListLoading && (
                      <Typography variant="body2" color="textSecondary">
                        Loading...
                      </Typography>
                    )}
                  </>
                ),
              }}
            />
          )}
        />
      </div>

      {/* Permission Sections */}
      {selectedUser?.id && (
        <div>
          <Card sx={{ borderRadius: 2, boxShadow: 3, mt: 3, p: 2 }}>
            <CardContent>
              <Typography variant="h6" gutterBottom>
                Permissions
              </Typography>

              {/* Flex container for sections */}
              <div className="permission-profile-container">
                {/* Customer Success API */}
                <div>
                  <Typography variant="subtitle1" sx={{ fontWeight: "bold" }}>
                    Trisita Customer Success APIs
                  </Typography>
                  <FormGroup>
                    <FormControlLabel
                      control={
                        <Switch
                          checked={permissions.insightMetrics}
                          onChange={() =>
                            handleToggle(
                              "insightMetrics",
                              moduleId.InsightMetrics
                            )
                          }
                        />
                      }
                      label="Insight Metrics"
                    />
                    <FormControlLabel
                      control={
                        <Switch
                          checked={permissions.insightMetricsV2}
                          onChange={() =>
                            handleToggle(
                              "insightMetricsV2",
                              moduleId.InsightMetricsV2
                            )
                          }
                        />
                      }
                      label="Insight Metrics V2"
                    />
                    <FormControlLabel
                      control={
                        <Switch
                          checked={permissions.rorAlert}
                          onChange={() => {
                            if (isClient) {
                              return;
                            }
                            handleToggle("rorAlert", moduleId.RorAlert);
                          }}
                          disabled={isClient}
                        />
                      }
                      label="ROR / LTC Alert"
                    />
                    <FormControlLabel
                      control={
                        <Switch
                          checked={permissions.getUsage}
                          onChange={() =>
                            handleToggle("getUsage", moduleId.GetUsages)
                          }
                        />
                      }
                      label="Get Usage"
                    />
                    <FormControlLabel
                      control={
                        <Switch
                          checked={permissions.licenseOptimization}
                          onChange={() =>
                            handleToggle(
                              "licenseOptimization",
                              moduleId.LicenseOptimization
                            )
                          }
                        />
                      }
                      label="License Optimization"
                    />
                  </FormGroup>
                </div>

                {/* Sales API */}
                <div>
                  <Typography variant="subtitle1" sx={{ fontWeight: "bold" }}>
                    Trisita Sales API
                  </Typography>
                  <FormGroup>
                    <FormControlLabel
                      control={
                        <Switch
                          checked={permissions.account}
                          onChange={() =>
                            handleToggle("account", moduleId.Account)
                          }
                        />
                      }
                      label="Account"
                    />
                    <FormControlLabel
                      control={
                        <Switch
                          checked={permissions.addAccount}
                          onChange={() => {
                            if (isClient) {
                              return;
                            }
                            handleToggle("addAccount", moduleId.AddAccount);
                          }}
                          disabled={isClient}
                        />
                      }
                      label="Add Account"
                    />
                    <FormControlLabel
                      control={
                        <Switch
                          checked={permissions.thirdPartyAccount}
                          onChange={() => {
                            if (isClient) {
                              return;
                            }
                            handleToggle(
                              "thirdPartyAccount",
                              moduleId.ThirdPartyAccount
                            );
                          }}
                          disabled={isClient}
                        />
                      }
                      label="Third Party Account"
                    />
                    <FormControlLabel
                      control={
                        <Switch
                          checked={permissions.renewalOpportunity}
                          onChange={() => {
                            if (isClient) {
                              return;
                            }
                            handleToggle(
                              "renewalOpportunity",
                              moduleId.RenewalOpportunity
                            );
                          }}
                          disabled={isClient}
                        />
                      }
                      label="Renewal Opportunity"
                    />
                    <FormControlLabel
                      control={
                        <Switch
                          checked={permissions.newOpportunity}
                          onChange={() => {
                            if (isClient) {
                              return;
                            }
                            handleToggle(
                              "newOpportunity",
                              moduleId.NewOpportunity
                            );
                          }}
                          disabled={isClient}
                        />
                      }
                      label="New Opportunity"
                    />
                    <FormControlLabel
                      control={
                        <Switch
                          checked={permissions.newQuotation}
                          onChange={() => {
                            if (isClient) {
                              return;
                            }
                            handleToggle("newQuotation", moduleId.NewQuotation);
                          }}
                          disabled={isClient}
                        />
                      }
                      label="New Quotation"
                    />
                  </FormGroup>
                </div>

                {/* Subscription API */}
                <div>
                  <Typography variant="subtitle1" sx={{ fontWeight: "bold" }}>
                    Trisita Subscription API
                  </Typography>
                  <FormGroup>
                    <FormControlLabel
                      control={
                        <Switch
                          checked={permissions.subscription}
                          onChange={() =>
                            handleToggle("subscription", moduleId.Subscription)
                          }
                        />
                      }
                      label="Subscription"
                    />
                    <FormControlLabel
                      control={
                        <Switch
                          checked={permissions.newSubscription}
                          onChange={() =>
                            handleToggle(
                              "newSubscription",
                              moduleId.NewSubscription
                            )
                          }
                        />
                      }
                      label="New Subscription"
                    />
                    <FormControlLabel
                      control={
                        <Switch
                          checked={permissions.deletedSubscription}
                          onChange={() =>
                            handleToggle(
                              "deletedSubscription",
                              moduleId.DeletedSubscription
                            )
                          }
                        />
                      }
                      label="Deleted Subscription"
                    />
                    <FormControlLabel
                      control={
                        <Switch
                          checked={permissions.changeLogComparison}
                          onChange={() => {
                            if (isClient) {
                              return;
                            }
                            handleToggle(
                              "changeLogComparison",
                              moduleId.ChangeLogComparison
                            );
                          }}
                          disabled={isClient}
                        />
                      }
                      label="Change Log Comparison"
                    />
                    <FormControlLabel
                      control={
                        <Switch
                          checked={permissions.subscriptionDataComparison}
                          onChange={() => {
                            if (isClient) {
                              return;
                            }
                            handleToggle(
                              "subscriptionDataComparison",
                              moduleId.SubscriptionDataComparison
                            );
                          }}
                          disabled={isClient}
                        />
                      }
                      label="Subscription Data Comparison"
                    />
                  </FormGroup>
                </div>

                {/* Order Loading API */}
                <div>
                  <Typography variant="subtitle1" sx={{ fontWeight: "bold" }}>
                    Trisita Order Loading API
                  </Typography>
                  <FormGroup>
                    <FormControlLabel
                      control={
                        <Switch
                          checked={permissions.orderLoadingHO}
                          onChange={() => {
                            if (isClient) {
                              return;
                            }
                            handleToggle(
                              "orderLoadingHO",
                              moduleId.OrderLoadingHO
                            );
                          }}
                          disabled={isClient}
                        />
                      }
                      label="Order Loading to HO"
                    />
                    <FormControlLabel
                      control={
                        <Switch
                          checked={permissions.orderLoadingDistributor}
                          onChange={() => {
                            if (isClient) {
                              return;
                            }
                            handleToggle(
                              "orderLoadingDistributor",
                              moduleId.OrderLoadingDistributor
                            );
                          }}
                          disabled={isClient}
                        />
                      }
                      label="Order Loading to Distributor"
                    />
                    <FormControlLabel
                      control={
                        <Switch
                          checked={permissions.raOrder}
                          onChange={() => {
                            if (isClient) {
                              return;
                            }
                            handleToggle("raOrder", moduleId.RAOrder);
                          }}
                          disabled={isClient}
                        />
                      }
                      label="RA Order"
                    />
                  </FormGroup>
                </div>

                {/* Data */}
                <div>
                  <Typography variant="subtitle1" sx={{ fontWeight: "bold" }}>
                    Data
                  </Typography>
                  <FormGroup>
                    <FormControlLabel
                      control={
                        <Switch
                          checked={permissions.manageTeam}
                          onChange={() => {
                            if (isClient) {
                              return;
                            }
                            handleToggle("manageTeam", moduleId.ManageTeam);
                          }}
                          disabled={isClient}
                        />
                      }
                      label="Manage Team"
                    />
                    <FormControlLabel
                      control={
                        <Switch
                          checked={permissions.manageTemplate}
                          onChange={() => {
                            if (isClient) {
                              return;
                            }
                            handleToggle(
                              "manageTemplate",
                              moduleId.ManageTemplate
                            );
                          }}
                          disabled={isClient}
                        />
                      }
                      label="Manage Template"
                    />
                    <FormControlLabel
                      control={
                        <Switch
                          checked={permissions.upload}
                          onChange={() => {
                            if (isClient) {
                              return;
                            }
                            handleToggle("upload", moduleId.Upload);
                          }}
                          disabled={isClient}
                        />
                      }
                      label="Upload"
                    />
                    <FormControlLabel
                      control={
                        <Switch
                          checked={permissions.downloadHistory}
                          onChange={() => {
                            if (isClient) {
                              return;
                            }
                            handleToggle(
                              "downloadHistory",
                              moduleId.DownloadHistory
                            );
                          }}
                          disabled={isClient}
                        />
                      }
                      label="Download History"
                    />
                    <FormControlLabel
                      control={
                        <Switch
                          checked={permissions.uploadHistory}
                          onChange={() => {
                            if (isClient) {
                              return;
                            }
                            handleToggle(
                              "uploadHistory",
                              moduleId.UploadHistory
                            );
                          }}
                          disabled={isClient}
                        />
                      }
                      label="Upload History"
                    />
                    <FormControlLabel
                      control={
                        <Switch
                          checked={permissions.productMaster}
                          onChange={() => {
                            if (isClient) {
                              return;
                            }
                            handleToggle(
                              "productMaster",
                              moduleId.ProductMaster
                            );
                          }}
                          disabled={isClient}
                        />
                      }
                      label="Product Master"
                    />
                    <FormControlLabel
                      control={
                        <Switch
                          checked={permissions.product}
                          onChange={() => {
                            if (isClient) {
                              return;
                            }
                            handleToggle("product", moduleId.Product);
                          }}
                          disabled={isClient}
                        />
                      }
                      label="Product"
                    />
                    <FormControlLabel
                      control={
                        <Switch
                          checked={permissions.runCampaign}
                          onChange={() => {
                            if (isClient) {
                              return;
                            }
                            handleToggle("runCampaign", moduleId.RunCampaign);
                          }}
                          disabled={isClient}
                        />
                      }
                      label="Run Campaign"
                    />
                    <FormControlLabel
                      control={
                        <Switch
                          checked={permissions.campaignHistory}
                          onChange={() => {
                            if (isClient) {
                              return;
                            }
                            handleToggle(
                              "campaignHistory",
                              moduleId.CampaignHistory
                            );
                          }}
                          disabled={isClient}
                        />
                      }
                      label="Campaign History"
                    />
                    <FormControlLabel
                      control={
                        <Switch
                          checked={permissions.contactsInfo}
                          onChange={() => {
                            if (isClient) {
                              return;
                            }
                            handleToggle(
                              "contactsInfo",
                              moduleId.ContactInformation
                            );
                          }}
                          disabled={isClient}
                        />
                      }
                      label="Contacts Information"
                    />
                    <FormControlLabel
                      control={
                        <Switch
                          checked={permissions.renewEmailHistory}
                          onChange={() => {
                            if (isClient) {
                              return;
                            }
                            handleToggle(
                              "renewEmailHistory",
                              moduleId.RenewEmailHistory
                            );
                          }}
                          disabled={isClient}
                        />
                      }
                      label="Renew Email History"
                    />
                  </FormGroup>
                </div>

                {/* Pages */}
                <div>
                  <Typography variant="subtitle1" sx={{ fontWeight: "bold" }}>
                    Pages
                  </Typography>
                  <FormGroup>
                    <FormControlLabel
                      control={
                        <Switch
                          checked={permissions.generateTicket}
                          onChange={() =>
                            handleToggle(
                              "generateTicket",
                              moduleId.GenerateTicket
                            )
                          }
                        />
                      }
                      label="Generate Ticket"
                    />
                    <FormControlLabel
                      control={
                        <Switch
                          checked={permissions.calendar}
                          onChange={() =>
                            handleToggle("calendar", moduleId.Calendar)
                          }
                        />
                      }
                      label="Calendar"
                    />
                    <FormControlLabel
                      control={
                        <Switch
                          checked={permissions.faqPage}
                          onChange={() =>
                            handleToggle("faqPage", moduleId.Faqs)
                          }
                        />
                      }
                      label="FAQ Page"
                    />
                  </FormGroup>
                </div>
                <div>
                  <Typography variant="subtitle1" sx={{ fontWeight: "bold" }}>
                    Knowledge Portal
                  </Typography>
                  <FormGroup>
                    <FormControlLabel
                      control={
                        <Switch
                          checked={permissions.learningLab}
                          onChange={() => {
                            if (isClient) {
                              handleToggle("learningLab", moduleId.LearningLab);
                            }
                          }}
                          disabled={!isClient}
                        />
                      }
                      label="Learning Lab"
                    />
                    <FormControlLabel
                      control={
                        <Switch
                          checked={permissions.productKnowledge}
                          onChange={() => {
                            if (isClient) {
                              handleToggle(
                                "productKnowledge",
                                moduleId.ProductKnowledge
                              );
                            }
                          }}
                          disabled={!isClient}
                        />
                      }
                      label="Product Knowledge"
                    />
                    <FormControlLabel
                      control={
                        <Switch
                          checked={permissions.requestTraningSession}
                          onChange={() => {
                            if (isClient) {
                              handleToggle(
                                "requestTraningSession",
                                moduleId.RequestTrainingSession
                              );
                            }
                          }}
                          disabled={!isClient}
                        />
                      }
                      label="Request Training Session"
                    />
                  </FormGroup>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      )}
    </>
  );
};

export default PermissionProfile;
