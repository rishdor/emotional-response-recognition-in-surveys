export const fetchMessage = async () => {
  try {
    const response = await fetch("http://localhost:8000/");
    if (!response.ok) {
      throw new Error("Failed to fetch data");
    }
    const data = await response.json();
    return data.message;
  } catch (error) {
    console.error("Error fetching message:", error);
    throw error;
  }
};