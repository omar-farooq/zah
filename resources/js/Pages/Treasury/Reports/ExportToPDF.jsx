import { PDFDownloadLink, Document, Page, Text, View, StyleSheet } from '@react-pdf/renderer';
import { FolderArrowDownIcon } from '@heroicons/react/24/outline';
import { DateTimeToUKDate } from '@/Shared/Functions';
import { Button } from '@mantine/core';

// Define PDF document styles
const styles = StyleSheet.create({
  page: {
    padding: 30,
    fontFamily: 'Helvetica',
  },
  title: {
    fontSize: 24,
    marginBottom: 20,
    textAlign: 'center',
  },
  sectionTitle: {
    fontSize: 18,
    marginTop: 15,
    marginBottom: 10,
    fontWeight: 'bold',
  },
  header: {
    fontSize: 14,
    marginBottom: 10,
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  table: {
    display: 'table',
    width: 'auto',
    borderStyle: 'solid',
    borderWidth: 1,
    borderColor: '#bfbfbf',
    marginTop: 10,
    marginBottom: 10,
  },
  tableRow: {
    flexDirection: 'row',
  },
  tableColHeader: {
    width: '25%',
    borderStyle: 'solid',
    borderWidth: 1,
    borderColor: '#bfbfbf',
    backgroundColor: '#f0f0f0',
    padding: 5,
    fontSize: 12,
    fontWeight: 'bold',
  },
  tableCol: {
    width: '25%',
    borderStyle: 'solid',
    borderWidth: 1,
    borderColor: '#bfbfbf',
    padding: 5,
    fontSize: 10,
  },
  totalRow: {
    flexDirection: 'row',
    backgroundColor: '#f0f0f0',
  },
  totalCol: {
    width: '25%',
    borderStyle: 'solid',
    borderWidth: 1,
    borderColor: '#bfbfbf',
    padding: 5,
    fontSize: 10,
    fontWeight: 'bold',
  },
  summary: {
    marginTop: 20,
    fontSize: 14,
  },
  pageNumber: {
    position: 'absolute',
    fontSize: 12,
    bottom: 30,
    left: 0,
    right: 0,
    textAlign: 'center',
    color: 'grey',
  },
});

// Component for page numbering - this will appear at the bottom of each page
const PageFooter = () => (
  <Text
    style={styles.pageNumber}
    render={({ pageNumber, totalPages }) => `Page ${pageNumber} of ${totalPages}`}
    fixed
  />
);

// PDF Document Component
const TreasuryReportPDF = ({ treasuryItems, start, end, previousBudget, remainingBudget, mappedTreasuryItems }) => {
  // Split treasuryItems into incoming and outgoing
  const incomingItems = treasuryItems.filter(item => item.is_incoming);
  const outgoingItems = treasuryItems.filter(item => !item.is_incoming);
  
  // Calculate totals
  const incomingTotal = incomingItems.reduce((sum, item) => sum + parseFloat(item.amount), 0).toFixed(2);
  const outgoingTotal = outgoingItems.reduce((sum, item) => sum + parseFloat(item.amount), 0).toFixed(2);
  
  return (
    <Document>
      {/* First Page */}
      <Page size="A4" style={styles.page}>
        <Text style={styles.title}>Zah Treasury Report</Text>
        
        <View style={styles.header}>
          <Text>Report Start: {DateTimeToUKDate(start)}</Text>
          <Text>Report End: {DateTimeToUKDate(end)}</Text>
        </View>
        
        <Text>Starting Balance: £{previousBudget}</Text>
        
        {/* Incoming Items Table */}
        <Text style={styles.sectionTitle}>Incoming Transactions</Text>
        <View style={styles.table}>
          <View style={styles.tableRow}>
            <View style={styles.tableColHeader}>
              <Text>Amount</Text>
            </View>
            <View style={styles.tableColHeader}>
              <Text>Type</Text>
            </View>
            <View style={styles.tableColHeader}>
              <Text>Payer</Text>
            </View>
            <View style={styles.tableColHeader}>
              <Text>Description</Text>
            </View>
          </View>
          
          {incomingItems.map(item => {
            const mappedItem = mappedTreasuryItems.find(x => x.id === item.id);
            return (
              <View style={styles.tableRow} key={item.id}>
                <View style={styles.tableCol}>
                  <Text>£{item.amount}</Text>
                </View>
                <View style={styles.tableCol}>
                  <Text>{mappedItem?.friendly_type || ''}</Text>
                </View>
                <View style={styles.tableCol}>
                  <Text>{mappedItem?.sourceOrRecipient || ''}</Text>
                </View>
                <View style={styles.tableCol}>
                  <Text>{mappedItem?.description || ''}</Text>
                </View>
              </View>
            );
          })}
          
          {/* Total row for incoming */}
          <View style={styles.totalRow}>
            <View style={styles.totalCol}>
              <Text>Total: £{incomingTotal}</Text>
            </View>
            <View style={styles.totalCol}>
              <Text></Text>
            </View>
            <View style={styles.totalCol}>
              <Text></Text>
            </View>
            <View style={styles.totalCol}>
              <Text></Text>
            </View>
          </View>
        </View>
        
        {/* Footer with page numbers */}
        <PageFooter />
      </Page>

      {/* Second Page */}
      <Page size="A4" style={styles.page}>
        <Text style={styles.title}>Zah Treasury Report</Text>
        
        {/* Outgoing Items Table */}
        <Text style={styles.sectionTitle}>Outgoing Transactions</Text>
        <View style={styles.table}>
          <View style={styles.tableRow}>
            <View style={styles.tableColHeader}>
              <Text>Amount</Text>
            </View>
            <View style={styles.tableColHeader}>
              <Text>Type</Text>
            </View>
            <View style={styles.tableColHeader}>
              <Text>Payee</Text>
            </View>
            <View style={styles.tableColHeader}>
              <Text>Description</Text>
            </View>
          </View>
          
          {outgoingItems.map(item => {
            const mappedItem = mappedTreasuryItems.find(x => x.id === item.id);
            return (
              <View style={styles.tableRow} key={item.id}>
                <View style={styles.tableCol}>
                  <Text>£{item.amount}</Text>
                </View>
                <View style={styles.tableCol}>
                  <Text>{mappedItem?.friendly_type || ''}</Text>
                </View>
                <View style={styles.tableCol}>
                  <Text>{mappedItem?.sourceOrRecipient || ''}</Text>
                </View>
                <View style={styles.tableCol}>
                  <Text>{mappedItem?.description || ''}</Text>
                </View>
              </View>
            );
          })}
          
          {/* Total row for outgoing */}
          <View style={styles.totalRow}>
            <View style={styles.totalCol}>
              <Text>Total: £{outgoingTotal}</Text>
            </View>
            <View style={styles.totalCol}>
              <Text></Text>
            </View>
            <View style={styles.totalCol}>
              <Text></Text>
            </View>
            <View style={styles.totalCol}>
              <Text></Text>
            </View>
          </View>
        </View>
        
        <View style={styles.summary}>
          <Text>Ending Balance: £{remainingBudget}</Text>
        </View>
        
        {/* Footer with page numbers */}
        <PageFooter />
      </Page>
    </Document>
  );
};

// Add this to your ViewTreasuryReport component's return statement
export const PDFExportButton = ({ treasuryItems, start, end, previousBudget, remainingBudget, mappedTreasuryItems }) => (
  <PDFDownloadLink 
    document={
      <TreasuryReportPDF 
        treasuryItems={treasuryItems}
        start={start}
        end={end}
        previousBudget={previousBudget}
        remainingBudget={remainingBudget}
        mappedTreasuryItems={mappedTreasuryItems}
      />
    } 
    fileName={`treasury-report-${DateTimeToUKDate(start)}-to-${DateTimeToUKDate(end)}.pdf`}
  >
    {({ blob, url, loading, error }) => (
      <Button 
        leftIcon={<FolderArrowDownIcon className="h-5 w-5" />} 
        className="bg-sky-600"
        loading={loading}
      >
        {loading ? 'Generating PDF...' : 'Export to PDF'}
      </Button>
    )}
  </PDFDownloadLink>
);
