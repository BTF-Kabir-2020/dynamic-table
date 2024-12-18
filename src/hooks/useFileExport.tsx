// /hooks/useFileExport.ts
"use client";
import * as XLSX from "xlsx";

export const useFileExport = () => {
  const downloadFile = (blob: Blob, fileName: string) => {
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = fileName;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  };

  const exportToJson = (data: any[], fileName: string = "data.json") => {
    const jsonData = JSON.stringify(data, null, 2);
    const blob = new Blob([jsonData], { type: "application/json" });
    downloadFile(blob, fileName);
  };

  const exportToCsv = (data: any[], fileName: string = "data.csv") => {
    const ws = XLSX.utils.json_to_sheet(data);
    const csvOutput = XLSX.utils.sheet_to_csv(ws);
    const blob = new Blob([csvOutput], { type: "text/csv;charset=utf-8;" });
    downloadFile(blob, fileName);
  };

  const exportToXlsx = (data: any[], fileName: string = "data.xlsx") => {
    const wb = XLSX.utils.book_new();
    const ws = XLSX.utils.json_to_sheet(data);
    XLSX.utils.book_append_sheet(wb, ws, "Sheet1");
    const wbout = XLSX.write(wb, { bookType: "xlsx", type: "array" });
    const blob = new Blob([wbout], { type: "application/octet-stream" });
    downloadFile(blob, fileName);
  };

  return { exportToJson, exportToCsv, exportToXlsx };
};
