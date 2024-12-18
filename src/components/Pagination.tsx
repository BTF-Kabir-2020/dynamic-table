import React from "react";

// تعریف نوع داده‌ها برای پروپرتی‌های کامپوننت Pagination
interface PaginationProps {
  currentPage: number; // صفحه فعلی که نمایش داده می‌شود
  totalPages: number; // تعداد کل صفحات موجود
  onPageChange: (page: number) => void; // تابعی که برای تغییر صفحه فراخوانی می‌شود
}

const Pagination: React.FC<PaginationProps> = ({
  currentPage, // صفحه فعلی
  totalPages, // تعداد کل صفحات
  onPageChange, // تابعی برای تغییر صفحه
}) => {
  // ایجاد آرایه‌ای از اعداد برای نمایش شماره صفحات
  const pageNumbers = [];
  for (let i = 1; i <= totalPages; i++) {
    pageNumbers.push(i);
  }

  // تابع برای رفتن به صفحه بعدی
  const handleNextPage = () => {
    if (currentPage < totalPages) {
      onPageChange(currentPage + 1); // صفحه بعدی را به‌روز رسانی می‌کند
    }
  };

  // تابع برای رفتن به صفحه قبلی
  const handlePrevPage = () => {
    if (currentPage > 1) {
      onPageChange(currentPage - 1); // صفحه قبلی را به‌روز رسانی می‌کند
    }
  };

  return (
    <div className="flex justify-center space-x-2 mb-4">
      {/* دکمه برای صفحه قبلی */}
      <button
        onClick={handlePrevPage}
        disabled={currentPage === 1} // غیر فعال کردن دکمه اگر در صفحه اول هستیم
        className={`px-3 py-2 border rounded ${
          currentPage === 1
            ? "bg-gray-200 text-gray-400 cursor-not-allowed"
            : "bg-blue-500 hover:bg-blue-600 text-white"
        }`}
      >
        Previous
      </button>

      {/* ایجاد دکمه‌های صفحه‌بندی بر اساس تعداد صفحات */}
      {pageNumbers.map((number) => (
        <button
          key={number}
          onClick={() => onPageChange(number)} // تغییر صفحه به شماره انتخابی
          className={`px-3 py-2 border rounded ${
            number === currentPage
              ? "bg-blue-500 text-white" // انتخاب صفحه فعال
              : "bg-white text-blue-500 hover:bg-blue-200"
          }`}
        >
          {number}
        </button>
      ))}

      {/* دکمه برای صفحه بعدی */}
      <button
        onClick={handleNextPage}
        disabled={currentPage === totalPages} // غیر فعال کردن دکمه اگر در صفحه آخر هستیم
        className={`px-3 py-2 border rounded ${
          currentPage === totalPages
            ? "bg-gray-200 text-gray-400 cursor-not-allowed"
            : "bg-blue-500 hover:bg-blue-600 text-white"
        }`}
      >
        Next
      </button>
    </div>
  );
};

export default Pagination;
