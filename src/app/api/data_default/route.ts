// src/app/api/data_default/route.ts

let cachedData: any[] | null = null;
let lastFetched: number | null = null;

const data = [
  { email: "ali.ahmadi@gmail.com", name: "Ali Ahmadi", age: 25 },
  { email: "sara.mohammadi@gmail.com", name: "Sara Mohammadi", age: 30 },
  { email: "mohammad.khan@gmail.com", name: "Mohammad Khan", age: 28 },
  { email: "fatemeh.jafari@gmail.com", name: "Fatemeh Jafari", age: 32 },
  { email: "reza.gholizadeh@gmail.com", name: "Reza Gholizadeh", age: 35 },
  { email: "niloofar.rahimi@gmail.com", name: "Niloofar Rahimi", age: 27 },
  { email: "amir.hosseini@gmail.com", name: "Amir Hosseini", age: 29 },
  { email: "zahra.mirzaei@gmail.com", name: "Zahra Mirzaei", age: 31 },
  { email: "hossein.naseri@gmail.com", name: "Hossein Naseri", age: 26 },
  { email: "mahdieh.sadeghi@gmail.com", name: "Mahdieh Sadeghi", age: 33 },
  { email: "saman.faraji@gmail.com", name: "Saman Faraji", age: 24 },
  { email: "parisa.taheri@gmail.com", name: "Parisa Taheri", age: 29 },
  { email: "shirin.mohseni@gmail.com", name: "Shirin Mohseni", age: 30 },
  { email: "yasin.karami@gmail.com", name: "Yasin Karami", age: 27 },
  { email: "elham.farrokhi@gmail.com", name: "Elham Farrokhi", age: 34 },
  { email: "soroush.ghasemi@gmail.com", name: "Soroush Ghasemi", age: 28 },
  {
    email: "mahmoud.ahmadzadeh@gmail.com",
    name: "Mahmoud Ahmadzadeh",
    age: 31,
  },
];

// کانفیگ وضعیت‌های مختلف
const config = {
  mode: "revalidate", // مقدار این می‌تواند یکی از حالت‌ها باشد: "no-cache", "revalidate", "cache"
  revalidateTime: 60 * 1000, // زمان ریولیدیت در حالت "revalidate" (به میلی‌ثانیه) 
};

const shouldRevalidate = () => {
  if (!lastFetched) {
    return true;
  }
  const currentTime = Date.now();
  return currentTime - lastFetched > config.revalidateTime;
};

export async function GET(request: Request) {
  if (config.mode === "no-cache") {
    // در حالت no-cache، هر بار داده‌ها محاسبه و ارسال می‌شود
    return new Response(JSON.stringify(data), {
      status: 200,
      headers: { "Content-Type": "application/json" },
    });
  }

  if (config.mode === "revalidate") {
    // در حالت revalidate، داده‌ها بر اساس زمان ریولیدیت کش می‌شوند
    if (shouldRevalidate() || cachedData === null) {
      cachedData = data;
      lastFetched = Date.now();
    }

    return new Response(JSON.stringify(cachedData), {
      status: 200,
      headers: {
        "Content-Type": "application/json",
        "Cache-Control": "public, max-age=60000", // کش برای 1 دقیقه (به ثانیه)
      },
    });
  }

  if (config.mode === "cache") {
    // در حالت cache، داده‌ها برای همیشه کش می‌شوند و دیگر نیاز به ریولیدیت ندارند
    if (cachedData === null) {
      cachedData = data;
    }

    return new Response(JSON.stringify(cachedData), {
      status: 200,
      headers: { "Content-Type": "application/json" },
    });
  }

  return new Response("Invalid config mode", { status: 400 });
}
