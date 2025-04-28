// ExportPDFButton.jsx
import React from 'react';
import { PDFDownloadLink, Document, Page, Text, View, StyleSheet, Font } from '@react-pdf/renderer';
import { Button } from '@mantine/core';
import { FolderArrowDownIcon } from '@heroicons/react/24/outline';

// Register fonts for a more professional look
Font.register({
  family: 'Open Sans',
  fonts: [
    { src: 'https://cdn.jsdelivr.net/npm/open-sans-all@0.1.3/fonts/open-sans-regular.ttf' },
    { src: 'https://cdn.jsdelivr.net/npm/open-sans-all@0.1.3/fonts/open-sans-600.ttf', fontWeight: 600 },
    { src: 'https://cdn.jsdelivr.net/npm/open-sans-all@0.1.3/fonts/open-sans-700.ttf', fontWeight: 700 }
  ]
});

// Create styles for PDF
const styles = StyleSheet.create({
  page: {
    flexDirection: 'column',
    padding: 40,
    fontFamily: 'Open Sans',
    fontSize: 12,
  },
  header: {
    marginBottom: 20,
    paddingBottom: 10,
    borderBottom: '1pt solid #888',
  },
  footer: {
    position: 'absolute',
    bottom: 30,
    left: 40,
    right: 40,
    textAlign: 'center',
    fontSize: 10,
    color: '#666',
    borderTop: '1pt solid #888',
    paddingTop: 5,
  },
  pageNumber: {
    position: 'absolute',
    bottom: 30,
    right: 40,
    fontSize: 10,
    color: '#666',
  },
  title: {
    fontSize: 24,
    textAlign: 'center',
    marginBottom: 10,
    fontWeight: 'bold',
  },
  subtitle: {
    fontSize: 14,
    textAlign: 'center',
    marginBottom: 20,
    color: '#555',
  },
  section: {
    margin: '10 0',
    marginBottom: 20,
  },
  sectionHeader: {
    backgroundColor: '#f0f0f0',
    padding: 8,
    marginBottom: 10,
    borderRadius: 4,
  },
  sectionTitle: {
    fontSize: 16,
    fontWeight: 'bold',
  },
  contentWrapper: {
    paddingLeft: 10,
  },
  listItem: {
    marginBottom: 5,
    paddingLeft: 10,
  },
  listItemText: {
    fontSize: 12,
  },
  emptyMessage: {
    color: '#666',
    paddingLeft: 10,
  },
  infoText: {
    paddingLeft: 10,
    marginBottom: 5,
  },
  pollTitle: {
    fontWeight: 'bold',
    fontSize: 13,
    marginBottom: 3,
    marginTop: 8,
  },
  pollOption: {
    marginLeft: 15,
    marginBottom: 2,
  },
  pollResult: {
    marginLeft: 15,
    color: '#555',
    fontSize: 11,
    marginBottom: 5,
  }
});

