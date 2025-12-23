import fs from "fs";
import mammoth from "mammoth";

import * as pdfjsLib from "pdfjs-dist/legacy/build/pdf.mjs";


export const extractTextFromFile = async (file) => {
  const fileType = file.mimetype;

  // ================= PDF =================
  if (fileType === "application/pdf") {
    const data = new Uint8Array(fs.readFileSync(file.path));

    const pdf = await pdfjsLib.getDocument({ data }).promise;
    let fullText = "";

    for (let pageNum = 1; pageNum <= pdf.numPages; pageNum++) {
      const page = await pdf.getPage(pageNum);
      const content = await page.getTextContent();

      const pageText = content.items.map(item => item.str).join(" ");
      fullText += pageText + "\n";
    }

    return fullText;
  }

  // ================= DOCX =================
  if (
    fileType ===
    "application/vnd.openxmlformats-officedocument.wordprocessingml.document"
  ) {
    const result = await mammoth.extractRawText({ path: file.path });
    return result.value;
  }

  // ================= TXT =================
  if (fileType === "text/plain") {
    return fs.readFileSync(file.path, "utf-8");
  }

  throw new Error("Unsupported file type");
};
