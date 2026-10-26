import fs from 'fs';
import path from 'path';
import { jsPDF } from 'jspdf';

// ---------------------------------------------------------------------------
// Configuration & Constants
// ---------------------------------------------------------------------------
const PAGE_WIDTH = 595.28;  // A4 width in pt
const PAGE_HEIGHT = 841.89; // A4 height in pt
const MARGIN_LEFT = 54;     // 0.75 in
const MARGIN_RIGHT = 54;
const MARGIN_TOP = 58;
const MARGIN_BOTTOM = 58;
const CONTENT_WIDTH = PAGE_WIDTH - MARGIN_LEFT - MARGIN_RIGHT; // 487.28 pt

// Colors
const COLOR_PRIMARY = [15, 23, 42];       // #0f172a slate-900
const COLOR_HEADING = [30, 41, 59];       // #1e293b slate-800
const COLOR_TEXT = [51, 65, 85];          // #334155 slate-700
const COLOR_MUTED = [100, 116, 139];      // #64748b slate-500
const COLOR_ACCENT = [2, 132, 199];       // #0284c7 sky-600
const COLOR_CODE_BG = [248, 250, 252];    // #f8fafc slate-50
const COLOR_CODE_BORDER = [226, 232, 240];// #e2e8f0 slate-200
const COLOR_TABLE_HDR = [30, 41, 59];     // Slate 800
const COLOR_TABLE_ALT = [248, 250, 252];
const COLOR_BORDER = [203, 213, 225];     // #cbd5e1 slate-300

class BlackBookPDFBuilder {
  constructor(markdownText) {
    this.rawText = markdownText;
    this.doc = new jsPDF({ unit: 'pt', format: 'a4', orientation: 'portrait' });
    this.cursorY = MARGIN_TOP;
    this.pageNumber = 1;
    this.isCoverPage = true;
  }

  // Check if we need to advance to a new page
  ensureSpace(neededHeight) {
    if (this.cursorY + neededHeight > PAGE_HEIGHT - MARGIN_BOTTOM) {
      this.addNewPage();
      return true;
    }
    return false;
  }

  addNewPage() {
    this.doc.addPage();
    this.pageNumber++;
    this.cursorY = MARGIN_TOP;
  }

  // Draw running header and footer on standard content pages
  drawDecorations() {
    const totalPages = this.doc.getNumberOfPages();
    for (let i = 1; i <= totalPages; i++) {
      this.doc.setPage(i);

      // Skip headers/footers for cover page
      if (i === 1) {
        // Draw elegant double border on cover page
        this.doc.setDrawColor(...COLOR_PRIMARY);
        this.doc.setLineWidth(2.5);
        this.doc.rect(28, 28, PAGE_WIDTH - 56, PAGE_HEIGHT - 56);
        this.doc.setLineWidth(0.8);
        this.doc.rect(32, 32, PAGE_WIDTH - 64, PAGE_HEIGHT - 64);
        continue;
      }

      if (i === 2 || i === 3) {
        // Subtle single border for Proforma and Certificate
        this.doc.setDrawColor(...COLOR_BORDER);
        this.doc.setLineWidth(1);
        this.doc.rect(34, 34, PAGE_WIDTH - 68, PAGE_HEIGHT - 68);
      }

      // Running Header (pages 4 and later)
      if (i >= 4) {
        this.doc.setFont('helvetica', 'normal');
        this.doc.setFontSize(8);
        this.doc.setTextColor(...COLOR_MUTED);
        this.doc.text('RESUMEATS AI: INTELLIGENT ATS RESUME ANALYZER', MARGIN_LEFT, 38);
        this.doc.text('BLACK BOOK PROJECT REPORT', PAGE_WIDTH - MARGIN_RIGHT, 38, { align: 'right' });
        this.doc.setDrawColor(...COLOR_CODE_BORDER);
        this.doc.setLineWidth(0.75);
        this.doc.line(MARGIN_LEFT, 44, PAGE_WIDTH - MARGIN_RIGHT, 44);
      }

      // Running Footer (pages 2 and later)
      if (i >= 2) {
        this.doc.setDrawColor(...COLOR_CODE_BORDER);
        this.doc.setLineWidth(0.75);
        this.doc.line(MARGIN_LEFT, PAGE_HEIGHT - 40, PAGE_WIDTH - MARGIN_RIGHT, PAGE_HEIGHT - 40);
        
        this.doc.setFont('helvetica', 'normal');
        this.doc.setFontSize(8);
        this.doc.setTextColor(...COLOR_MUTED);
        this.doc.text('Mr. Rushikesh Anil Khairnar (Seat No. 5144985) | Dept. of Information Technology, B. K. Birla College', MARGIN_LEFT, PAGE_HEIGHT - 28);
        
        let pageStr = `Page ${i}`;
        this.doc.text(pageStr, PAGE_WIDTH - MARGIN_RIGHT, PAGE_HEIGHT - 28, { align: 'right' });
      }
    }
  }

