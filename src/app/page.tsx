// src\app\page.tsx
import DynamicTable from "@/components/DynamicTable";

export default function Home() {
  return (
    <div className="container mx-auto p-4">
      <h1
        className="text-5xl text-center font-bold mb-4 mt-10 text-blue-600 select-none"
      >
        Dynamic Table
      </h1>
      <DynamicTable />
    </div>
  );
}
