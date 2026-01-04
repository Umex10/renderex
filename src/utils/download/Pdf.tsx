
import { Document, Page, Text, View, StyleSheet } from '@react-pdf/renderer';

/** Props for {@link MyPdf}. */
export type MyPdfProps = {
  title: string;
  content: string;
};

const styles = StyleSheet.create({
  page: { padding: 40, fontSize: 12, fontFamily: 'Helvetica' },
  title: { fontSize: 24, marginBottom: 20, fontWeight: 'bold' },
  paragraph: { marginBottom: 10, lineHeight: 1.5 },
});

/**
 * Minimal PDF layout used for exporting notes/content.
 *
 * Notes:
 * - Splits `content` on `\n` to create rough paragraphs.
 * - Strips a small set of Markdown symbols (`#`, `*`, `` ` ``) for cleaner output.
 */
export const MyPdf = ({ title, content }: MyPdfProps) => (
  <Document>
    <Page size="A4" style={styles.page}>
      <View>
        <Text style={styles.title}>{title}</Text>
        {/* Split content into rough paragraphs */}
        {content.split('\n').map((line, index) => (
          <Text key={index} style={styles.paragraph}>
            {line.replace(/[#*`]/g, '')} {/* Simple stripping of Markdown symbols */}
          </Text>
        ))}
      </View>
    </Page>
  </Document>
);