// PDF Document template with polls included
const MeetingMinutesPDF = ({ meeting }) => (
  <Document>
    <Page size="A4" style={styles.page}>
      <View style={styles.header}>
        <Text style={styles.title}>Zah Meeting Minutes</Text>
        <Text style={styles.subtitle}>{meeting.time_of_meeting}</Text>
      </View>
      
      {/* Attendance Section */}
      <View style={styles.section}>
        <View style={styles.sectionHeader}>
          <Text style={styles.sectionTitle}>In Attendance</Text>
        </View>
        <View style={styles.contentWrapper}>
          {meeting.attendees.map(x => (
            <View key={x.id} style={styles.listItem}>
              <Text style={styles.listItemText}>
                {x.name}{x.pivot.late ? " (Late)" : ""}
              </Text>
            </View>
          ))}
          {meeting.guests?.length > 0 && (
            <>
              <Text style={{...styles.listItemText, fontWeight: 'bold', marginTop: 5, marginBottom: 3}}>Guests:</Text>
              {meeting.guests.map(x => (
                <View key={x.id} style={styles.listItem}>
                  <Text style={{...styles.listItemText, color: '#2e7d32'}}>{x.name}</Text>
                </View>
              ))}
            </>
          )}
        </View>
      </View>
      
      {/* Agenda Section */}
      <View style={styles.section}>
        <View style={styles.sectionHeader}>
          <Text style={styles.sectionTitle}>Agenda</Text>
        </View>
        <View style={styles.contentWrapper}>
          {meeting.meeting_agenda.length > 0 ? (
            meeting.meeting_agenda.map((x, index) => (
              <View key={x.id} style={styles.listItem}>
                <Text style={styles.listItemText}>{index + 1}. {x.item}</Text>
              </View>
            ))
          ) : (
            <Text style={styles.emptyMessage}>No agenda was set for this meeting</Text>
          )}
        </View>
      </View>
      
      {/* Secretary's Report */}
      <View style={styles.section}>
        <View style={styles.sectionHeader}>
          <Text style={styles.sectionTitle}>Secretary's Report</Text>
        </View>
        <View style={styles.contentWrapper}>
          {meeting.secretary_report?.written_report ? (
            <Text style={styles.infoText}>{meeting.secretary_report.written_report}</Text>
          ) : (
            <Text style={styles.emptyMessage}>There's nothing to report</Text>
          )}
        </View>
      </View>
      
      {/* Meeting Notes */}
      <View style={styles.section}>
        <View style={styles.sectionHeader}>
          <Text style={styles.sectionTitle}>Meeting Notes</Text>
        </View>
        <View style={styles.contentWrapper}>
          {meeting.minutes_read_and_agreed && (
            <View style={styles.listItem}>
              <Text style={{...styles.listItemText}}>Minutes read and agreed</Text>
            </View>
          )}
          {meeting.minutes?.length > 0 ? (
            meeting.minutes.map((x, index) => (
              <View key={x.id} style={styles.listItem}>
                <Text style={styles.listItemText}>• {x.minute_text}</Text>
              </View>
            ))
          ) : (
            <Text style={styles.emptyMessage}>No meeting notes recorded</Text>
          )}
        </View>
      </View>
      
      {/* Polls Section */}
      {meeting.polls.length > 0 && (
        <View style={styles.section}>
          <View style={styles.sectionHeader}>
            <Text style={styles.sectionTitle}>Polls</Text>
          </View>
          <View style={styles.contentWrapper}>
            {meeting.polls.map((poll, index) => (
              <View key={poll.id}>
                <Text style={styles.pollTitle}>{index + 1}. {poll.name}</Text>
                {poll.poll_items.map(option => (
                  <Text key={option.id} style={styles.pollOption}>
                    {option.option}:  {option.votes.length == 1 ? `${option.votes.length} vote` : `${option.votes.length} votes`}
                  </Text>
                ))}
              </View>
            ))}
          </View>
        </View>
      )}
      
      {/* Decisions Made */}
      <View style={styles.section}>
        <View style={styles.sectionHeader}>
          <Text style={styles.sectionTitle}>Decisions Made</Text>
        </View>
        <View style={styles.contentWrapper}>
          {meeting.decisions?.length > 0 ? (
            meeting.decisions.map((x, index) => (
              <View key={x.id} style={styles.listItem}>
                <Text style={styles.listItemText}>{index + 1}. {x.decision_text}</Text>
              </View>
            ))
          ) : (
            <Text style={styles.emptyMessage}>No decisions recorded</Text>
          )}
        </View>
      </View>
      
      <View style={styles.footer}>
        <Text>Meeting Minutes - {new Date().toLocaleDateString()}</Text>
      </View>
      <Text 
        style={styles.pageNumber} 
        render={({ pageNumber, totalPages }) => `${pageNumber} / ${totalPages}`} 
        fixed 
      />
    </Page>
  </Document>
);

// The exportable button component
const ExportPDFButton = ({ meeting }) => (
  <PDFDownloadLink 
    document={<MeetingMinutesPDF meeting={meeting} />} 
    fileName={`meeting-minutes-${meeting.time_of_meeting.replace(/[^a-zA-Z0-9]/g, '-')}.pdf`}
  >
    {({ blob, url, loading, error }) => ( 
      <Button
        leftIcon={<FolderArrowDownIcon className="h-5 w-5" />}
        className="bg-sky-600 2xl:absolute 2xl:right-72"
        loading={loading}
      >
        {loading ? 'Preparing PDF...' : 'Export to PDF'}
      </Button>
    )}
  </PDFDownloadLink>
);

export default ExportPDFButton;
