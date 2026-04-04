import { useState, useEffect } from 'react';

export default function useMissingFields() {
  const [missingFields, setMissingFields] = useState([]);

  useEffect(() => {
    const token = localStorage.getItem('viconnect_token');
    if (!token) return;

    fetch('/api/auth/schema', {
      headers: { Authorization: `Bearer ${token}` },
    })
      .then((res) => (res.ok ? res.json() : Promise.reject()))
      .then((data) => setMissingFields(data.missingFields || []))
      .catch(() => setMissingFields([]));
  }, []);

  const refresh = () => {
    const token = localStorage.getItem('viconnect_token');
    if (!token) return;
    fetch('/api/auth/schema', {
      headers: { Authorization: `Bearer ${token}` },
    })
      .then((res) => (res.ok ? res.json() : Promise.reject()))
      .then((data) => setMissingFields(data.missingFields || []))
      .catch(() => {});
  };

  return { missingFields, refreshMissingFields: refresh };
}