  // Render Cover / Title Page
  renderCoverPage() {
    this.cursorY = 70;
    
    // Top University Super-heading
    this.doc.setFont('helvetica', 'bold');
    this.doc.setFontSize(11);
    this.doc.setTextColor(...COLOR_MUTED);
    this.doc.text('ACADEMIC PROJECT REPORT (BLACK BOOK)', PAGE_WIDTH / 2, this.cursorY, { align: 'center' });
    this.cursorY += 28;

    // Project Title
    this.doc.setFont('helvetica', 'bold');
    this.doc.setFontSize(20);
    this.doc.setTextColor(...COLOR_PRIMARY);
    const titleLines = this.doc.splitTextToSize(
      'RESUMEATS AI: AN INTELLIGENT ATS RESUME ANALYZER & CAREER INTELLIGENCE PLATFORM',
      CONTENT_WIDTH - 20
    );
    titleLines.forEach(tl => {
      this.doc.text(tl, PAGE_WIDTH / 2, this.cursorY, { align: 'center' });
      this.cursorY += 24;
    });

    // Decorative divider line
    this.cursorY += 10;
    this.doc.setDrawColor(...COLOR_ACCENT);
    this.doc.setLineWidth(2);
    this.doc.line(PAGE_WIDTH / 2 - 90, this.cursorY, PAGE_WIDTH / 2 + 90, this.cursorY);
    this.cursorY += 26;

    // Subtitle
    this.doc.setFont('helvetica', 'normal');
    this.doc.setFontSize(10.5);
    this.doc.setTextColor(...COLOR_TEXT);
    this.doc.text('A Project Report Submitted in Partial Fulfilment of the Requirements', PAGE_WIDTH / 2, this.cursorY, { align: 'center' });
    this.cursorY += 16;
    this.doc.text('for the Award of the Degree of', PAGE_WIDTH / 2, this.cursorY, { align: 'center' });
    this.cursorY += 20;

    // Degree Name
    this.doc.setFont('helvetica', 'bold');
    this.doc.setFontSize(13);
    this.doc.setTextColor(...COLOR_PRIMARY);
    this.doc.text('BACHELOR OF SCIENCE', PAGE_WIDTH / 2, this.cursorY, { align: 'center' });
    this.cursorY += 16;
    this.doc.setFontSize(11.5);
    this.doc.text('(INFORMATION TECHNOLOGY)', PAGE_WIDTH / 2, this.cursorY, { align: 'center' });
    this.cursorY += 45;

    // Submitted by section
    this.doc.setFont('helvetica', 'normal');
    this.doc.setFontSize(10);
    this.doc.setTextColor(...COLOR_MUTED);
    this.doc.text('Submitted By:', PAGE_WIDTH / 2, this.cursorY, { align: 'center' });
    this.cursorY += 16;

    this.doc.setFont('helvetica', 'bold');
    this.doc.setFontSize(13.5);
    this.doc.setTextColor(...COLOR_PRIMARY);
    this.doc.text('Mr. Rushikesh Anil Khairnar', PAGE_WIDTH / 2, this.cursorY, { align: 'center' });
    this.cursorY += 15;

    this.doc.setFont('helvetica', 'normal');
    this.doc.setFontSize(10);
    this.doc.setTextColor(...COLOR_TEXT);
    this.doc.text('Seat No.: 5144985  |  PRN: 2022016401830893', PAGE_WIDTH / 2, this.cursorY, { align: 'center' });
    this.cursorY += 35;

    // Guidance section
    this.doc.setFont('helvetica', 'normal');
    this.doc.setFontSize(10);
    this.doc.setTextColor(...COLOR_MUTED);
    this.doc.text('Under the Esteemed Guidance of:', PAGE_WIDTH / 2, this.cursorY, { align: 'center' });
    this.cursorY += 16;

    this.doc.setFont('helvetica', 'bold');
    this.doc.setFontSize(12.5);
    this.doc.setTextColor(...COLOR_PRIMARY);
    this.doc.text('Ms. Kajal Jaisinghani', PAGE_WIDTH / 2, this.cursorY, { align: 'center' });
    this.cursorY += 14;

    this.doc.setFont('helvetica', 'normal');
    this.doc.setFontSize(9.5);
    this.doc.setTextColor(...COLOR_TEXT);
    this.doc.text('(Head, Dept of I.T / Assistant Professor)', PAGE_WIDTH / 2, this.cursorY, { align: 'center' });
    this.cursorY += 13;
    this.doc.text('Department of Information Technology', PAGE_WIDTH / 2, this.cursorY, { align: 'center' });
    this.cursorY += 50;

    // Institution & Year
    this.doc.setFont('helvetica', 'bold');
    this.doc.setFontSize(12.5);
    this.doc.setTextColor(...COLOR_PRIMARY);
    this.doc.text('B. K. BIRLA COLLEGE, KALYAN', PAGE_WIDTH / 2, this.cursorY, { align: 'center' });
    this.cursorY += 16;

    this.doc.setFont('helvetica', 'normal');
    this.doc.setFontSize(10);
    this.doc.setTextColor(...COLOR_TEXT);
    this.doc.text('(EMPOWERED AUTONOMOUS STATUS)', PAGE_WIDTH / 2, this.cursorY, { align: 'center' });
    this.cursorY += 15;
    this.doc.text('(Affiliated to University of Mumbai)', PAGE_WIDTH / 2, this.cursorY, { align: 'center' });
    this.cursorY += 15;
    this.doc.text('KALYAN, 421304 MAHARASHTRA', PAGE_WIDTH / 2, this.cursorY, { align: 'center' });
    this.cursorY += 22;

    this.doc.setFont('helvetica', 'bold');
    this.doc.setFontSize(11);
    this.doc.setTextColor(...COLOR_ACCENT);
    this.doc.text('ACADEMIC YEAR: 2024 – 2025', PAGE_WIDTH / 2, this.cursorY, { align: 'center' });
  }

