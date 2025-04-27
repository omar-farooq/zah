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
  
  // Sort the items by date (newest to oldest)
  const sortByDate = (items) => {
    return [...items].sort((a, b) => {
      const mappedItemA = mappedTreasuryItems.find(x => x.id === a.id);
      const mappedItemB = mappedTreasuryItems.find(x => x.id === b.id);
      
      const dateA = mappedItemA?.date_paid ? new Date(mappedItemA.date_paid) : new Date(0);
      const dateB = mappedItemB?.date_paid ? new Date(mappedItemB.date_paid) : new Date(0);
      
      return dateA - dateB; // For descending order (newest first)
      // Use dateA - dateB for ascending order (oldest first)
    });
  };
  
  const sortedIncomingItems = sortByDate(incomingItems);
  const sortedOutgoingItems = sortByDate(outgoingItems);
  
  // Calculate totals
  const incomingTotal = sortedIncomingItems.reduce((sum, item) => sum + parseFloat(item.amount), 0).toFixed(2);
  const outgoingTotal = sortedOutgoingItems.reduce((sum, item) => sum + parseFloat(item.amount), 0).toFixed(2);
  
  // Split items into chunks of 25 for pagination
  const chunkArray = (array, size) => {
    const chunks = [];
    for (let i = 0; i < array.length; i += size) {
      chunks.push(array.slice(i, i + size));
    }
    return chunks;
  };
  
  const incomingChunks = chunkArray(sortedIncomingItems, 25);
  const outgoingChunks = chunkArray(sortedOutgoingItems, 25);
  
  // Render table rows for a chunk of items
  const renderTableRows = (items) => {
    return items.map(item => {
      const mappedItem = mappedTreasuryItems.find(x => x.id === item.id);
      return (
        <View style={styles.tableRow} key={item.id}>
          <View style={styles.tableCol}>
            <Text>£{item.amount}</Text>
          </View>
          <View style={styles.tableCol}>
            <Text>{item.payment_type || ''}</Text>
          </View>
          <View style={styles.tableCol}>
            <Text>{mappedItem?.sourceOrRecipient || ''}</Text>
          </View>
          <View style={styles.tableCol}>
            <Text>{mappedItem?.description || ''}</Text>
          </View>
          <View style={styles.tableCol}>
            <Text>{mappedItem?.date_paid || ''}</Text>
          </View>
        </View>
      );
    });
  };
  
  // Create incoming transaction pages
  const incomingPages = incomingChunks.map((chunk, index) => (
    <Page size="A4" style={styles.page} key={`incoming-${index}`}>
      <Text style={styles.title}>Zah Treasury Report</Text>
      
      {index === 0 && (
        <View style={styles.header}>
          <Text>Report Start: {DateTimeToUKDate(start)}</Text>
          <Text>Report End: {DateTimeToUKDate(end)}</Text>
          <Text>Starting Balance: £{previousBudget == 0 ? Number(remainingBudget) - Number(incomingTotal) + Number(outgoingTotal) : previousBudget}</Text>
        </View>
      )}
      
      <Text style={styles.sectionTitle}>
        Incoming Transactions {incomingChunks.length > 1 ? `(Page ${index + 1} of ${incomingChunks.length})` : ''}
      </Text>
      
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
          <View style={styles.tableColHeader}>
            <Text>Date</Text>
          </View>
        </View>
        
        {renderTableRows(chunk)}
        
        {index === incomingChunks.length - 1 && (
          <View style={styles.totalRow}>
            <View style={styles.totalCol}>
              <Text>Total: £{incomingTotal}</Text>
            </View>
            <View style={styles.totalCol}><Text></Text></View>
            <View style={styles.totalCol}><Text></Text></View>
            <View style={styles.totalCol}><Text></Text></View>
            <View style={styles.totalCol}><Text></Text></View>
          </View>
        )}
      </View>
      
      <PageFooter />
    </Page>
  ));
  
  // Create outgoing transaction pages
  const outgoingPages = outgoingChunks.map((chunk, index) => (
    <Page size="A4" style={styles.page} key={`outgoing-${index}`}>
      <Text style={styles.title}>Zah Treasury Report</Text>
      
      <Text style={styles.sectionTitle}>
        Outgoing Transactions {outgoingChunks.length > 1 ? `(Page ${index + 1} of ${outgoingChunks.length})` : ''}
      </Text>
      
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
          <View style={styles.tableColHeader}>
            <Text>Date</Text>
          </View>
        </View>
        
        {renderTableRows(chunk)}
        
        {index === outgoingChunks.length - 1 && (
          <>
            <View style={styles.totalRow}>
              <View style={styles.totalCol}>
                <Text>Total: £{outgoingTotal}</Text>
              </View>
              <View style={styles.totalCol}><Text></Text></View>
              <View style={styles.totalCol}><Text></Text></View>
              <View style={styles.totalCol}><Text></Text></View>
              <View style={styles.totalCol}><Text></Text></View>
            </View>
            
            <View style={styles.summary}>
              <Text>Ending Balance: £{remainingBudget}</Text>
            </View>
          </>
        )}
      </View>
      
      <PageFooter />
    </Page>
  ));
  
  return (
    <Document>
      {incomingPages}
      {outgoingPages}
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
    className={`self-center`}
  >
    {({ blob, url, loading, error }) => (
      <Button 
        leftIcon={<FolderArrowDownIcon className="h-5 w-5" />} 
        className="bg-sky-600 2xl:absolute 2xl:right-72"
        loading={loading}
      >
        {loading ? 'Generating PDF...' : 'Export to PDF'}
      </Button>
    )}
  </PDFDownloadLink>
);
