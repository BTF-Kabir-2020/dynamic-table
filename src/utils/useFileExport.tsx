// /hooks/useFileExport.ts
"use client";
import * as XLSX from "xlsx";

export const useFileExport = () => {
  const downloadFile = (blob: Blob, fileName: string) => {
    const url = URL.createObjectURL(blob); // ایجاد URL موقت برای blob
    const a = document.createElement("a"); // ایجاد یک عنصر <a> برای دانلود
    a.href = url; // تنظیم URL فایل
    a.download = fileName; // تنظیم نام فایل برای دانلود
    document.body.appendChild(a); // افزودن عنصر <a> به body
    a.click(); // شبیه‌سازی کلیک روی لینک برای شروع دانلود
    document.body.removeChild(a); // حذف عنصر <a> پس از دانلود
    URL.revokeObjectURL(url); // آزادسازی URL موقت
  };

  const exportToJson = (data: any[], fileName: string = "data.json") => {
    const jsonData = JSON.stringify(data, null, 2); // تبدیل داده‌ها به فرمت JSON با فرمت‌گذاری مناسب
    const blob = new Blob([jsonData], { type: "application/json" }); // ایجاد blob از داده‌های JSON
    downloadFile(blob, fileName); // دانلود فایل
  };

  const exportToCsv = (data: any[], fileName: string = "data.csv") => {
    const ws = XLSX.utils.json_to_sheet(data); // تبدیل داده‌ها به شیت XLSX
    const csvOutput = XLSX.utils.sheet_to_csv(ws); // تبدیل شیت به فرمت CSV
    const blob = new Blob([csvOutput], { type: "text/csv;charset=utf-8;" }); // ایجاد blob از داده‌های CSV
    downloadFile(blob, fileName); // دانلود فایل
  };

  const exportToXlsx = (data: any[], fileName: string = "data.xlsx") => {
    const wb = XLSX.utils.book_new(); // ایجاد یک کتاب جدید برای XLSX
    const ws = XLSX.utils.json_to_sheet(data); // تبدیل داده‌ها به شیت XLSX
    XLSX.utils.book_append_sheet(wb, ws, "Sheet1"); // افزودن شیت به کتاب
    const wbout = XLSX.write(wb, { bookType: "xlsx", type: "array" }); // نوشتن داده‌ها به فرمت XLSX
    const blob = new Blob([wbout], { type: "application/octet-stream" }); // ایجاد blob از داده‌های XLSX
    downloadFile(blob, fileName); // دانلود فایل
  };

  // بازگرداندن توابع صادر کردن به فرمت‌های مختلف
  return { exportToJson, exportToCsv, exportToXlsx };
};
