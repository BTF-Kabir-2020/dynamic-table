// src/app/api/data_default/route.ts
export async function GET(request: Request) {

  const data = [
    { email: "1@gmail.com", name: "Ali api", age: 25 },
    { email: "2@gmail.com", name: "Sara api", age: 30 },
    { email: "3@gmail.com", name: "Mohammad api", age: 28 },
    { email: "5@gmail.com", name: "Mohammad api", age: 32 },
    { email: "4@gmail.com", name: "Mohammad api", age: 35 },
    { email: "4@gmail.com", name: "Mohammad api", age: 35 },
    { email: "4@gmail.com", name: "Mohammad api", age: 35 },
    { email: "4@gmail.com", name: "Mohammad api", age: 35 },
    { email: "4@gmail.com", name: "Mohammad api", age: 35 },
    { email: "88@gmail.com", name: "somaye", age: 44 },
  ];

  return new Response(JSON.stringify(data), {
    status: 200,
    headers: {
      "Content-Type": "application/json",
    },
  });
}




// import fetch from "node-fetch";

// async function fetchData() {
//   const response = await fetch(
//     "https://raw.githubusercontent.com/your-username/your-repo/main/data.json"
//   );
//   const data = await response.json();
//   return data;
// }

// export async function GET() {
//   const data = await fetchData();
//   return new Response(JSON.stringify(data), {
//     status: 200,
//     headers: {
//       "Content-Type": "application/json",
//     },
//   });
// }
