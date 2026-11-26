import { jsPDF } from 'jspdf';
import html2canvas from 'html2canvas';

// Render an HTML report string into a real PDF and return base64 (no data-uri prefix).
// The HTML is loaded into an off-screen iframe, snapshotted with html2canvas,
// then sliced into A4 pages in jsPDF.
export async function htmlReportToPdfBase64(html: string): Promise<string> {
  const frame = document.createElement('iframe');
  frame.style.position = 'fixed';
  frame.style.left = '-10000px';
  frame.style.top = '0';
  frame.style.width = '800px';
  frame.style.height = '1130px';
  frame.style.border = '0';
  document.body.appendChild(frame);

  try {
    const doc = frame.contentDocument as Document;
    doc.open();
    doc.write(html);
    doc.close();
    // Give layout/fonts a moment to settle.
    await new Promise((r) => setTimeout(r, 350));

    const target = doc.body;
    const canvas = await html2canvas(target, {
      scale: 2,
      backgroundColor: '#ffffff',
      useCORS: true,
      windowWidth: 800,
    });

    const pdf = new jsPDF({ orientation: 'portrait', unit: 'pt', format: 'a4', compress: true });
    const pageW = pdf.internal.pageSize.getWidth();
    const pageH = pdf.internal.pageSize.getHeight();
    const imgW = pageW;
    const imgH = (canvas.height * imgW) / canvas.width;

    const imgData = canvas.toDataURL('image/jpeg', 0.85);
    let remaining = imgH;
    let y = 0;
    // First page
    pdf.addImage(imgData, 'JPEG', 0, y, imgW, imgH);
    remaining -= pageH;
    // Additional pages, shifted up
    while (remaining > 0) {
      y -= pageH;
      pdf.addPage();
      pdf.addImage(imgData, 'JPEG', 0, y, imgW, imgH);
      remaining -= pageH;
    }

    const dataUri = pdf.output('datauristring');
    const comma = dataUri.indexOf(',');
    return comma >= 0 ? dataUri.slice(comma + 1) : dataUri;
  } finally {
    document.body.removeChild(frame);
  }
}
