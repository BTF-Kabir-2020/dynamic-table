// utils/handleFileUpload.tsx

export const handleFileUpload = (file: File): Promise<any[]> => {
  return new Promise<any[]>((resolve, reject) => {
    // ایجاد یک FileReader برای خواندن محتوای فایل
    const reader = new FileReader();

    // رویداد زمانی که فایل به درستی خوانده شود
    reader.onload = (e) => {
      try {
        // تلاش برای تجزیه داده‌های JSON از فایل
        const fileData = JSON.parse(e.target?.result as string);

        // بررسی صحت داده‌ها
        const isValid =
          Array.isArray(fileData) && // داده‌ها باید یک آرایه باشند
          fileData.every(
            (item) =>
              typeof item === "object" && // هر آیتم باید شیء باشد
              "email" in item && // آیتم باید شامل فیلد "email" باشد
              "name" in item && // آیتم باید شامل فیلد "name" باشد
              "age" in item // آیتم باید شامل فیلد "age" باشد
          );

        if (isValid) {
          resolve(fileData); // اگر داده‌ها معتبر هستند، آن‌ها را باز می‌گردانیم
        } else {
          reject("The data format is incorrect."); // اگر فرمت داده‌ها اشتباه باشد، ارور می‌دهیم
        }
      } catch (error) {
        reject("Error parsing JSON."); // اگر خطایی در تجزیه JSON باشد، ارور می‌دهیم
      }
    };

    // رویداد زمانی که خطا در خواندن فایل اتفاق بیافتد
    reader.onerror = () => {
      reject("Error reading the file."); // در صورت بروز خطا در خواندن فایل، ارور می‌دهیم
    };

    // خواندن محتوای فایل به صورت متن
    reader.readAsText(file);
  });
};
