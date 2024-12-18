import { useState } from "react";

/**
 * Hook برای مدیریت وضعیت مرتب‌سازی داده‌ها
 * @returns {Object} یک شیء حاوی وضعیت مرتب‌سازی و تابع برای تغییر وضعیت مرتب‌سازی
 */
const useSorting = () => {
  // وضعیت اولیه مرتب‌سازی: کلید (key) و جهت (direction)
  const [sortConfig, setSortConfig] = useState<{
    key: string | null; // کلید ستون که داده‌ها بر اساس آن مرتب می‌شوند
    direction: "asc" | "desc" | null; // جهت مرتب‌سازی: صعودی (asc)، نزولی (desc) یا غیر فعال (null)
  }>({ key: null, direction: null });

  /**
   * تابع برای تغییر وضعیت مرتب‌سازی بر اساس ستون انتخابی
   * @param {string} column - نام ستون برای مرتب‌سازی
   */
  const handleSorting = (column: string) => {
    let newDirection: "asc" | "desc" | null = null;

    // اگر ستون انتخابی همان ستون قبلی باشد
    if (sortConfig.key === column) {
      // اگر مرتب‌سازی به صورت صعودی باشد، به نزولی تغییر می‌کند
      if (sortConfig.direction === "asc") {
        newDirection = "desc";
      }
      // اگر مرتب‌سازی به صورت نزولی باشد، غیر فعال می‌شود
      else if (sortConfig.direction === "desc") {
        newDirection = null;
      }
      // اگر مرتب‌سازی غیر فعال باشد، به صعودی تغییر می‌کند
      else {
        newDirection = "asc";
      }
    } else {
      // اگر ستون انتخابی متفاوت باشد، مرتب‌سازی به صورت صعودی آغاز می‌شود
      newDirection = "asc";
    }

    // به‌روز رسانی وضعیت مرتب‌سازی
    setSortConfig({
      key: column, // ستون انتخابی
      direction: newDirection, // جهت مرتب‌سازی جدید
    });
  };

  return { sortConfig, handleSorting };
};

export default useSorting;
