import routesConstants from "@/routes/routesConstants";
import HomeOutlinedIcon from "@mui/icons-material/HomeOutlined";
import PeopleOutlinedIcon from "@mui/icons-material/PeopleOutlined";
import PersonOutlinedIcon from "@mui/icons-material/PersonOutlined";
import ContactsOutlinedIcon from "@mui/icons-material/ContactsOutlined";
import ReceiptOutlinedIcon from "@mui/icons-material/ReceiptOutlined";
import BorderAllIcon from "@mui/icons-material/BorderAll";
import Diversity3Icon from "@mui/icons-material/Diversity3";
import CalendarTodayOutlinedIcon from "@mui/icons-material/CalendarTodayOutlined";
import HelpOutlineOutlinedIcon from "@mui/icons-material/HelpOutlineOutlined";
import { userType } from ".";

export const navLinks = [
  {
    name: "Dashboard",
    href: routesConstants?.DASHBOARD,
    roles: [userType.superadmin, userType.client],
    iconUrl: <HomeOutlinedIcon />,
  },
  {
    name: "Trisita Customer Success APIs",
    isLabel: true,
    roles: [userType.superadmin, userType.client],
    item: [
      {
        itemName: "Insight Metrics",
        href: routesConstants?.INSIGHT_METRICS,
        iconUrl: <PeopleOutlinedIcon />,
        roles: [userType.superadmin, userType.client],
      },
      {
        itemName: "Insight Metrics V2",
        href: routesConstants?.INSIGHT_METRICS_V2,
        iconUrl: <PeopleOutlinedIcon />,
        roles: [userType.superadmin, userType.client],
      },
      {
        itemName: "ROR/LTC Alert",
        href: routesConstants?.ALERT_SUBSCRIPTION,
        iconUrl: <PeopleOutlinedIcon />,
        roles: [userType.superadmin],
      },
      {
        itemName: "Get Usage",
        href: routesConstants?.GET_USAGE,
        iconUrl: <ContactsOutlinedIcon />,
        roles: [userType.superadmin, userType.client],
      },
      {
        itemName: "License Optimization",
        href: routesConstants?.LICENSE_OPTIMIZATION,
        iconUrl: <ContactsOutlinedIcon />,
        roles: [userType.superadmin, userType.client],
      },
    ],
  },
  {
    name: "Trisita Sales API",
    isLabel: true,
    roles: [userType.superadmin, userType.client],
    item: [
      {
        itemName: "Account",
        href: routesConstants?.ACCOUNT,
        iconUrl: <PeopleOutlinedIcon />,
        roles: [userType.superadmin, userType.client],
      },
      {
        itemName: "Add Account",
        href: routesConstants?.ADD_ACCOUNT,
        iconUrl: <PeopleOutlinedIcon />,
        roles: [userType.superadmin],
      },
      {
        itemName: "Third Party Account",
        href: routesConstants?.THIRD_PARTY_ACCOUNT,
        iconUrl: <PeopleOutlinedIcon />,
        roles: [userType.superadmin],
      },
      {
        itemName: "Renewal Opportunity",
        href: routesConstants?.OPPORTUNITY,
        iconUrl: <ContactsOutlinedIcon />,
        roles: [userType.superadmin],
      },
      {
        itemName: "New Opportunity",
        href: routesConstants?.NEW_OPPORTUNITY,
        iconUrl: <ContactsOutlinedIcon />,
        roles: [userType.superadmin],
      },
      {
        itemName: "New Quotation",
        href: routesConstants?.NEW_QUOTATION,
        iconUrl: <ContactsOutlinedIcon />,
        roles: [userType.superadmin],
      },
    ],
  },
  {
    name: "Trisita Subscription API",
    isLabel: true,
    roles: [userType.superadmin, userType.client],
    item: [
      {
        itemName: "Subscription",
        href: routesConstants?.SUBSCRIPTION,
        iconUrl: <ReceiptOutlinedIcon />,
        roles: [userType.superadmin, userType.client],
      },
      {
        itemName: "New Subscription",
        href: routesConstants?.NEW_SUBSCRIPTION,
        iconUrl: <ContactsOutlinedIcon />,
        roles: [userType.superadmin, userType.client],
      },
      {
        itemName: "Deleted Subscription",
        href: routesConstants?.DELETED_SUBSCRIPTION,
        iconUrl: <ContactsOutlinedIcon />,
        roles: [userType.superadmin, userType.client],
      },
      {
        itemName: "Change Log Comparison",
        href: routesConstants?.CHANGED_LOG_SUBSCRIPTION,
        iconUrl: <ContactsOutlinedIcon />,
        roles: [userType.superadmin],
      },
      {
        itemName: "Subscription Data Comparison",
        href: routesConstants?.SUBSCRIPTION_DATA_COMPARISON,
        iconUrl: <ContactsOutlinedIcon />,
        roles: [userType.superadmin],
      },
    ],
  },
  {
    name: "Trisita Order Loading API",
    isLabel: true,
    roles: [userType.superadmin],
    item: [
      {
        itemName: "Order Loading to HO",
        href: routesConstants?.ORDER_LOADING_PO,
        iconUrl: <BorderAllIcon />,
        roles: [userType.superadmin],
      },
      {
        itemName: "Order Loading to Distributor",
        href: routesConstants?.ORDER_LOADING_DISTRIBUTOR,
        iconUrl: <ReceiptOutlinedIcon />,
        roles: [userType.superadmin],
      },
      {
        itemName: "RA Order",
        href: routesConstants?.RA_ORDER,
        iconUrl: <PeopleOutlinedIcon />,
        roles: [userType.superadmin],
      },
    ],
  },
  {
    name: "Data",
    isLabel: true,
    roles: [userType.superadmin],
    item: [
      {
        itemName: "Manage Team",
        href: routesConstants?.MANAGE_TEAM,
        iconUrl: <Diversity3Icon />,
        roles: [userType.superadmin],
      },
      {
        itemName: "Manage Template",
        href: routesConstants?.MANAGE_TEMPLATE,
        iconUrl: <Diversity3Icon />,
        roles: [userType.superadmin],
      },
      {
        itemName: "Upload",
        href: routesConstants?.UPLOAD,
        iconUrl: <ReceiptOutlinedIcon />,
        roles: [userType.superadmin],
      },
      {
        itemName: "Download History",
        href: routesConstants?.DOWNLOAD_HISTORY,
        iconUrl: <Diversity3Icon />,
        roles: [userType.superadmin],
      },
      {
        itemName: "Upload History",
        href: routesConstants?.UPLOAD_HISTORY,
        iconUrl: <Diversity3Icon />,
        roles: [userType.superadmin],
      },
      // {
      //   itemName: "Exported File",
      //   href: routesConstants?.EXPORTED_FILE,
      //   iconUrl: <Diversity3Icon />,
      // },
      {
        itemName: "Product Master",
        href: routesConstants?.PRODUCT_MASTER,
        iconUrl: <PeopleOutlinedIcon />,
        roles: [userType.superadmin],
      },
      {
        itemName: "Product",
        href: routesConstants?.PRODUCT,
        iconUrl: <PeopleOutlinedIcon />,
        roles: [userType.superadmin],
      },
      {
        itemName: "Run Campaign",
        href: routesConstants?.RUN_CAMPAIGN,
        iconUrl: <PeopleOutlinedIcon />,
        roles: [userType.superadmin],
      },
      {
        itemName: "Campaign History",
        href: routesConstants?.CAMPAIGN_HISTORY,
        iconUrl: <PeopleOutlinedIcon />,
        roles: [userType.superadmin],
      },
      {
        itemName: "Contacts Information",
        href: routesConstants?.CONTACT_INFORMATION,
        iconUrl: <ContactsOutlinedIcon />,
        roles: [userType.superadmin],
      },
      {
        itemName: "Renew Email History",
        href: routesConstants?.RENEW_HISTORY,
        iconUrl: <ReceiptOutlinedIcon />,
        roles: [userType.superadmin],
      },
    ],
  },
  {
    name: "Knowledge Portal",
    isLabel: true,
    roles: [userType.client],
    item: [
      {
        itemName: "Product Knowledge",
        href: routesConstants?.PRODUCT_KNOWLEDGE,
        iconUrl: <PersonOutlinedIcon />,
        roles: [userType.client],
      },
      {
        itemName: "Request Training Session",
        href: routesConstants?.TRAINING_SESSION,
        iconUrl: <CalendarTodayOutlinedIcon />,
        roles: [userType.client],
      },
    ],
  },
  {
    name: "Pages",
    isLabel: true,
    roles: [userType.superadmin, userType.client],
    item: [
      // {
      //   itemName: "Profile Form",
      //   href: routesConstants?.PROFILE_FORM,
      //   iconUrl: <PersonOutlinedIcon />,
      //   roles: [userType.superadmin, userType.client],
      // },
      {
        itemName: "Generate Ticket",
        href: routesConstants?.GENERATE_TICKET,
        iconUrl: <PersonOutlinedIcon />,
        roles: [userType.superadmin, userType.client],
      },
      {
        itemName: "Calendar",
        href: routesConstants?.CALENDAR,
        iconUrl: <CalendarTodayOutlinedIcon />,
        roles: [userType.superadmin, userType.client],
      },
      {
        itemName: "FAQ Page",
        href: routesConstants?.FAQ,
        iconUrl: <HelpOutlineOutlinedIcon />,
        roles: [userType.superadmin, userType.client],
      },
    ],
  },
];
