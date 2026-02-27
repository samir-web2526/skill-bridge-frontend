const API_URL = process.env.NEXT_PUBLIC_API_URL;

export const createCategory = async (payload: { name: string }) => {
  try {
    const res = await fetch(`${API_URL}/api/categories`, {
      method: "POST",
      credentials: "include",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(payload),
    });

    if (!res.ok) {
      const error = await res.json();
      console.error("Category error:", error);
      return null;
    }

    return await res.json();
  } catch (error) {
    console.error("Category service error:", error);
    return null;
  }
};

export const getAllCategories = async () => {
  try {
    const res = await fetch(`${API_URL}/api/categories`, {
      cache: "no-store",
    });

    if (!res.ok) {
      throw new Error("Failed to fetch categories");
    }

    const categories = await res.json();
    return categories;
  } catch (error) {
    console.error("Category fetch error:", error);
    return [];
  }
};