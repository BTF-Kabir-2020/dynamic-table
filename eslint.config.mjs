import { dirname } from "path";
import { fileURLToPath } from "url";
import { FlatCompat } from "@eslint/eslintrc";

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

const compat = new FlatCompat({
  baseDirectory: __dirname,
});

// const eslintConfig = [
//   ...compat.extends("next/core-web-vitals", "next/typescript"),
// ];

// export default eslintConfig;


const eslintConfig = [
  ...compat.extends("next/core-web-vitals", "next/typescript"),
  {
    rules: {
      "react-hooks/rules-of-hooks": "off", // غیرفعال کردن قوانین Hooks
      "react-hooks/exhaustive-deps": "off", // غیرفعال کردن وابستگی‌های گم‌شده
      "@typescript-eslint/no-explicit-any": "off", // غیرفعال کردن نوع any
      "@typescript-eslint/no-unused-vars": "off", // غیرفعال کردن متغیرهای بدون استفاده
      "prefer-const": "off", // غیرفعال کردن قانون prefer-const
    },
  },
];

export default eslintConfig;
