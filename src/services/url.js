export const LOGIN = "/v1/login/";
export const PROFILE = "/v1/user/";
export const CHANGED_PASSWORD = "/v1/change_password";
export const DASHBOARD_DATA = "/v1/api/new_get_dashboard_data";
export const GET_ALL_BRANCH = "/v1/api/get_all_branch/";
export const GET_ALL_ACCOUNT = "/v1/api/account_dropdown/";
export const INSIGHT_METRICS_CUSTOMER =
  "/v1/api/get_insights_metrics_customer/";
export const INSIGHT_METRICS_CUSTOMER_V2 =
  "/v1/api/get_insights_metrics_v2_customer/";
export const ALERT_SUBSCRIPTION = "/v1/api/new_get_ror_lop_data/";
export const GET_ALERT_SUBSCRIPTION = "/v1/api/get_alert_subscription/";
export const GET_ALL_USER = "/v1/get_user/";
export const GET_ALL_OEM_MANAGER = "/v1/api/get_oem_manager/";
export const GET_EXPORTED_ACCOUNTS_DATA = "/v1/api/get_export_accounts/";
export const GET_ACCOUNT = "/v1/api/get_account/";
export const INSIGHT_METRICS_CSN = "/v1/api/get_insights_metrics_csn/";
export const GET_CONTRACTS = "/v1/api/get_contracts/";
export const END_CUSTOMER_ACCOUNT = "/v1/api/get_endcustomer_account/";
export const GET_ACCOUNT_INFORMATION = "/v1/api/account";
export const GET_NEW_ACCOUNT_INFORMATION = "/v1/api/newaccount";

export const GET_BD_RENEWAL_PERSON =
  "/v1/api/get_bd_and_renewal_person_by_branch";
export const GET_ACCOUNT_BY_BDPERSON =
  "/v1/api/get_third_party_accounts_by_bdperson/";
export const ADD_EDIT_ACCOUNT = "/v1/api/third_party_account";
export const GET_THIRD_PARTY_ACCOUNT = "/v1/api/get_third_party_accounts/";
export const GET_ADD_QUOTATION = "/v1/product/quotation/";
export const GET_ADD_SALES_STAGE = "/v1/product/sales_stage/";
export const GET_EXPORT_OPPORTUNITIES = "/v1/api/get_export_opportunities/";
export const GET_OPPORTUNITY_DETAIL = "/v1/api/get_opportunity";
export const GET_INSIGHT_METRICS_CONTRACT =
  "/v1/api/get_insight_metrics_contract";
export const GET_INSIGHT_METRICS_V2_CONTRACT =
  "/v1/api/get_insight_metrics_v2_pop_up";
export const GET_USUAGE_DATA = "/v1/api/new_get_usage_data_celery/";
export const GET_TASK_USAGES_DATA = "/v1/api/new_get_usage_task_result/";
export const GET_USUAGE_PRODUCT_FEATURE_CHART =
  "/v1/api/new_get_usage_product_feature_chart/";
export const GET_UNIQUE_USAGE_USER_COUNT = "/v1/api/new_usage_user_count/";
export const GET_SUBSCRIPTION_DATA = "/v1/api/get_export_subscriptions/";
export const GET_NEW_SUBSCRIPTION_DATA = "/v1/api/new_get_new_subscriptions/";
export const GET_NEW_SUBSCRIPTION_DETAIL = "/v1/api/new_subscription/";
export const GET_DELETED_SUBSCRIPTION_DATA =
  "/v1/api/new_get_deleted_subscriptions/";
export const GET_DELETED_SUBSCRIPTION_DETAIL =
  "/v1/api/get_deleted_subscription/";
export const GET_CHANGED_LOG_SUBSCRIPTION_DATA =
  "/v1/api/get_change_log_subscriptions/";
export const GET_CHANGED_LOG_SUBSCRIPTION_DETAIL =
  "/v1/api/change_log_subscription/";
export const GET_COMPARE_SUBSCRIPTION_DATA = "/v1/api/compare_subscriptions/";
export const GET_BACKUP_SUBSCRIPTION = "/v1/api/get_backup_subscription/";
export const GET_SUBSCRIPTION = "/v1/api/get_subscription/";
export const GET_ALL_NOTIFICATIONS = "/v1/api/notifications/";
export const GET_USER_WISE_NOTIFICATION = "/v1/api/user_wise_notifications/";
export const MARK_ALL_AS_READ_URL = "/v1/api/notifications/mark-as-read-all/";
export const GET_PRODUCT_MASTER = "/v1/product/product_master/";
export const GET_PRODUCT_MASTER_CATEGORY =
  "/v1/product/product_master_category/";
export const GET_PRODUCT_MASTER_GST_TYPE =
  "/v1/product/product_master_gst_type/";
export const GET_PRODUCT_MASTER_OEM = "/v1/product/product_master_oem/";
export const GET_PRODUCT_MASTER_STATUS = "/v1/product/product_master_status/";
export const GET_PRODUCT_MASTER_UOM = "/v1/product/product_master_uom/";
export const GET_PRODUCT = "/v1/product/product/";
export const MANAGE_TEMPLATE_URL = "/v1/api/get_new_templates/";
export const TRIGGER_TEMPLATE_URL = "/v1/api/subs_trigger_new/";
export const DOWNLOAD_PRODUCT_MASTER_CSV_FORMAT_URL =
  "/v1/product/download_product_master_csv_format/";
