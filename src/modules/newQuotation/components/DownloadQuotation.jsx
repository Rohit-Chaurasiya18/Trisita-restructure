import React, { useState } from "react";
import Trisita_Logo from "@/assets/images/png/logo.png";

import { styles } from "./DownlaodQuotationStyle";
import {
  Document,
  Page,
  View,
  Text,
  Image,
  Link,
  Font,
  pdf,
} from "@react-pdf/renderer";
import NotoSansRegular from "@/assets/fonts/Noto_Sans/static/NotoSans-Regular.ttf";
import NotoSansBold from "@/assets/fonts/Noto_Sans/static/NotoSans-Bold.ttf";
import {
  EmailIcon,
  PhoneIcon,
} from "@/components/common/reactSVG/DownloadQuatationSvg";

// ===== Font Registration =====
Font.register({
  family: "NotoSans",
  fonts: [
    { src: NotoSansRegular, fontWeight: "normal" },
    { src: NotoSansBold, fontWeight: "bold" },
  ],
});

// ===== Common Components =====
const OfficeContact = ({ icon: Icon, text }) => (
  <>
    <Icon size={8} color="#800000" />
    <Text style={[styles.companyContact, { marginLeft: 0 }]}>{text}</Text>
  </>
);

const OfficeBox = ({ office, withBorder }) => (
  <View style={[styles.officeBox, withBorder && styles.officeBoxWithBorder]}>
    <Text style={styles.officeTitle}>{office.title}</Text>
    {office.address.map((line, i) => (
      <Text style={styles.officeAddress} key={i}>
        {line}
      </Text>
    ))}
    <View style={[styles.email, { alignItems: "center" }]}>
      <EmailIcon size={8} color="#800000" />
      <Link
        src={`mailto:${office.email}`}
        style={[styles.emailLink, { marginLeft: 4 }]}
      >
        {office.email}
      </Link>
    </View>
  </View>
);

// ===== Mumbai Components =====
const MumbaiHeader = () => (
  <View style={styles.mumbaiheader} fixed>
    <Image style={styles.logo} src={Trisita_Logo} />
    <View style={styles.companyInfo}>
      <Text style={styles.companyTitle}>TRISITA ENGINEERING LLP</Text>
      <Text style={styles.companyAddress}>
        Office Address: Unit no.508 & 509, Anjani Complex, Pereira Hill Road,
        Opp. Guru Nanak Petrol Pump,
      </Text>
      <Text style={styles.companyAddress}>
        Off Andheri Kurla Road, Andheri East, Mumbai 400099
      </Text>
      <View
        style={{
          flexDirection: "row",
          justifyContent: "center",
          alignItems: "center",
        }}
      >
        <OfficeContact icon={PhoneIcon} text=":022-49607348" />
        <Text style={{ marginHorizontal: 6 }} />
        <OfficeContact icon={EmailIcon} text=":ankit.shah@trisita.com" />
      </View>
    </View>
  </View>
);

const MumbaiFooter = () => {
  const offices = [
    {
      title: "Head Office – Kolkata",
      address: [
        "Jain Center, 1st Floor, 34A,",
        "Metcalf Street, Kolkata : 700013",
      ],
      email: "hiranmay.talukdar@trisita.com",
    },
    {
      title: "Bhubaneshwar Branch Office",
      address: [
        "Plot No 5, Road -6, Jagannath",
        "Nagar,Rasulgarh, Bhubaneshwar",
      ],
      email: "ashin.saha@trisita.com",
    },
    {
      title: "Guwahati Branch Office",
      address: [
        "House No : 89, Ramkrishna Path",
        "PO – Odalbakra P.S. -Dispur",
      ],
      email: "sugata.banerjee@trisita.com",
    },
    {
      title: "Hyderabad Branch Office",
      address: ["SBH Colony, Gandhi Nagar,", "Hyd – 500080, Telangana"],
      email: "ankit.shah@trisita.com",
    },
  ];

  return (
    <View style={styles.mumbaifooter} fixed>
      <View style={styles.officeSection}>
        {offices.map((office, index) => (
          <OfficeBox
            key={index}
            office={office}
            withBorder={index !== offices.length - 1}
          />
        ))}
      </View>
      <Text style={styles.note}>
        We have our branch offices in Vijayawada and Delhi as well. For any
        sales related query feel free to email us at{" "}
        <Link src="mailto:sales.mumbai@trisita.com" style={styles.emailLink}>
          sales.mumbai@trisita.com
        </Link>
      </Text>
      <View style={styles.footerWrapper}>
        <Text style={styles.footerCenter}>www.trisita.co.in</Text>
      </View>
    </View>
  );
};

// ===== Kolkata Components =====
const KolkataHeader = () => (
  <View style={styles.kolkataheader} fixed>
    <View style={styles.headerLeft}>
      <Text style={styles.headerTitle}>TRISITA ENGINEERING LLP.</Text>
      <View style={styles.maroonLine} />
      <Text style={styles.addressText}>
        Engineering Software / Project: IB - 192, Sector – III, Salt Lake City,
        Kolkata – 700106
      </Text>
      <Text style={styles.addressText}>
        HO / Admin: 8th Floor, Room No-81, Chitrakoot Building, 230A AJC Bose
        Road, Kolkata – 700020
      </Text>
    </View>
  </View>
);

