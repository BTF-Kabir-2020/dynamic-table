// src/utils/fetchData.ts
import axios from "axios";

const fetchData = async () => {
  try {
    const response = await axios.get("/api/data_default");
    return response.data; 
  } catch (err) {
    console.error("Error fetching data:", err);
    throw err; 
  }
};

export default fetchData;