export const DOWNLOAD_ACCOUNT_TAGGING_CSV_FORMAT_URL =
  "/v1/api/download-account-tagging-formate/";
export const DOWNLOAD_PRODUCT_MASTER_CSV_HISTORY_URL =
  "/v1/product/download_updated_product_master/";
export const DOWNLOAD_ACCOUNT_TAGGING_CSV_HISTORY_URL =
  "/v1/api/download-recent-updated-accounts/";
export const UPLOAD_PRODUCT_MASTER = "/v1/product/upload_product_master/";
export const UPLOAD_ACCOUNT_TAGGING_BULK = "/v1/api/bulk_upload_csv/";
export const GET_RENEWAL_EMAIL_LIST = "/v1/api/get_renew_email_logs/";
export const GET_PAYMENTS_OVERDUE_LIST =
  "/v1/product/get_payment_overdue_list/";
export const GET_PAYMENTS_OUTSTANDING_LIST =
  "/v1/product/get_payment_outstanding_list/";
export const GET_INVOICE_PENDING_LIST = "/v1/product/get_invoice_pending_list/";
export const GET_ORDER_LOADING_HO = "/v1/product/order_loading_po/";
export const UPDATE_LOCK_UNLOCK_OREDER_LOADING =
  "/v1/product/order_loading_lock_unlock/";
export const GET_BD_PERSON_BY_BRANCH = "/v1/api/get_bd_person_by_branch/";
export const GET_ACCOUNT_BY_BD_PERSON = "/v1/api/get_accounts_by_bd_person/";
export const ACTIVE_PRODUCT_MASTER = "/v1/product/active_product_master/";
export const GET_RA_ORDER = "/v1/api/new_get_order_ra_data/";
export const GET_CONTACT_INFORMATION = "/v1/api/get_contact_info/";
export const GET_SUBS_BY_THIRD_PARTY = "/v1/api/get_subs_by_thirdparty/";
export const GET_BRANCH_ACCOUNT_PRODUCTLINE =
  "/v1/api/get_branch_accounts_and_productlines/";
export const GET_LICENSE_OPTIMISATION =
  "/v1/api/get_license_optimization_celery/";
export const GET_TASK_LICENSE_OPTIMISE_DATA =
  "/v1/api/get_license_optimization_result/";
export const GET_NEW_QUOTATION = "/v1/product/get_new_quotation/";
export const LOCK_UNLOCK_QUOTATION = "/v1/product/get_quotation_lock_unlock/";
export const GET_ALL_BD_PERSON_BY_BRANCH = "/v1/api/get_branch_wise_bd_person/";
export const GET_ALL_ACCOUNT_BY_BRANCH = "/v1/api/get_branch_wise_accounts/";
export const GET_ALL_ACCOUNT_BY_BD_PERSON =
  "/v1/api/get_bd_person_wise_account/";
export const PRODUCT_DETAILS = "/v1/product/product_details/";
export const DOWNLOAD_PDF_QUOTATION = "/v1/product/download_pdf_quotation/";
export const GET_QUOTATION_TEMPLATE = "/v1/api/get_new_templates_quotation/";
export const SEND_QUOTATION = "/v1/product/send_quotation_mail/";
export const GET_PURCHASED_PAYMENT_TERMS = "/v1/product/get_payment_terms/";
export const GET_TOTAL_AMOUNT_PER_MONTH_FOR_THIRD_PARTY =
  "/v1/api/get_subs_enddate_price/";
export const GET_NEW_OPPORTUNITY_DATA = "/v1/api/get_new_opportunity/";
export const GENERATE_QUOTATION = "/v1/product/get_genrate_quotation/";
export const GET_CAMPAIGN_HISTORY = "/v1/api/campaign_list/";
export const GET_ALL_PRODCUT_LINE = "/v1/api/get_new_all_product_line/";
export const CAMPAIGN_AUDIENCE_LIST = "/v1/api/new_get_campaign_audience_list/";
export const CAMPAIGN_SEND = "/v1/api/campaign_send/";
export const GET_CAMPAIGN = "/v1/api/campaign/";
export const GET_CAMPAIGN_SUBSCRIPTION_CONTACT =
  "/v1/api/get_campaign_subscription_contact/";
export const GET_NEW_SUBS_BY_THIRDPARTY = "/v1/api/new_get_subs_by_thirdparty/";
export const GET_EXPORT_EXCEL_FILES = "/v1/api/get_export_excel_files/";
export const GET_UPLOADED_FILES = "/v1/product/get_uploaded_files/";
export const GET_RENEWAL_DUE = "/v1/api/get_renewal_due_subscriptions/";
export const UPDATE_DOWNLOAD_PERMISSION = "/v1/disable_download/";
export const GET_DELETED_COUNT = "/v1/api/get_deletion_counts/";
export const BACKUP_OPERATION = "/v1/api/new_trigger_backup/";
export const GET_ALL_USERLIST = "/v1/new_get_user/";
export const UPDATE_USER_PERMISSION = "/v1/toggle_user_module/";
