const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || "";

export const getPlantsAdmin = async () => {
  const response = await fetch(`${API_BASE_URL}/api/plants_admin`);
  if (!response.ok) throw new Error("Network response was not ok");
  return response.json(); // Returns the plant data
};

export const createPlantsAdmin = async (formData: FormData) => {
  const response = await fetch(`${API_BASE_URL}/api/postInplants_admin`, {
    method: "POST",
    body: formData,
  });

  if (!response.ok) throw new Error("Failed to create plant");
  return response
    .json()
    .then((data) => console.log("Success:", data))
    .catch((error) => console.error("Error:", error));
};

export const updatePlantsAdmin = async (id: string, formData: FormData) => {
  const response = await fetch(`${API_BASE_URL}/api/plants_admin/${id}`, {
    method: "PUT",
    body: formData,
  });
  if (!response.ok) throw new Error("Failed to update plant");
  return response.json(); // Return the updated plant data
};

export const deletePlantsAdmin = async (id: any) => {
  const response = await fetch(`${API_BASE_URL}/api/plants_admin/${id}`, {
    method: "DELETE",
  });
  if (!response.ok) throw new Error("Failed to delete plant");
  return response.json();
};

// Get Search Query PlantsAdmin
export const getSearchQueryPlants = async (query: string) => {
  const response = await fetch(
    `${API_BASE_URL}/api/plants/search/query?q=${query}`,
    {
      method: "GET",
    }
  );
  const json = await response.json();
  if (!response.ok) {
    console.log(json);
    throw new Error(json?.message);
  }
  return json;
};

export const fetchPlants = async (filters: any) => {
  const response = await fetch(`${API_BASE_URL}/api/plants/search`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({ filters }),
  });
  if (!response.ok) {
    throw new Error("Error fetching plants");
  }
  const json = await response.json();
  return json;
};
