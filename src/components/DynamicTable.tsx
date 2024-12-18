"use client";
import React, { useState, useEffect, useCallback } from "react";
import {
  ChevronUpIcon,
  ChevronDownIcon,
  ArrowsUpDownIcon,
} from "@heroicons/react/24/solid"; 
import { useFileExport } from "@/utils/useFileExport";
import { handleFileUpload } from "@/utils/handleFileUpload";
import fetchData from "@/utils/fetchData"; 
import useSorting from "@/hooks/useSorting";
import Pagination from "@/components/Pagination"; 
import ExportButtons from "@/components/ExportButtons";

interface DataRow {
  [key: string]: string | number;
}

const sampleData = [
  { email: "test1@gmail.com", name: "test1", age: 1 },
  { email: "test2@gmail.com", name: "test2", age: 2 },
  { email: "test3@gmail.com", name: "test3", age: 3 },
];

const DynamicTable: React.FC = () => {
  // داده‌های نمونه برای نمایش در جدول
  const [data, setData] = useState<DataRow[]>(sampleData);
  // وضعیت جستجو برای فیلتر کردن داده‌ها
  const [searchTerm, setSearchTerm] = useState<string>("");
  // صفحه فعلی برای صفحه‌بندی
  const [currentPage, setCurrentPage] = useState<number>(1);
  // تعداد آیتم‌های هر صفحه
  const [itemsPerPage] = useState<number>(5);
  // وضعیت نگهداری ستون‌های قابل مشاهده
  const [visibleColumns, setVisibleColumns] = useState<string[]>([]);
  // نام‌های اصلی ستون‌ها برای نمایش در UI
  const [columnNames, setColumnNames] = useState<{ [key: string]: string }>({});
  // نام‌های موقت ستون‌ها برای ویرایش یا تنظیمات موقت
  const [tempColumnNames, setTempColumnNames] = useState<{
    [key: string]: string;
  }>({});
  // وضعیت فیلترهای جستجو برای هر ستون
  const [columnSearch, setColumnSearch] = useState<{ [key: string]: string }>(
    {}
  );

  useEffect(() => {
    if (data.length > 0) {
      setVisibleColumns(Object.keys(data[0]));
      setColumnNames(
        Object.keys(data[0]).reduce((acc, key) => {
          acc[key] = key; // ستون‌ها در ابتدا اسم خودشان را خواهند داشت
          return acc;
        }, {} as { [key: string]: string })
      );
    }

    const fetchDataFromAPI = async () => {
      try {
        const fetchedData = await fetchData(); 
        setData(fetchedData); 
      } catch (err) {
        console.error("Error fetching data:", err);
      }
    };

    fetchDataFromAPI();
  }, []);

  const { sortConfig, handleSorting } = useSorting();

  const handleDataChange = useCallback(
    (rowIndex: number, key: string, value: string) => {
      const updatedData = [...data];
      const pageIndex = (currentPage - 1) * itemsPerPage;
      const rowIndexInPage = rowIndex + pageIndex;
      updatedData[rowIndexInPage][key] = value;
      setData(updatedData);
    },
    [data, currentPage, itemsPerPage]
  );

  const handleRowDelete = useCallback(
    (rowIndex: number) => {
      const updatedData = data.filter((_, index) => index !== rowIndex);
      setData(updatedData);
    },
    [data]
  );

  const handleRowAdd = () => {
    const newRow: DataRow = visibleColumns.reduce((acc, column) => {
      acc[column] = "";
      return acc;
    }, {} as DataRow);
    setData([...data, newRow]);
  };

  const handleColumnAdd = () => {
    const newColumnName = `newColumn${Object.keys(data[0]).length + 1}`;
    const updatedData = data.map((row) => ({ ...row, [newColumnName]: "" }));

    // اضافه کردن ستون جدید به داده‌ها
    setData(updatedData);

    // اضافه کردن ستون جدید به نام‌های ستون‌ها
    setColumnNames((prev) => ({ ...prev, [newColumnName]: newColumnName }));

    // اضافه کردن ستون جدید به نام‌های موقت
    setTempColumnNames((prev) => ({ ...prev, [newColumnName]: newColumnName }));

    // فعال کردن چک‌باکس برای ستون جدید
    setVisibleColumns((prev) => [...prev, newColumnName]);
  };

  const handleColumnNameChange = (oldName: string, newName: string) => {
    if (!newName || Object.keys(columnNames).includes(newName)) {
      return; // جلوگیری از تکراری شدن نام ستون
    }

    // به روز رسانی نام‌های ستون‌ها
    const updatedColumnNames = { ...columnNames, [newName]: newName };
    delete updatedColumnNames[oldName]; // حذف نام قبلی ستون
    setColumnNames(updatedColumnNames);

    // به روزرسانی داده‌ها با نام جدید ستون
    const updatedData = data.map((row) => {
      if (row[oldName] !== undefined) {
        const { [oldName]: oldValue, ...rest } = row;
        return { ...rest, [newName]: oldValue };
      }
      return row;
    });
    setData(updatedData);

    // حفظ موقعیت ستون و وضعیت چک‌باکس‌ها
    const updatedVisibleColumns = visibleColumns.map((col) =>
      col === oldName ? newName : col
    );
    setVisibleColumns(updatedVisibleColumns);

    // حفظ نام موقت ستون
    const updatedTempColumnNames = { ...tempColumnNames, [newName]: newName };
    delete updatedTempColumnNames[oldName];
    setTempColumnNames(updatedTempColumnNames);
  };

  const handleColumnNameBlur = (key: string) => {
    if (tempColumnNames[key]) {
      handleColumnNameChange(key, tempColumnNames[key]);
      setTempColumnNames((prev) => {
        const { [key]: _, ...rest } = prev;
        return rest;
      });
    }
  };

  const handleColumnNameFocus = (key: string) => {
    setTempColumnNames((prev) => ({ ...prev, [key]: columnNames[key] }));
  };

  // تابع برای حذف ستون
  const handleColumnDelete = useCallback(
    (columnName: string) => {
      const updatedData = data.map((row) => {
        const { [columnName]: _, ...rest } = row;
        return rest;
      });
      setData(updatedData);

      const updatedColumnNames = { ...columnNames };
      delete updatedColumnNames[columnName];
      setColumnNames(updatedColumnNames);

      setVisibleColumns((prev) => prev.filter((col) => col !== columnName));
    },
    [data, columnNames]
  );

  const filteredData = data.filter((row) => {
    // ابتدا فیلتر جستجو در هر ستون
    const matchesColumnSearch = Object.keys(row).every((key) => {
      const columnFilter = columnSearch[key] || "";
      // بررسی فیلتر ستون
      if (
        columnFilter &&
        !row[key].toString().toLowerCase().includes(columnFilter.toLowerCase())
      ) {
        return false; // اگر ستون با فیلتر جستجو تطابق نداشت، این ردیف را رد می‌کنیم
      }
      return true;
    });

    // اگر فیلتر جستجو در هر ستون به درستی تطابق داشت، سپس جستجوی عمومی را اعمال می‌کنیم
    if (matchesColumnSearch) {
      // فیلتر عمومی جستجو در تمام داده‌ها
      return Object.values(row).some((value) =>
        value.toString().toLowerCase().includes(searchTerm.toLowerCase())
      );
    }
    return false; // در صورتی که فیلتر ستون‌ها رد شد، ردیف نمایش داده نمی‌شود
  });

  // فقط داده‌هایی که مربوط به صفحه جاری هستند را انتخاب می‌کنیم
  const sortedData = React.useMemo(() => {
    let sortableItems = [...filteredData];
    if (sortConfig.key && sortConfig.direction) {
      sortableItems.sort((a, b) => {
        if (sortConfig.key !== null && a[sortConfig.key] < b[sortConfig.key]) {
          return sortConfig.direction === "asc" ? -1 : 1;
        }
        if (sortConfig.key !== null && a[sortConfig.key] > b[sortConfig.key]) {
          return sortConfig.direction === "asc" ? 1 : -1;
        }
        return 0; // اگر برابر بودند
      });
    }

    return sortableItems;
  }, [filteredData, sortConfig]);

  // داده‌های مربوط به صفحه جاری را محاسبه می‌کنیم
  const indexOfLastItem = currentPage * itemsPerPage;
  const indexOfFirstItem = indexOfLastItem - itemsPerPage;
  const currentData = sortedData.slice(indexOfFirstItem, indexOfLastItem);

  const totalPages = Math.ceil(filteredData.length / itemsPerPage);
  const pageNumbers = [];
  for (let i = 1; i <= totalPages; i++) {
    pageNumbers.push(i);
  }

  const { exportToJson, exportToCsv, exportToXlsx } = useFileExport();

  const handleSearchInColumn = (column: string, value: string) => {
    setColumnSearch((prev) => ({ ...prev, [column]: value }));
  };

  const onFileChange = async (e:any) => {
    const file = e.target.files[0]; // دریافت فایل انتخاب شده
    if (file) {
      try {
        const data = await handleFileUpload(file); // فراخوانی تابع با فایل
        setData(data); // تنظیم داده‌ها
      } catch (error) {
        console.error(error); // مدیریت خطا
      }
    }
  };

  return (
    <div className="p-6">
      <div className="flex justify-center mb-10">
        <input
          type="text"
          placeholder="Search..."
          // onChange={(e) => setSearchTerm(e.target.value)}
          onChange={(e) => {
            setSearchTerm(e.target.value); // تغییر وضعیت جستجو
            setCurrentPage(1); // ردیف‌ها را برای صفحه اول تنظیم کن
          }}
          className="placeholder-gray-400 p-2 w-2/5 hover:bg-slate-100
          border border-blue-300 focus:ring focus:ring-blue-200 rounded-md"
        />
      </div>

      <div className="rounded-lg border-4 border-blue-500 mt-4 bg-blue-100 text-gray-800 font-semibold">
        <div className="overflow-x-auto">
          {" "}
          {/* اضافه کردن این خط */}
          <table className="min-w-full border-4 rounded-lg overflow-hidden">
            <thead>
              <tr>
                {Object.keys(columnNames).map((key) =>
                  visibleColumns.includes(key) ? (
                    <th
                      key={key}
                      className="border border-blue-500 px-4 py-2 rounded-tl-lg rounded-tr-lg"
                    >
                      <div className="flex flex-col sm:flex-row gap-2">
                        <input
                          type="text"
                          value={columnSearch[key] || ""}
                          onChange={(e) =>
                            handleSearchInColumn(key, e.target.value)
                          }
                          className="w-full mb-2 bg-blue-100"
                          placeholder={`Search ${columnNames[key]}`}
                        />
                        <span
                          className="cursor-pointer"
                          onClick={() => handleSorting(key)}
                        >
                          {sortConfig.key === key ? (
                            sortConfig.direction === "asc" ? (
                              <ChevronUpIcon
                                title="Sorting"
                                className="h-6 w-6 me-1 text-blue-600 hover:text-cyan-500"
                              />
                            ) : sortConfig.direction === "desc" ? (
                              <ChevronDownIcon
                                title="Sorting"
                                className="h-6 w-6 me-1 text-blue-600 hover:text-cyan-500"
                              />
                            ) : (
                              <ArrowsUpDownIcon
                                title="Sorting"
                                className="h-4 w-4 mt-1 me-1 text-blue-800 hover:text-blue-600"
                              />
                            )
                          ) : (
                            <ArrowsUpDownIcon
                              title="Sorting"
                              className="h-4 w-4 mt-1 me-1 text-blue-800 hover:text-blue-600"
                            />
                          )}
                        </span>
                        <span title="Delete column">
                          <svg
                            xmlns="http://www.w3.org/2000/svg"
                            fill="none"
                            viewBox="0 0 24 24"
                            strokeWidth={1.5}
                            stroke="currentColor"
                            className="size-6 text-red-500 hover:text-red-700 cursor-pointer"
                            onClick={() => handleColumnDelete(key)}
                          >
                            <path
                              strokeLinecap="round"
                              strokeLinejoin="round"
                              d="M6 18 18 6M6 6l12 12"
                            />
                          </svg>
                        </span>
                      </div>

                      <input
                        type="text"
                        value={tempColumnNames[key] || columnNames[key]}
                        onChange={(e) =>
                          setTempColumnNames({
                            ...tempColumnNames,
                            [key]: e.target.value,
                          })
                        }
                        onFocus={() => handleColumnNameFocus(key)}
                        onBlur={() => handleColumnNameBlur(key)}
                        className="w-full bg-blue-100"
                      />
                    </th>
                  ) : null
                )}
                <th className="border border-blue-500 px-4 py-2 rounded-tl-lg rounded-tr-lg select-none">
                  Delete Rows
                </th>
              </tr>
            </thead>

            <tbody>
              {currentData.map((row, rowIndex) => (
                <tr
                  key={rowIndex}
                  className="border-t even:bg-gray-50 odd:bg-white hover:bg-blue-50 text-gray-600"
                >
                  {Object.keys(row)
                    .filter((key) => visibleColumns.includes(key))
                    .map((key, colIndex) => (
                      <td
                        key={`${rowIndex}-${key}`}
                        className="border border-blue-500 px-4 py-2 rounded-br-lg"
                      >
                        <input
                          value={row[key]}
                          onChange={(e) =>
                            handleDataChange(rowIndex, key, e.target.value)
                          }
                          className="w-full bg-transparent"
                        />
                      </td>
                    ))}

                  <td className="border border-blue-500 px-4 py-2 text-center">
                    <button
                      onClick={() => handleRowDelete(rowIndex)}
                      className=" text-red-500 hover:text-red-700"
                    >
                      {/* Delete */}
                      <svg
                        xmlns="http://www.w3.org/2000/svg"
                        fill="none"
                        viewBox="0 0 24 24"
                        strokeWidth={1.5}
                        stroke="currentColor"
                        className="size-6"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          d="m14.74 9-.346 9m-4.788 0L9.26 9m9.968-3.21c.342.052.682.107 1.022.166m-1.022-.165L18.16 19.673a2.25 2.25 0 0 1-2.244 2.077H8.084a2.25 2.25 0 0 1-2.244-2.077L4.772 5.79m14.456 0a48.108 48.108 0 0 0-3.478-.397m-12 .562c.34-.059.68-.114 1.022-.165m0 0a48.11 48.11 0 0 1 3.478-.397m7.5 0v-.916c0-1.18-.91-2.164-2.09-2.201a51.964 51.964 0 0 0-3.32 0c-1.18.037-2.09 1.022-2.09 2.201v.916m7.5 0a48.667 48.667 0 0 0-7.5 0"
                        />
                      </svg>
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>{" "}
        {/* پایان div والد */}
      </div>

      <div className="lg:flex justify-between mt-10">
        {/* دکمه‌های Export */}
        <ExportButtons
          sortedData={sortedData}
          exportToJson={exportToJson}
          exportToCsv={exportToCsv}
          exportToXlsx={exportToXlsx}
        />

        {/* پیجینیشن یا وضعیت صفحات */}
        <Pagination
          currentPage={currentPage} // صفحه فعلی که در حال حاضر نمایش داده می‌شود
          totalPages={totalPages} // تعداد کل صفحات بر اساس داده‌ها و تعداد آیتم‌ها در هر صفحه
          onPageChange={setCurrentPage} // تابعی که برای تغییر صفحه فراخوانی می‌شود (برای به‌روز رسانی صفحه فعلی)
        />

        {/* دکمه‌های افزودن ردیف و ستون */}
        <div className="flex gap-4 items-center justify-center mb-4">
          <button
            onClick={handleRowAdd}
            className="bg-blue-500 text-white px-4 py-2 rounded-md hover:bg-blue-600 shadow-md"
          >
            Add row
          </button>
          <button
            onClick={handleColumnAdd}
            className="bg-blue-500 text-white px-4 py-2 rounded-md hover:bg-blue-600 shadow-md"
          >
            Add Column
          </button>
        </div>
      </div>

      <div className="flex items-center justify-start">
        {/* بارگذاری فایل JSON */}
        <div className="my-5">
          <input
            type="file"
            accept=".json"
            onChange={onFileChange} // ارسال setData به تابع
            className="border-2 border-blue-300 rounded p-2 shadow-sm file:hover:bg-blue-600 file:bg-blue-500 file:text-white file:border-0 file:rounded-md file:cursor-pointer"
          />
        </div>
      </div>
    </div>
  );
};

export default DynamicTable;
