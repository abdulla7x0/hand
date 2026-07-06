import { jsPDF } from "jspdf";
import { PalmAnalysisReport, AstrologyProfile } from "./astrologyData";

export function generatePDFReport(report: PalmAnalysisReport, profile?: AstrologyProfile) {
  const doc = new jsPDF({
    orientation: "portrait",
    unit: "mm",
    format: "a4",
  });

  const pageWidth = doc.internal.pageSize.getWidth();
  const pageHeight = doc.internal.pageSize.getHeight();
  const margin = 15;
  const contentWidth = pageWidth - 2 * margin;

  // Helper to draw gold decorative borders
  const drawPageDecorations = (pageNum: number) => {
    // Background deep purple tone overlay
    doc.setFillColor(18, 4, 30);
    // Draw top luxury banner border
    doc.setFillColor(230, 184, 92); // Gold color
    doc.rect(5, 5, pageWidth - 10, 2, "F");
    doc.rect(5, pageHeight - 7, pageWidth - 10, 2, "F");
    
    // Thin gold border
    doc.setDrawColor(230, 184, 92);
    doc.setLineWidth(0.3);
    doc.rect(margin - 5, margin - 5, pageWidth - 2 * (margin - 5), pageHeight - 2 * (margin - 5));

    // Footer
    doc.setFont("helvetica", "normal");
    doc.setFontSize(8);
    doc.setTextColor(150, 150, 150);
    doc.text(`Jyotish AI | Cosmic Destiny Report`, margin, pageHeight - 12);
    doc.text(`Page ${pageNum}`, pageWidth - margin - 15, pageHeight - 12);
  };

  // --- PAGE 1: COVER PAGE ---
  drawPageDecorations(1);

  // Sacred Geometry Circle Mock
  doc.setDrawColor(230, 184, 92);
  doc.setLineWidth(0.5);
  doc.circle(pageWidth / 2, 70, 35, "S");
  doc.setLineWidth(0.2);
  doc.circle(pageWidth / 2, 70, 32, "S");
  doc.circle(pageWidth / 2, 70, 28, "S");
  
  // Star marks inside circle
  doc.setFont("helvetica", "bold");
  doc.setFontSize(14);
  doc.setTextColor(230, 184, 92);
  doc.text("JYOTISH AI", pageWidth / 2 - 16, 73);

  // Title
  doc.setFont("helvetica", "bold");
  doc.setFontSize(28);
  doc.setTextColor(18, 4, 30);
  doc.text("COSMIC DESTINY", pageWidth / 2 - 45, 125);
  
  doc.setFontSize(20);
  doc.setTextColor(126, 91, 239);
  doc.text("AI Palm Analysis & Astro Report", pageWidth / 2 - 48, 137);

  // User details block
  doc.setFillColor(245, 243, 247);
  doc.rect(margin, 160, contentWidth, 50, "F");
  
  doc.setFont("helvetica", "bold");
  doc.setFontSize(12);
  doc.setTextColor(18, 4, 30);
  doc.text(`Prepared for: ${profile?.name || "Seeker of Light"}`, margin + 10, 172);
  
  doc.setFont("helvetica", "normal");
  doc.setFontSize(10);
  doc.setTextColor(50, 50, 50);
  doc.text(`Date of Birth: ${profile?.birthDate || "N/A"}`, margin + 10, 182);
  doc.text(`Time of Birth: ${profile?.birthTime || "N/A"}`, margin + 10, 188);
  doc.text(`Place of Birth: ${profile?.birthPlace || "N/A"}`, margin + 10, 194);
  doc.text(`Zodiac Constellation: ${profile?.zodiacSign || "Leo"} (Moon: ${profile?.moonSign || "N/A"}, Rising: ${profile?.risingSign || "N/A"})`, margin + 10, 202);

  // Disclaimer
  doc.setFont("helvetica", "italic");
  doc.setFontSize(8);
  doc.setTextColor(120, 120, 120);
  doc.text("Disclaimer: For entertainment and spiritual guidance only. Insights are not scientifically proven.", margin, 250);

  // --- PAGE 2: PALM ANALYSIS & SCORES ---
  doc.addPage();
  drawPageDecorations(2);

  doc.setFont("helvetica", "bold");
  doc.setFontSize(18);
  doc.setTextColor(18, 4, 30);
  doc.text("PART I: PALM LINE READINGS", margin, 25);
  
  doc.setDrawColor(126, 91, 239);
  doc.setLineWidth(1);
  doc.line(margin, 28, margin + 40, 28);

  // Scores table
  doc.setFont("helvetica", "bold");
  doc.setFontSize(11);
  doc.setTextColor(18, 4, 30);
  doc.text("ASTRAL LINE INDICES", margin, 38);

  let yOffset = 46;
  const metrics = [
    { label: "Personality Alignment Score", score: report.scores.personality },
    { label: "Confidence Quotient", score: report.scores.confidence },
    { label: "Leadership Core Index", score: report.scores.leadership },
    { label: "Creativity & Expression Potential", score: report.scores.creativity },
    { label: "Communication Intelligence", score: report.scores.communication },
    { label: "Emotional Intelligence (EQ)", score: report.scores.eq },
  ];

  metrics.forEach((m) => {
    doc.setFont("helvetica", "normal");
    doc.setFontSize(9);
    doc.setTextColor(60, 60, 60);
    doc.text(m.label, margin, yOffset);
    
    // Draw score bar background
    doc.setFillColor(235, 230, 240);
    doc.rect(margin + 75, yOffset - 3, 50, 4, "F");
    // Draw score fill
    doc.setFillColor(126, 91, 239);
    doc.rect(margin + 75, yOffset - 3, (m.score / 100) * 50, 4, "F");
    
    doc.setFont("helvetica", "bold");
    doc.setTextColor(18, 4, 30);
    doc.text(`${m.score}%`, margin + 130, yOffset);
    yOffset += 10;
  });

  // Lines Reading Details
  yOffset += 5;
  doc.setFont("helvetica", "bold");
  doc.setFontSize(12);
  doc.setTextColor(18, 4, 30);
  doc.text("TRACED PALM LINES INTERPRETATION", margin, yOffset);
  doc.line(margin, yOffset + 2, margin + 80, yOffset + 2);
  yOffset += 8;

  const linesList = [
    report.lines.heart,
    report.lines.head,
    report.lines.life,
    report.lines.fate,
  ];

  linesList.forEach((line) => {
    doc.setFont("helvetica", "bold");
    doc.setFontSize(10);
    doc.setTextColor(126, 91, 239);
    doc.text(`${line.name} — ${line.type}`, margin, yOffset);
    
    doc.setFont("helvetica", "normal");
    doc.setFontSize(9);
    doc.setTextColor(50, 50, 50);
    
    const lines = doc.splitTextToSize(line.description, contentWidth);
    doc.text(lines, margin, yOffset + 4.5);
    yOffset += 4.5 + lines.length * 4.5 + 4;
  });

  // --- PAGE 3: MOUNTS, CAREER & WEALTH ---
  doc.addPage();
  drawPageDecorations(3);

  doc.setFont("helvetica", "bold");
  doc.setFontSize(18);
  doc.setTextColor(18, 4, 30);
  doc.text("PART II: MOUNTS & MATERIAL LIFE", margin, 25);
  doc.line(margin, 28, margin + 40, 28);

  // Mounts list
  yOffset = 38;
  doc.setFont("helvetica", "bold");
  doc.setFontSize(11);
  doc.setTextColor(18, 4, 30);
  doc.text("PLANETARY MOUNTS ANALYSIS", margin, yOffset);
  yOffset += 6;

  const mountsList = [
    report.mounts.jupiter,
    report.mounts.saturn,
    report.mounts.apollo,
    report.mounts.mercury,
  ];

  mountsList.forEach((mount) => {
    doc.setFont("helvetica", "bold");
    doc.setFontSize(9.5);
    doc.setTextColor(18, 4, 30);
    doc.text(`${mount.name} (${mount.strength})`, margin, yOffset);
    
    doc.setFont("helvetica", "normal");
    doc.setFontSize(9);
    doc.setTextColor(65, 65, 65);
    const mLines = doc.splitTextToSize(mount.description, contentWidth);
    doc.text(mLines, margin, yOffset + 4);
    yOffset += 4 + mLines.length * 4.5 + 3;
  });

  // Career & Wealth Outlook
  yOffset += 4;
  doc.setFont("helvetica", "bold");
  doc.setFontSize(12);
  doc.setTextColor(18, 4, 30);
  doc.text("CAREER GUIDANCE & WEALTH POTENTIAL", margin, yOffset);
  doc.line(margin, yOffset + 2, margin + 80, yOffset + 2);
  yOffset += 8;

  // Career text
  doc.setFont("helvetica", "bold");
  doc.setFontSize(9.5);
  doc.setTextColor(126, 91, 239);
  doc.text(`Suggested Careers: ${report.career.suggested.join(", ")}`, margin, yOffset);
  doc.text(`Career Success Index: ${report.career.successScore}%`, margin + 110, yOffset);
  yOffset += 5;

  doc.setFont("helvetica", "normal");
  doc.setFontSize(9);
  doc.setTextColor(50, 50, 50);
  const careerText = doc.splitTextToSize(report.career.guidance, contentWidth);
  doc.text(careerText, margin, yOffset);
  yOffset += careerText.length * 4.5 + 6;

  // Wealth Text
  doc.setFont("helvetica", "bold");
  doc.setFontSize(9.5);
  doc.setTextColor(230, 184, 92);
  doc.text(`Wealth Potential: ${report.wealth.wealthPotential}% | Financial Discipline: ${report.wealth.disciplineScore}%`, margin, yOffset);
  yOffset += 5;

  doc.setFont("helvetica", "normal");
  doc.setFontSize(9);
  doc.setTextColor(50, 50, 50);
  const wealthText = doc.splitTextToSize(report.wealth.guidance, contentWidth);
  doc.text(wealthText, margin, yOffset);

  // --- PAGE 4: FUTURE TIMELINE, REMEDIES ---
  doc.addPage();
  drawPageDecorations(4);

  doc.setFont("helvetica", "bold");
  doc.setFontSize(18);
  doc.setTextColor(18, 4, 30);
  doc.text("PART III: FUTURE TIMELINE & ALIGNMENT", margin, 25);
  doc.line(margin, 28, margin + 40, 28);

  // Timeline
  yOffset = 38;
  doc.setFont("helvetica", "bold");
  doc.setFontSize(11);
  doc.setTextColor(18, 4, 30);
  doc.text("PROPHECIED TIMELINE (2026 - 2030)", margin, yOffset);
  yOffset += 7;

  const timelineYears = [
    { year: "2026", desc: report.futureTimeline.year2026 },
    { year: "2027", desc: report.futureTimeline.year2027 },
    { year: "2028", desc: report.futureTimeline.year2028 },
    { year: "2029", desc: report.futureTimeline.year2029 },
    { year: "2030", desc: report.futureTimeline.year2030 },
  ];

  timelineYears.forEach((t) => {
    doc.setFont("helvetica", "bold");
    doc.setFontSize(9.5);
    doc.setTextColor(126, 91, 239);
    doc.text(t.year, margin, yOffset);
    
    doc.setFont("helvetica", "normal");
    doc.setFontSize(9);
    doc.setTextColor(50, 50, 50);
    const tLines = doc.splitTextToSize(t.desc, contentWidth - 15);
    doc.text(tLines, margin + 15, yOffset);
    yOffset += Math.max(tLines.length * 4.5, 6) + 4;
  });

  // Remedies Section
  yOffset += 2;
  doc.setFont("helvetica", "bold");
  doc.setFontSize(12);
  doc.setTextColor(18, 4, 30);
  doc.text("RECOMMENDED ASTRAL REMEDIES & MANTRAS", margin, yOffset);
  doc.line(margin, yOffset + 2, margin + 80, yOffset + 2);
  yOffset += 8;

  report.remedies.forEach((rem) => {
    doc.setFont("helvetica", "bold");
    doc.setFontSize(9.5);
    doc.setTextColor(230, 184, 92);
    doc.text(`${rem.title} [${rem.type}]`, margin, yOffset);
    yOffset += 4.5;
    
    doc.setFont("helvetica", "normal");
    doc.setFontSize(8.5);
    doc.setTextColor(60, 60, 60);
    const rLines = doc.splitTextToSize(rem.description, contentWidth);
    doc.text(rLines, margin, yOffset);
    yOffset += rLines.length * 4.2 + 2;

    if (rem.mantra) {
      doc.setFont("helvetica", "italic");
      doc.setTextColor(100, 100, 100);
      doc.text(`Sanskrit Shloka / Mantra: "${rem.mantra}"`, margin + 5, yOffset);
      yOffset += 5;
    }
    yOffset += 2;
  });

  // Save the PDF
  const filename = `${profile?.name?.replace(/\s+/g, "_") || "AstroSeeker"}_Jyotish_Destiny_Report.pdf`;
  doc.save(filename);
}
export default generatePDFReport;
