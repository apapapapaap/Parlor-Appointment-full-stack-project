import jsPDF from 'jspdf';
import { PaymentHistory } from '../types';

export class PDFService {
  private static instance: PDFService;

  static getInstance(): PDFService {
    if (!PDFService.instance) {
      PDFService.instance = new PDFService();
    }
    return PDFService.instance;
  }

  private formatDate(dateString: string): string {
    return new Date(dateString).toLocaleDateString('en-IN', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  }

  private getPaymentMethodName(method: string): string {
    switch (method) {
      case 'upi':
        return 'UPI Payment';
      case 'card':
        return 'Card Payment';
      case 'cash':
        return 'Cash Payment';
      default:
        return 'Unknown';
    }
  }

  private addHeader(doc: jsPDF): void {
    // Company Logo Area (using text for now, can be replaced with actual logo)
    doc.setFillColor(236, 72, 153); // Pink color
    doc.circle(30, 30, 12, 'F');
    
    // Add sparkle symbol in logo
    doc.setTextColor(255, 255, 255);
    doc.setFontSize(16);
    doc.text('✨', 26, 34);

    // Company Name
    doc.setTextColor(236, 72, 153);
    doc.setFontSize(24);
    doc.setFont('helvetica', 'bold');
    doc.text('AKSHATA PARLOR', 50, 25);

    // Tagline
    doc.setTextColor(107, 114, 128);
    doc.setFontSize(12);
    doc.setFont('helvetica', 'normal');
    doc.text('Beauty & Bridal Services', 50, 35);

    // Contact Information
    doc.setFontSize(10);
    doc.text('📍 Main Street, Beauty Plaza', 50, 45);
    doc.text('📞 +91 98765 43210  📧 info@akshataparlor.com', 50, 52);

    // Header Line
    doc.setDrawColor(236, 72, 153);
    doc.setLineWidth(2);
    doc.line(20, 65, 190, 65);
  }

  private addReceiptTitle(doc: jsPDF, yPosition: number): number {
    doc.setTextColor(0, 0, 0);
    doc.setFontSize(20);
    doc.setFont('helvetica', 'bold');
    doc.text('PAYMENT RECEIPT', 105, yPosition, { align: 'center' });
    
    return yPosition + 15;
  }

  private addPaymentInfo(doc: jsPDF, payment: PaymentHistory, yPosition: number): number {
    const leftColumn = 25;
    const rightColumn = 110;
    
    // Payment Details Section
    doc.setFontSize(14);
    doc.setFont('helvetica', 'bold');
    doc.setTextColor(0, 0, 0);
    doc.text('Payment Information', leftColumn, yPosition);
    
    yPosition += 10;
    doc.setFontSize(10);
    doc.setFont('helvetica', 'normal');
    doc.setTextColor(75, 85, 99);

    // Left Column
    doc.text('Receipt No:', leftColumn, yPosition);
    doc.setTextColor(0, 0, 0);
    doc.text(payment.id.toUpperCase(), leftColumn + 25, yPosition);
    
    yPosition += 8;
    doc.setTextColor(75, 85, 99);
    doc.text('Payment ID:', leftColumn, yPosition);
    doc.setTextColor(0, 0, 0);
    doc.text(payment.paymentId || 'N/A', leftColumn + 25, yPosition);
    
    yPosition += 8;
    doc.setTextColor(75, 85, 99);
    doc.text('Date & Time:', leftColumn, yPosition);
    doc.setTextColor(0, 0, 0);
    doc.text(this.formatDate(payment.transactionDate), leftColumn + 25, yPosition);

    // Right Column
    const rightYStart = yPosition - 16;
    doc.setTextColor(75, 85, 99);
    doc.text('Customer Name:', rightColumn, rightYStart);
    doc.setTextColor(0, 0, 0);
    doc.text(payment.customerName, rightColumn + 30, rightYStart);
    
    doc.setTextColor(75, 85, 99);
    doc.text('Email:', rightColumn, rightYStart + 8);
    doc.setTextColor(0, 0, 0);
    doc.text(payment.customerEmail, rightColumn + 30, rightYStart + 8);
    
    doc.setTextColor(75, 85, 99);
    doc.text('Payment Method:', rightColumn, rightYStart + 16);
    doc.setTextColor(0, 0, 0);
    doc.text(this.getPaymentMethodName(payment.paymentMethod), rightColumn + 30, rightYStart + 16);

    return yPosition + 15;
  }

  private addServicesTable(doc: jsPDF, payment: PaymentHistory, yPosition: number): number {
    // Services Section Header
    doc.setFontSize(14);
    doc.setFont('helvetica', 'bold');
    doc.setTextColor(0, 0, 0);
    doc.text('Services Breakdown', 25, yPosition);
    
    yPosition += 10;

    // Table Header
    const tableStartY = yPosition;
    const rowHeight = 8;
    const colWidths = [80, 25, 25, 30];
    const colPositions = [25, 105, 130, 155];

    // Header Background
    doc.setFillColor(248, 250, 252);
    doc.rect(20, tableStartY - 2, 170, rowHeight, 'F');

    // Header Text
    doc.setFontSize(10);
    doc.setFont('helvetica', 'bold');
    doc.setTextColor(55, 65, 81);
    doc.text('Service Name', colPositions[0], tableStartY + 4);
    doc.text('Duration', colPositions[1], tableStartY + 4);
    doc.text('Category', colPositions[2], tableStartY + 4);
    doc.text('Amount', colPositions[3], tableStartY + 4);

    yPosition = tableStartY + rowHeight;

    // Table Border
    doc.setDrawColor(229, 231, 235);
    doc.setLineWidth(0.5);
    doc.line(20, tableStartY - 2, 190, tableStartY - 2);
    doc.line(20, yPosition, 190, yPosition);

    // Service Rows
    doc.setFont('helvetica', 'normal');
    doc.setTextColor(0, 0, 0);

    payment.services.forEach((service, index) => {
      const isEvenRow = index % 2 === 0;
      
      // Alternate row background
      if (isEvenRow) {
        doc.setFillColor(249, 250, 251);
        doc.rect(20, yPosition, 170, rowHeight, 'F');
      }

      // Service details
      doc.setFontSize(9);
      
      // Service name (truncate if too long)
      const serviceName = service.name.length > 35 ? service.name.substring(0, 32) + '...' : service.name;
      doc.text(serviceName, colPositions[0], yPosition + 5);
      
      // Duration
      doc.text(`${service.duration} min`, colPositions[1], yPosition + 5);
      
      // Category
      doc.text(service.category === 'bridal' ? 'Bridal' : 'Regular', colPositions[2], yPosition + 5);
      
      // Amount
      doc.text(`₹${service.price.toLocaleString()}`, colPositions[3], yPosition + 5);

      yPosition += rowHeight;
      
      // Row border
      doc.line(20, yPosition, 190, yPosition);
    });

    return yPosition + 5;
  }

  private addTotalSection(doc: jsPDF, payment: PaymentHistory, yPosition: number): number {
    // Total section background
    doc.setFillColor(236, 72, 153);
    doc.rect(120, yPosition, 70, 15, 'F');

    // Total text
    doc.setTextColor(255, 255, 255);
    doc.setFontSize(12);
    doc.setFont('helvetica', 'bold');
    doc.text('TOTAL AMOUNT:', 125, yPosition + 6);
    doc.setFontSize(14);
    doc.text(`₹${payment.amount.toLocaleString()}`, 125, yPosition + 12);

    return yPosition + 25;
  }

  private addPaymentStatus(doc: jsPDF, payment: PaymentHistory, yPosition: number): number {
    // Status section
    doc.setFontSize(12);
    doc.setFont('helvetica', 'bold');
    
    const statusColors = {
      paid: [34, 197, 94],    // Green
      pending: [251, 191, 36], // Yellow
      failed: [239, 68, 68],   // Red
      refunded: [59, 130, 246] // Blue
    };

    const statusColor = statusColors[payment.paymentStatus as keyof typeof statusColors] || [107, 114, 128];
    
    doc.setTextColor(...statusColor);
    doc.text('Payment Status:', 25, yPosition);
    doc.text(payment.paymentStatus.toUpperCase(), 70, yPosition);

    // Add notes if available
    if (payment.notes) {
      yPosition += 10;
      doc.setFontSize(10);
      doc.setFont('helvetica', 'normal');
      doc.setTextColor(75, 85, 99);
      doc.text('Notes:', 25, yPosition);
      
      // Split notes into multiple lines if too long
      const noteLines = doc.splitTextToSize(payment.notes, 140);
      doc.text(noteLines, 25, yPosition + 6);
      yPosition += (noteLines.length * 5) + 5;
    }

    return yPosition + 15;
  }

  private addFooter(doc: jsPDF): void {
    const pageHeight = doc.internal.pageSize.height;
    const footerY = pageHeight - 40;

    // Footer line
    doc.setDrawColor(229, 231, 235);
    doc.setLineWidth(1);
    doc.line(20, footerY, 190, footerY);

    // Thank you message
    doc.setFontSize(12);
    doc.setFont('helvetica', 'bold');
    doc.setTextColor(236, 72, 153);
    doc.text('Thank you for choosing AKSHATA PARLOR!', 105, footerY + 10, { align: 'center' });

    // Footer text
    doc.setFontSize(9);
    doc.setFont('helvetica', 'normal');
    doc.setTextColor(107, 114, 128);
    doc.text('This is a computer-generated receipt and does not require a signature.', 105, footerY + 18, { align: 'center' });
    doc.text('For any queries, please contact us at +91 98765 43210 or info@akshataparlor.com', 105, footerY + 25, { align: 'center' });

    // Copyright
    doc.setFontSize(8);
    doc.text(`© ${new Date().getFullYear()} AKSHATA PARLOR. All rights reserved.`, 105, footerY + 32, { align: 'center' });
  }

  generateReceipt(payment: PaymentHistory): void {
    try {
      // Create new PDF document
      const doc = new jsPDF();
      
      let yPosition = 80;

      // Add header
      this.addHeader(doc);

      // Add receipt title
      yPosition = this.addReceiptTitle(doc, yPosition);

      // Add payment information
      yPosition = this.addPaymentInfo(doc, payment, yPosition);

      // Add services table
      yPosition = this.addServicesTable(doc, payment, yPosition);

      // Add total section
      yPosition = this.addTotalSection(doc, payment, yPosition);

      // Add payment status and notes
      yPosition = this.addPaymentStatus(doc, payment, yPosition);

      // Add footer
      this.addFooter(doc);

      // Generate filename
      const date = new Date(payment.transactionDate).toISOString().split('T')[0];
      const filename = `AKSHATA_PARLOR_Receipt_${payment.id}_${date}.pdf`;

      // Save the PDF
      doc.save(filename);

      console.log('✅ PDF receipt generated successfully:', filename);

    } catch (error) {
      console.error('❌ Error generating PDF receipt:', error);
      throw new Error('Failed to generate PDF receipt. Please try again.');
    }
  }

  // Generate receipt with custom styling
  generateDetailedReceipt(payment: PaymentHistory): void {
    try {
      const doc = new jsPDF();
      let yPosition = 80;

      // Add header with enhanced styling
      this.addHeader(doc);

      // Add receipt title
      yPosition = this.addReceiptTitle(doc, yPosition);

      // Add a decorative line
      doc.setDrawColor(236, 72, 153);
      doc.setLineWidth(1);
      doc.line(25, yPosition, 185, yPosition);
      yPosition += 10;

      // Add payment information with enhanced layout
      yPosition = this.addPaymentInfo(doc, payment, yPosition);

      // Add decorative separator
      doc.setDrawColor(229, 231, 235);
      doc.setLineWidth(0.5);
      doc.line(25, yPosition, 185, yPosition);
      yPosition += 10;

      // Add services table with enhanced styling
      yPosition = this.addServicesTable(doc, payment, yPosition);

      // Add total section with enhanced styling
      yPosition = this.addTotalSection(doc, payment, yPosition);

      // Add payment status
      yPosition = this.addPaymentStatus(doc, payment, yPosition);

      // Add QR code placeholder (for future implementation)
      if (payment.paymentStatus === 'paid') {
        doc.setFontSize(8);
        doc.setTextColor(107, 114, 128);
        doc.text('Scan QR code for digital verification (Coming Soon)', 105, yPosition, { align: 'center' });
        yPosition += 10;
      }

      // Add footer
      this.addFooter(doc);

      // Generate filename with timestamp
      const timestamp = new Date().toISOString().replace(/[:.]/g, '-').split('T')[0];
      const filename = `AKSHATA_PARLOR_Detailed_Receipt_${payment.id}_${timestamp}.pdf`;

      // Save the PDF
      doc.save(filename);

      console.log('✅ Detailed PDF receipt generated successfully:', filename);

    } catch (error) {
      console.error('❌ Error generating detailed PDF receipt:', error);
      throw new Error('Failed to generate detailed PDF receipt. Please try again.');
    }
  }

  // Preview receipt (opens in new tab instead of downloading)
  previewReceipt(payment: PaymentHistory): void {
    try {
      const doc = new jsPDF();
      let yPosition = 80;

      this.addHeader(doc);
      yPosition = this.addReceiptTitle(doc, yPosition);
      yPosition = this.addPaymentInfo(doc, payment, yPosition);
      yPosition = this.addServicesTable(doc, payment, yPosition);
      yPosition = this.addTotalSection(doc, payment, yPosition);
      yPosition = this.addPaymentStatus(doc, payment, yPosition);
      this.addFooter(doc);

      // Open in new tab for preview
      const pdfBlob = doc.output('blob');
      const pdfUrl = URL.createObjectURL(pdfBlob);
      window.open(pdfUrl, '_blank');

      console.log('✅ PDF receipt preview opened successfully');

    } catch (error) {
      console.error('❌ Error previewing PDF receipt:', error);
      throw new Error('Failed to preview PDF receipt. Please try again.');
    }
  }
}

export default PDFService;