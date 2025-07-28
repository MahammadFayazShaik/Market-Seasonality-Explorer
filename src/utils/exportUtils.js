import html2canvas from "html2canvas";
import jsPDF from "jspdf";

// Multi-page PDF export
export const exportCalendarToPDF = async (containerId, filename = "market_dashboard") => {
  const pdf = new jsPDF("p", "mm", "a4");
  const pageWidth = pdf.internal.pageSize.getWidth();
  const pageHeight = pdf.internal.pageSize.getHeight();

  const addPageFromElement = async (elementId, isFirstPage = false) => {
    const element = document.getElementById(elementId);
    if (!element) {
      console.warn(`Element with id "${elementId}" not found`);
      return;
    }

    const canvas = await html2canvas(element, {
      scale: 2,
      useCORS: true,
      logging: false,
      windowWidth: element.scrollWidth,
      windowHeight: element.scrollHeight,
    });

    const imgData = canvas.toDataURL("image/png");

    const imgWidth = pageWidth;
    const imgHeight = (canvas.height * imgWidth) / canvas.width;

    if (!isFirstPage) pdf.addPage();

    pdf.addImage(imgData, "PNG", 0, 0, imgWidth, imgHeight > pageHeight ? pageHeight : imgHeight);
  };

  await addPageFromElement("pdf-page-1", true); // First page
  await addPageFromElement("pdf-page-2");       // Second page (charts)

  pdf.save(`${filename}.pdf`);
};