const KolkataFooter = () => (
  <View style={styles.kolkatafooter} fixed>
    <View style={styles.footerLine} />
    <Text style={styles.footerText}>
      Branch Offices: New Delhi, Mumbai, Hyderabad, Ahmedabad, Bhubaneswar,
      Guwahati, Ranchi
    </Text>
  </View>
);

// ===== Table Components =====
const TableHeader = () => {
  const columns = [
    { width: "5%", text: "Sr. No." },
    { width: "30%", text: "Description" },
    { width: "10%", text: "Amount" },
    { width: "5%", text: "Qty." },
    { width: "10%", text: "Sub Total" },
    { width: "10%", text: "CGST@9%" },
    { width: "10%", text: "SGST@9%" },
    { width: "10%", text: "IGST@18%" },
    { width: "10%", text: "Inline Amount" },
  ];
  return (
    <View style={styles.tableRow} fixed>
      {columns.map((col, idx) => (
        <Text key={idx} style={[styles.tableColHeader, { width: col.width }]}>
          {col.text}
        </Text>
      ))}
    </View>
  );
};

const TableRow = React.memo(({ row }) => {
  const getWidth = (index) => {
    if (index === 0) return "5%";
    if (index === 1) return "30%";
    if (index === 3) return "5%";
    return "10%";
  };
  return (
    <View style={styles.tableRow} wrap={false}>
      {row.map((cell, index) => (
        <Text key={index} style={[styles.tableCol, { width: getWidth(index) }]}>
          {cell}
        </Text>
      ))}
    </View>
  );
});
TableRow.displayName = "TableRow";

const GrandTotalRow = ({ total }) => (
  <View style={[styles.tableRow, styles.grandTotalRow]} wrap={false}>
    <Text style={[styles.tableCol, styles.grandTotalLabel, { width: "90%" }]}>
      Grand Total
    </Text>
    <Text style={[styles.tableCol, styles.grandTotalValue, { width: "10%" }]}>
      {total}
    </Text>
  </View>
);

// ===== Details and Terms =====
const DetailsTable = ({ quotation_no, quotation_date, name, account_name }) => (
  <View style={styles.detailsTable}>
    <View style={styles.detailsSubRow}>
      <Text style={[styles.detailsCell, styles.refCell]}>
        <Text style={{ fontWeight: "bold" }}>Ref:</Text> {quotation_no}
      </Text>
      <Text style={[styles.detailsCell, styles.dateCell]}>
        <Text style={{ fontWeight: "bold" }}>Date:</Text> {quotation_date}
      </Text>
    </View>
    <View style={styles.detailsRow}>
      <Text style={styles.detailsHeaderCell}>To:</Text>
      <Text style={styles.detailsValueCell}>{account_name}</Text>
    </View>
    <View style={styles.detailsRow}>
      <Text style={styles.detailsHeaderCell}>Kind Attn:</Text>
      <Text style={styles.detailsValueCell}>{name}</Text>
    </View>
    <View style={styles.detailsRow}>
      <Text style={[styles.detailsHeaderCell, { width: "5%" }]}>SUB:</Text>
      <Text style={[styles.detailsValueCell, { width: "95%" }]}>
        Commercial Proposal for Autodesk Software Licenses
      </Text>
    </View>
  </View>
);

// ===== Terms and Conditions =====
const TermsAndConditions = ({
  bd_person_name,
  bd_person_phone,
  valid_until,
  purchase_payment_terms,
  branch_name,
}) => {
  const branchAddresses = {
    Mumbai: {
      address:
        "Unit no. 508 & 509, Anjani Complex, Pereira Hill Road, Opp. Guru Nanak Petrol Pump, Off. Andheri Kurla Road, Andheri East, Mumbai, 400099",
      gst: "27AALFT0664Q1ZF",
      pan: "AALFT0664Q",
    },
    Kolkata: {
      address:
        "Engineering Software / Project: IB-192, Sector – III, Salt Lake City, Kolkata – 700106, HO / Admin: 8th Floor, Room No-81, Chitrakoot Building, 230A AJC Bose Road, Kolkata – 700020",
      gst: "19AALFT0664Q1Z6",
      pan: "AALFT0664Q",
    },
  };

  const branch = branchAddresses[branch_name] || branchAddresses.Mumbai;

  const terms = [
    `Quote Validity up to ${valid_until || "None"}`,
    "HSN/SAC Code for all our Autodesk software is 998434.",
    "Remarks – This Price is not applicable against any renewal opportunity due in next or last 90 days.",
    `Payment terms: ${purchase_payment_terms || "None"}.`,
    "Delivery-License will be issued within 6 to 7 days from the date of purchase order.",
    "Any new or changes in the Government taxes and levies enforce at the time of delivery will be applicable at actual.",
    "Please mention GST No. & PAN No along with PO.",
    "CUSTOM_POINT_8",
    "TDS Not to be deducted, as we will provide the TDS declaration on the final Invoice.",
  ];

  return (
    <View wrap>
      <Text style={styles.sectionTitle}>Terms and Conditions</Text>
      {terms.map((term, idx) =>
        term === "CUSTOM_POINT_8" ? (
          <Text key={idx} style={styles.termsListItem}>
            {`${
              idx + 1
            }. Placement of the Order - Please place your valued order on `}
            <Text style={{ fontWeight: "bold" }}>TRISITA Engineering LLP</Text>,{" "}
            {branch.address} <Text style={{ fontWeight: "bold" }}>GST No:</Text>{" "}
            {branch.gst}, <Text style={{ fontWeight: "bold" }}>PAN No:</Text>{" "}
            {branch.pan}
          </Text>
        ) : (
          <Text key={idx} style={styles.termsListItem}>
            {`${idx + 1}. ${term}`}
          </Text>
        )
      )}
      <Text style={styles.thankYou}>Thanking You.</Text>
      <View style={styles.signatureBlock}>
        <Text>For TRISITA Engineering LLP</Text>
        <Text style={styles.signatureName}>{bd_person_name}</Text>
        <Text>{bd_person_phone}</Text>
      </View>
    </View>
  );
};

