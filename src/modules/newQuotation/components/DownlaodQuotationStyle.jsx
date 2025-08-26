            import { StyleSheet } from "@react-pdf/renderer";

            export const styles = StyleSheet.create({
            page: {
                paddingTop: 100,
                paddingBottom: 80,
                paddingHorizontal: 35,
                fontSize: 10,
                fontFamily: "NotoSans",
                position: "relative",
            },

            /* ---------------- HEADER (Mumbai) ---------------- */
            mumbaiheader: {
                position: "absolute",
                top: 20,
                left: 30,
                right: 30,
                height: 80,
                padding: 5,
                flexDirection: "row",
                alignItems: "center",
            },
            //==first logo style==// 
            // logo: {
            //     width: 140,
            //     height: 70,
                
            //   },
            //   companyInfo: {
            //     marginLeft: 30,
            //     flex: 1,
            //     borderBottomWidth: 1,
            //     borderBottomColor: "#6c725f",
            //   },
            //== latest logo style==//
            // logo: {
            //     marginLeft:-5,
            //     width: 200,
            //     height: 170,
            //     marginTop:25
                
            // },
            // companyInfo: {
            //     marginLeft: -8,
            //     flex: 1,
            //     borderBottomWidth: 1,
            //     borderBottomColor: "#6c725f",
            // },
            //==logo style==// 
        
            logo: {
                marginLeft:-15,
                width: 230,    
                height: 210,
                marginTop:50
                
            },
            companyInfo: {
                marginLeft: -50,
                flex: 1,
                borderBottomWidth: 1,
                borderBottomColor: "#6c725f",
            },

            companyTitle: {
                fontSize: 20,
                color: "#800000",
                fontWeight: "bold",
                textAlign: "center",
            },
            companyAddress: {
                color: "#6c725f",
                fontSize: 7,
                textAlign: "center",
            },
            companyContact: {
                color: "#6c725f",
                fontSize: 9,
                textAlign: "center",
                paddingBottom: 1,
            },

            /* ---------------- FOOTER (Mumbai) ---------------- */
            mumbaifooter: {
                position: "absolute",
                bottom: 8,
                left: 35,
                right: 30,
                paddingTop: 8,
                borderTopWidth: 1,
                borderTopColor: "#6c725f",
                fontSize: 8,
            },
            officeSection: {
                flexDirection: "row",
                justifyContent: "space-between",
                marginBottom: 5,
            },
            officeBox: {
                width: "24%",
            },
            officeBoxWithBorder: {
                borderRightWidth: 1,
                borderRightColor: "#6c725f",
            },
            officeTitle: {
                color: "#800000",
                fontWeight: "bold",
                marginBottom: 2,
                fontSize: 8,
            },
            officeAddress: {
                color: "#6c725f",
                fontSize: 7,
            },
            email: {
                flexDirection: "row",
                alignItems: "center",
                marginTop: 2,
                color: "#800000",
            },
            emailLink: {
                color: "#6c725f",
                textDecoration: "underline",
                fontSize: 7,
            },
            note: {
                marginTop: 3,
                fontSize: 8,
                textAlign: "center",
                color: "#800000",
            },
            footerWrapper: {
                backgroundColor: "#555",
                height: 20,
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
            },
            footerCenter: {
                backgroundColor: "#800000",
                color: "#fff",
                paddingHorizontal: 30,
                paddingVertical: 2,
                fontWeight: "bold",
                fontSize: 10,
                textAlign: "center",
            },

            /* ---------------- TABLE ---------------- */
            table: {
                display: "table",
                width: "auto",
                borderStyle: "solid",
                borderCollapse: "collapse",
                marginTop: 10,
                marginLeft: 0,
            },
            tableRow: {
                flexDirection: "row",
            },
            tableColHeader: {
                width: "11.11%",
                borderWidth: 0.8,
                borderColor: "#000",
                backgroundColor: "#f2f0f0",
                padding: 5,
                fontWeight: "bold",
                fontSize: 8,
            },
            tableCol: {
                width: "11.11%",
                borderWidth: 0.8,
                borderColor: "#000",
                padding: 5,
                fontSize: 8,
            },

            /* ---------------- DETAILS TABLE ---------------- */
            detailsTable: {
                display: "flex",
                flexDirection: "column",
                marginVertical: 10,
                borderWidth: 1,
                borderColor: "#000",
            },
            detailsRow: {
                flexDirection: "row",
                borderBottomWidth: 1,
                borderColor: "#000",
            },
            detailsSubRow: {
                flexDirection: "row",
                borderBottomWidth: 1,
                borderColor: "#000",
            },
            detailsCell: {
                padding: 5,
                fontSize: 9,
            },
            detailsHeaderCell: {
                padding: 5,
                fontSize: 10,
                fontWeight: "bold",
            },
            detailsValueCell: {
                padding: 5,
                fontSize: 10,
                width: "90%",
            },
            refCell: {
                width: "50%",
                padding: 5,
            },
            dateCell: {
                width: "50%",
                padding: 5,
                textAlign: "right",
            },

            /* ---------------- SECTION TITLES ---------------- */
            sectionTitle: {
                fontWeight: "bold",
                fontSize: 10,
                marginBottom: 5,
                marginTop: 15,
                textDecoration: "underline",
            },
            termsList: {
                marginBottom: 10,
            },
            termsListItem: {
                marginLeft: 15,
                marginBottom: 5,
                fontSize: 8,
            },
            thankYou: {
                marginTop: 5,
                fontSize: 10,
            },
            signatureName: {
                fontWeight: "bold",
            },

            /* ---------------- GRAND TOTAL ---------------- */
            grandTotalRow: {
                flexDirection: "row",
            },
            grandTotalLabel: {
                flexGrow: 1,
                padding: 5,
                fontWeight: "bold",
                textAlign: "left",
                backgroundColor: "#f2f0f0",
            },
            grandTotalValue: {
                width: "11.11%",
                padding: 5,
                fontWeight: "bold",
                textAlign: "right",
                backgroundColor: "#f2f0f0",
                wordBreak: "break-all",
            },

            /* ---------------- COMMON ---------------- */
            contentContainer: {
                flexGrow: 1,
                justifyContent: "flex-start",
            },

            /* ---------------- HEADER (Kolkata) ---------------- */
            kolkataheader: {
                position: "absolute",
                top: 20,
                left: 35,
                right: 35,
                flexDirection: "row",
                paddingBottom: 4,
            },
            headerLeft: {
                flex: 1,
                textAlign: "start",
            },
            headerTitle: {
                fontSize: 18,
                color: "#800000",
                fontWeight: "bold",
                marginBottom: 3,
            },
            maroonLine: {
                height: 3,
                backgroundColor: "#800000",
                marginBottom: 5,
                width: "100%",
            },
            addressText: {
                fontSize: 10,
                color: "#800000",
                textAlign: "start",
                fontWeight: "bold",
            },

            /* ---------------- FOOTER (Kolkata) ---------------- */
            kolkatafooter: {
                position: "absolute",
                bottom: 20,
                left: 35,
                right: 35,
            },
            footerLine: {
                height: 3,
                backgroundColor: "#800000",
                marginBottom: 8,
                width: "100%",
            },
            footerText: {
                fontSize: 9,
                color: "#800000",
                fontWeight: "bold",
                textAlign: "center",
                fontFamily: "NotoSans",
            },

            /* ---------------- MISC ---------------- */
            greetingText: {
                marginVertical: 10,
            },
            quoteText: {
                marginBottom: 10,
            },
            });
