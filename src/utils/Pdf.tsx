
import { Document, Page, Text, View, StyleSheet, Font } from '@react-pdf/renderer';

const styles = StyleSheet.create({
  page: { padding: 40, fontSize: 12, fontFamily: 'Helvetica' },
  title: { fontSize: 24, marginBottom: 20, fontWeight: 'bold' },
  paragraph: { marginBottom: 10, lineHeight: 1.5 },
});

export const MyPdf = ({ title, content }: { title: string; content: string }) => (
  <Document>
    <Page size="A4" style={styles.page}>
      <View>
        <Text style={styles.title}>{title}</Text>
        {/* Wir splitten den Text grob in Paragraphen */}
        {content.split('\n').map((line, index) => (
          <Text key={index} style={styles.paragraph}>
            {line.replace(/[#*`]/g, '')} {/* Einfaches Stripping von MD Symbolen */}
          </Text>
        ))}
      </View>
    </Page>
  </Document>
);