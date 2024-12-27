import { useState, useEffect } from "react";
import { getPlantsAdmin } from "../apiClient/apiClient";

const useFetchPlantsAdmin = () => {
  const [plantsAdmin, setPlantsAdmin] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchPlantsAdmin = async () => {
      try {
        const data = await getPlantsAdmin();
        setPlantsAdmin(data);
      } catch (err: any) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    fetchPlantsAdmin();
  }, []);

  return { plantsAdmin, loading, error };
};

export default useFetchPlantsAdmin;