  // Draw a markdown table with styled headers, alternating row striping, borders, and wrapped text
  renderTable(tableLines) {
    if (tableLines.length < 2) return;

    // Extract headers and data rows
    const parseRow = (line) => {
      return line
        .replace(/^\|/, '')
        .replace(/\|$/, '')
        .split('|')
        .map(cell => cell.trim().replace(/<br\s*\/?>/gi, '\n'));
    };

    const headerRow = parseRow(tableLines[0]);
    const dataRows = [];
    for (let i = 2; i < tableLines.length; i++) {
      if (tableLines[i].trim().startsWith('|')) {
        dataRows.push(parseRow(tableLines[i]));
      }
    }

    if (headerRow.length === 0) return;

    const numCols = headerRow.length;
    // Compute column widths
    let colWidths = [];
    if (numCols === 2) {
      colWidths = [140, CONTENT_WIDTH - 140];
    } else if (numCols === 3) {
      colWidths = [120, 260, CONTENT_WIDTH - 380];
    } else if (numCols === 4) {
      colWidths = [80, 160, 160, 87];
    } else if (numCols === 5) {
      colWidths = [60, 140, 140, 95, 52];
    } else {
      const avg = CONTENT_WIDTH / numCols;
      colWidths = Array(numCols).fill(avg);
    }

    const rowPadding = 6;
    const fontSize = 8.5;
    const lineHeight = 11;

    // Helper to calculate row height
    const getRowHeight = (cells, fontStyle = 'normal') => {
      this.doc.setFont('helvetica', fontStyle);
      this.doc.setFontSize(fontSize);
      let maxLines = 1;
      cells.forEach((cell, idx) => {
        const textWithoutMarkdown = cell.replace(/\*\*/g, '').replace(/###/g, '');
        const w = (colWidths[idx] || 80) - 12;
        const lines = this.doc.splitTextToSize(textWithoutMarkdown, Math.max(w, 20));
        if (lines.length > maxLines) maxLines = lines.length;
      });
      return Math.max(20, maxLines * lineHeight + rowPadding * 2);
    };

    // Render Table Header
    const headerHeight = getRowHeight(headerRow, 'bold');
    this.ensureSpace(headerHeight + 25);

    let curX = MARGIN_LEFT;
    this.doc.setFillColor(...COLOR_TABLE_HDR);
    this.doc.rect(curX, this.cursorY, CONTENT_WIDTH, headerHeight, 'F');

    this.doc.setFont('helvetica', 'bold');
    this.doc.setFontSize(fontSize);
    this.doc.setTextColor(255, 255, 255);

    headerRow.forEach((hText, idx) => {
      const cleanH = hText.replace(/\*\*/g, '');
      const cellW = colWidths[idx] || 80;
      this.doc.text(cleanH, curX + 6, this.cursorY + 14);
      curX += cellW;
    });

    // Header border
    this.doc.setDrawColor(...COLOR_PRIMARY);
    this.doc.setLineWidth(1);
    this.doc.rect(MARGIN_LEFT, this.cursorY, CONTENT_WIDTH, headerHeight, 'S');
    this.cursorY += headerHeight;

    // Render Rows
    dataRows.forEach((rowCells, rIdx) => {
      const rHeight = getRowHeight(rowCells, 'normal');
      this.ensureSpace(rHeight + 5);

      const isAlt = rIdx % 2 === 1;
      this.doc.setFillColor(...(isAlt ? COLOR_TABLE_ALT : [255, 255, 255]));
      this.doc.rect(MARGIN_LEFT, this.cursorY, CONTENT_WIDTH, rHeight, 'F');

      let cellX = MARGIN_LEFT;
      rowCells.forEach((cText, cIdx) => {
        const cellW = colWidths[cIdx] || 80;
        const cleanCell = cText.replace(/\*\*/g, '');
        
        // Format text inside cell
        const isBold = cText.startsWith('**') || cIdx === 0;
        this.doc.setFont('helvetica', isBold ? 'bold' : 'normal');
        this.doc.setFontSize(fontSize);
        this.doc.setTextColor(...(isBold ? COLOR_PRIMARY : COLOR_TEXT));

        const wrapped = this.doc.splitTextToSize(cleanCell, Math.max(cellW - 12, 20));
        let textY = this.cursorY + rowPadding + 8;
        wrapped.forEach(wLine => {
          this.doc.text(wLine, cellX + 6, textY);
          textY += lineHeight;
        });

        // Vertical divider line
        this.doc.setDrawColor(...COLOR_BORDER);
        this.doc.setLineWidth(0.5);
        this.doc.line(cellX + cellW, this.cursorY, cellX + cellW, this.cursorY + rHeight);

        cellX += cellW;
      });

      // Bottom border of row
      this.doc.setDrawColor(...COLOR_BORDER);
      this.doc.setLineWidth(0.5);
      this.doc.line(MARGIN_LEFT, this.cursorY + rHeight, MARGIN_LEFT + CONTENT_WIDTH, this.cursorY + rHeight);

      this.cursorY += rHeight;
    });

    this.cursorY += 15;
  }

  // Render a Code Block
  renderCodeBlock(codeLines, language = '') {
    const codeText = codeLines.join('\n');
    this.doc.setFont('courier', 'normal');
    this.doc.setFontSize(8);
    const splitLines = this.doc.splitTextToSize(codeText, CONTENT_WIDTH - 24);
    const boxHeight = splitLines.length * 11 + 16;

    this.ensureSpace(Math.min(boxHeight, 150));

    // Background card
    this.doc.setFillColor(...COLOR_CODE_BG);
    this.doc.setDrawColor(...COLOR_CODE_BORDER);
    this.doc.setLineWidth(1);
    this.doc.roundedRect(MARGIN_LEFT, this.cursorY, CONTENT_WIDTH, boxHeight, 3, 3, 'FD');

    // Language tag if present
    if (language) {
      this.doc.setFont('helvetica', 'bold');
      this.doc.setFontSize(7.5);
      this.doc.setTextColor(...COLOR_MUTED);
      this.doc.text(language.toUpperCase(), MARGIN_LEFT + CONTENT_WIDTH - 12, this.cursorY + 11, { align: 'right' });
    }

    this.doc.setFont('courier', 'normal');
    this.doc.setFontSize(8);
    this.doc.setTextColor(30, 41, 59);

    let textY = this.cursorY + 14;
    splitLines.forEach(l => {
      if (textY > PAGE_HEIGHT - MARGIN_BOTTOM - 10) {
        this.addNewPage();
        textY = MARGIN_TOP + 10;
      }
      this.doc.text(l, MARGIN_LEFT + 12, textY);
      textY += 11;
    });

    this.cursorY += boxHeight + 14;
  }

  // Render Figure Placeholder Box
  renderFigureBox(figLines) {
    this.ensureSpace(75);
    const boxH = 65;

    this.doc.setFillColor(241, 245, 249); // slate-100
    this.doc.setDrawColor(148, 163, 184); // slate-400
    this.doc.setLineWidth(1);
    this.doc.roundedRect(MARGIN_LEFT, this.cursorY, CONTENT_WIDTH, boxH, 4, 4, 'FD');

    // Inner text
    this.doc.setFont('helvetica', 'bold');
    this.doc.setFontSize(9.5);
    this.doc.setTextColor(...COLOR_PRIMARY);

    const firstLine = figLines[0] || '[SCREENSHOT PLACEHOLDER]';
    this.doc.text(firstLine, PAGE_WIDTH / 2, this.cursorY + 22, { align: 'center' });

    this.doc.setFont('helvetica', 'italic');
    this.doc.setFontSize(8);
    this.doc.setTextColor(...COLOR_MUTED);
    const subText = figLines[1] || 'Insert your application screenshot here';
    this.doc.text(subText, PAGE_WIDTH / 2, this.cursorY + 42, { align: 'center' });

    this.cursorY += boxH + 12;
  }

  // Build the complete document
  generate() {
    const rawLines = this.rawText.split('\n');
    let idx = 0;

    // Process Cover Page
    this.renderCoverPage();
    this.addNewPage();

    // Now loop through remaining lines
    let inTable = false;
    let tableBuffer = [];
    let inCode = false;
    let codeBuffer = [];
    let codeLang = '';
    let inFigBox = false;
    let figBuffer = [];

    while (idx < rawLines.length) {
      const line = rawLines[idx];
      const trimmed = line.trim();

      // Check explicit page break
      if (trimmed === '\\newpage' || trimmed === '<div style="page-break-after: always;"></div>' || (trimmed === '---' && idx > 50)) {
        if (inTable) {
          this.renderTable(tableBuffer);
          inTable = false;
          tableBuffer = [];
        }
        if (inCode) {
          this.renderCodeBlock(codeBuffer, codeLang);
          inCode = false;
          codeBuffer = [];
        }
        this.addNewPage();
        idx++;
        continue;
      }

      // Check Code block fences
      if (trimmed.startsWith('```')) {
        if (!inCode) {
          inCode = true;
          codeLang = trimmed.replace('```', '').trim();
          codeBuffer = [];
        } else {
          inCode = false;
          this.renderCodeBlock(codeBuffer, codeLang);
          codeBuffer = [];
          codeLang = '';
        }
        idx++;
        continue;
      }

      if (inCode) {
        // If it's a figure placeholder box inside code fences
        if (trimmed.startsWith('+--') || trimmed.startsWith('|')) {
          if (trimmed.includes('[FIG')) {
            figBuffer.push(trimmed.replace(/[+|]/g, '').trim());
          } else if (trimmed.includes('Insert')) {
            figBuffer.push(trimmed.replace(/[+|]/g, '').trim());
          }
          if (trimmed.startsWith('+--') && figBuffer.length > 0) {
            this.renderFigureBox(figBuffer);
            figBuffer = [];
            inCode = false;
            codeBuffer = [];
            idx++;
            continue;
          }
          idx++;
          continue;
        }
        codeBuffer.push(line);
        idx++;
        continue;
      }

      // Check Table rows
      if (trimmed.startsWith('|') && trimmed.endsWith('|')) {
        inTable = true;
        tableBuffer.push(trimmed);
        idx++;
        continue;
      } else if (inTable) {
        // Table ended
        this.renderTable(tableBuffer);
        inTable = false;
        tableBuffer = [];
      }

      // Skip HTML tags
      if (trimmed.startsWith('<div') || trimmed.startsWith('</div') || trimmed.startsWith('<table') || trimmed.startsWith('</table') || trimmed.startsWith('<tr') || trimmed.startsWith('</tr') || trimmed.startsWith('<td') || trimmed.startsWith('</td') || trimmed === '<br/>' || trimmed === '<br>') {
        idx++;
        continue;
      }

      // Skip Cover page markdown lines that were already custom rendered
      if (idx < 50 && (trimmed.startsWith('# BLACK BOOK') || trimmed.startsWith('## TITLE PAGE') || trimmed.includes('Mr. Rushikesh Anil Khairnar'))) {
        idx++;
        continue;
      }

      // Blank line
      if (trimmed === '') {
        this.cursorY += 6;
        idx++;
        continue;
      }

      // Major Chapter Heading: # CHAPTER ... or # REFERENCES etc.
      if (trimmed.startsWith('# ')) {
        const title = trimmed.replace(/^#\s+/, '').replace(/\*\*/g, '');
        
        // Start chapters on a fresh page (unless near the top already)
        if (this.cursorY > MARGIN_TOP + 40) {
          this.addNewPage();
        }

        this.ensureSpace(50);
        this.doc.setFont('helvetica', 'bold');
        this.doc.setFontSize(16);
        this.doc.setTextColor(...COLOR_PRIMARY);

        // Highlight ribbon or border
        this.doc.setFillColor(...COLOR_CODE_BG);
        this.doc.rect(MARGIN_LEFT - 4, this.cursorY - 2, CONTENT_WIDTH + 8, 26, 'F');
        this.doc.setFillColor(...COLOR_ACCENT);
        this.doc.rect(MARGIN_LEFT - 4, this.cursorY - 2, 4, 26, 'F');

        this.doc.text(title, MARGIN_LEFT + 8, this.cursorY + 16);
        this.cursorY += 36;
        idx++;
        continue;
      }

      // Level 2 Heading: ## 1.1 Background or ## ABSTRACT etc.
      if (trimmed.startsWith('## ')) {
        const title = trimmed.replace(/^##\s+/, '').replace(/\*\*/g, '');
        
        this.ensureSpace(38);
        this.doc.setFont('helvetica', 'bold');
        this.doc.setFontSize(13);
        this.doc.setTextColor(...COLOR_HEADING);
        this.doc.text(title, MARGIN_LEFT, this.cursorY + 10);
        
        // Small underline for subsections
        this.doc.setDrawColor(...COLOR_CODE_BORDER);
        this.doc.setLineWidth(0.75);
        this.doc.line(MARGIN_LEFT, this.cursorY + 14, MARGIN_LEFT + CONTENT_WIDTH, this.cursorY + 14);
        
        this.cursorY += 24;
        idx++;
        continue;
      }

      // Level 3 Heading: ### 1.3.1 Purpose
      if (trimmed.startsWith('### ')) {
        const title = trimmed.replace(/^###\s+/, '').replace(/\*\*/g, '');
        
        this.ensureSpace(28);
        this.doc.setFont('helvetica', 'bold');
        this.doc.setFontSize(11);
        this.doc.setTextColor(...COLOR_PRIMARY);
        this.doc.text(title, MARGIN_LEFT, this.cursorY + 8);
        this.cursorY += 18;
        idx++;
        continue;
      }

      // Bullet items: - ... or * ...
      if (trimmed.startsWith('- ') || trimmed.startsWith('* ')) {
        const bulletText = trimmed.replace(/^[-*]\s+/, '');
        this.renderBullet(bulletText);
        idx++;
        continue;
      }

      // Numbered lists: 1. ... or 2. ...
      if (/^\d+\.\s+/.test(trimmed)) {
        const match = trimmed.match(/^(\d+\.)\s+(.*)/);
        if (match) {
          this.renderNumbered(match[1], match[2]);
          idx++;
          continue;
        }
      }

      // Blockquotes: > ...
      if (trimmed.startsWith('> ')) {
        const quoteText = trimmed.replace(/^>\s+/, '');
        this.renderBlockquote(quoteText);
        idx++;
        continue;
      }

      // Regular paragraph text
      this.renderParagraph(trimmed);
      idx++;
    }

    // Flush remaining tables or code
    if (inTable && tableBuffer.length > 0) {
      this.renderTable(tableBuffer);
    }
    if (inCode && codeBuffer.length > 0) {
      this.renderCodeBlock(codeBuffer, codeLang);
    }

    // Draw running headers, footers, and page numbers across all generated pages
    this.drawDecorations();

    return this.doc;
  }

  renderBullet(text) {
    this.ensureSpace(16);
    this.doc.setFont('helvetica', 'bold');
    this.doc.setFontSize(10);
    this.doc.setTextColor(...COLOR_ACCENT);
    this.doc.text('•', MARGIN_LEFT + 6, this.cursorY + 6);

    // Format text
    const cleanText = text.replace(/\*\*(.*?)\*\*/g, '$1');
    this.doc.setFont('helvetica', 'normal');
    this.doc.setFontSize(9.5);
    this.doc.setTextColor(...COLOR_TEXT);

    const split = this.doc.splitTextToSize(cleanText, CONTENT_WIDTH - 24);
    let curY = this.cursorY + 6;
    split.forEach(sLine => {
      this.ensureSpace(13);
      this.doc.text(sLine, MARGIN_LEFT + 20, curY);
      curY += 13;
    });
    this.cursorY = curY + 3;
  }

  renderNumbered(numStr, text) {
    this.ensureSpace(16);
    this.doc.setFont('helvetica', 'bold');
    this.doc.setFontSize(9.5);
    this.doc.setTextColor(...COLOR_PRIMARY);
    this.doc.text(numStr, MARGIN_LEFT + 4, this.cursorY + 6);

    const cleanText = text.replace(/\*\*(.*?)\*\*/g, '$1');
    this.doc.setFont('helvetica', 'normal');
    this.doc.setFontSize(9.5);
    this.doc.setTextColor(...COLOR_TEXT);

    const split = this.doc.splitTextToSize(cleanText, CONTENT_WIDTH - 24);
    let curY = this.cursorY + 6;
    split.forEach(sLine => {
      this.ensureSpace(13);
      this.doc.text(sLine, MARGIN_LEFT + 24, curY);
      curY += 13;
    });
    this.cursorY = curY + 3;
  }

  renderBlockquote(text) {
    this.ensureSpace(24);
    const cleanText = text.replace(/\*\*(.*?)\*\*/g, '$1');
    this.doc.setFont('helvetica', 'italic');
    this.doc.setFontSize(9.5);
    this.doc.setTextColor(...COLOR_HEADING);

    const split = this.doc.splitTextToSize(cleanText, CONTENT_WIDTH - 28);
    const boxH = split.length * 13 + 12;

    this.doc.setFillColor(...COLOR_CODE_BG);
    this.doc.rect(MARGIN_LEFT + 10, this.cursorY, CONTENT_WIDTH - 10, boxH, 'F');
    this.doc.setFillColor(...COLOR_ACCENT);
    this.doc.rect(MARGIN_LEFT + 10, this.cursorY, 3, boxH, 'F');

    let textY = this.cursorY + 11;
    split.forEach(l => {
      this.doc.text(l, MARGIN_LEFT + 22, textY);
      textY += 13;
    });

    this.cursorY += boxH + 8;
  }

  renderParagraph(text) {
    this.ensureSpace(16);
    this.doc.setFont('helvetica', 'normal');
    this.doc.setFontSize(9.5);
    this.doc.setTextColor(...COLOR_TEXT);

    const cleanText = text.replace(/\*\*(.*?)\*\*/g, '$1');
    const splitLines = this.doc.splitTextToSize(cleanText, CONTENT_WIDTH);

    splitLines.forEach(lineText => {
      this.ensureSpace(13);
      this.doc.text(lineText, MARGIN_LEFT, this.cursorY + 8);
      this.cursorY += 13;
    });

    this.cursorY += 4;
  }
}

// ---------------------------------------------------------------------------
// Execution
// ---------------------------------------------------------------------------
const mdFilePath = path.resolve(process.cwd(), 'BLACK_BOOK_PROJECT_REPORT.md');
console.log('Reading markdown from:', mdFilePath);
const mdContent = fs.readFileSync(mdFilePath, 'utf8');

const builder = new BlackBookPDFBuilder(mdContent);
const doc = builder.generate();

const totalPages = doc.getNumberOfPages();
console.log(`Successfully generated Black Book PDF with ${totalPages} pages!`);

const pdfBuffer = Buffer.from(doc.output('arraybuffer'));

// Write to root
const rootPdfPath = path.resolve(process.cwd(), 'BLACK_BOOK_PROJECT_REPORT.pdf');
fs.writeFileSync(rootPdfPath, pdfBuffer);
console.log('Saved PDF to root:', rootPdfPath, `(${pdfBuffer.length} bytes)`);

// Write to public directory for direct download/viewing via HTTP
const publicDir = path.resolve(process.cwd(), 'public');
if (!fs.existsSync(publicDir)) {
  fs.mkdirSync(publicDir, { recursive: true });
}
const publicPdfPath = path.resolve(publicDir, 'BLACK_BOOK_PROJECT_REPORT.pdf');
fs.writeFileSync(publicPdfPath, pdfBuffer);
console.log('Saved PDF to public:', publicPdfPath);

// Also copy markdown to public for markdown download if desired
const publicMdPath = path.resolve(publicDir, 'BLACK_BOOK_PROJECT_REPORT.md');
fs.writeFileSync(publicMdPath, mdContent);
console.log('Synced markdown to public:', publicMdPath);