// ===== PDF Document Component =====
export const MyDocument = ({ params }) => {
  const tableData = (params?.row?.product_details || []).map((item, i) => {
    const sellingAmount = parseFloat(item.selling_amount) || 0;
    const quantity = parseInt(item.quantity) || 0;
    const subTotal = sellingAmount * quantity;
    const cgst = parseFloat(item.cgst_amount) || 0;
    const sgst = parseFloat(item.sgst_amount) || 0;
    const igst = parseFloat(item.igst_amount) || 0;
    const inlineAmount = (subTotal + cgst + sgst + igst).toFixed(2);

    return [
      `${i + 1}`,
      item.product_name || "-",
      `₹${sellingAmount.toFixed(2)}`,
      `${quantity}`,
      `₹${subTotal.toFixed(2)}`,
      `₹${cgst.toFixed(2)}`,
      `₹${sgst.toFixed(2)}`,
      `₹${igst.toFixed(2)}`,
      `₹${inlineAmount}`,
    ];
  });

  const grandTotalValue = tableData.reduce(
    (acc, row) => acc + (parseFloat(row[8].replace("₹", "")) || 0),
    0
  );

  const formattedGrandTotal = `₹${grandTotalValue.toFixed(2)}`;
  const isMumbai = params?.row?.branch_name === "Mumbai";

  return (
    <Document>
      <Page size="A4" style={styles.page}>
        {isMumbai ? <MumbaiHeader /> : <KolkataHeader />}
        <View style={styles.contentContainer}>
          <DetailsTable
            quotation_no={params?.row?.quotation_no}
            quotation_date={params?.row?.quotation_date}
            name={params?.row?.name}
            account_name={params?.row?.account_name}
          />
          <Text style={styles.greetingText}>Dear Sir,</Text>
          <Text style={styles.quoteText}>
            We are pleased to quote the Commercial prices as follows:
          </Text>
          <View style={styles.table}>
            <TableHeader />
            <View wrap>
              {tableData.map((row, idx) => (
                <TableRow key={`row-${idx}`} row={row} />
              ))}
              <GrandTotalRow total={formattedGrandTotal} />
            </View>
          </View>
          <TermsAndConditions
            bd_person_name={params?.row?.bd_person_name}
            bd_person_phone={params?.row?.bd_person_phone}
            purchase_payment_terms={params?.row?.purchase_payment_terms}
            valid_until={params?.row?.valid_until}
            branch_name={params?.row?.branch_name}
          />
        </View>
        {isMumbai ? <MumbaiFooter /> : <KolkataFooter />}
      </Page>
    </Document>
  );
};

// ===== Main Component =====
const DownloadQuotation = ({ params }) => {
  const [isGenerating, setIsGenerating] = useState(false);

  const generatePdf = async () => {
    setIsGenerating(true);
    try {
      const blob = await pdf(<MyDocument params={params} />).toBlob();
      return URL.createObjectURL(blob);
    } catch (error) {
      console.error("Error generating PDF:", error);
      return null;
    } finally {
      setIsGenerating(false);
    }
  };
  const handleDownload = async () => {
    const url = await generatePdf();
    const fileName = params?.row?.quotation_no
      ? `${params.row.quotation_no}.pdf`
      : "Trisita_Proposal.pdf";
    if (url) {
      const link = document.createElement("a");
      link.href = url;
      link.download = fileName;
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
    }
  };

  return (
    <div className={styles.container}>
      <div className={styles.buttonContainer}>
        <a
          onClick={handleDownload}
          disabled={isGenerating}
          className="assign-button text-black px-3 py-1 rounded border-0"
          style={{ textDecoration: "none", cursor: "pointer" }}
        >
          {isGenerating ? "Generating PDF..." : "Download PDF"}
        </a>
      </div>
    </div>
  );
};

export default DownloadQuotation;
