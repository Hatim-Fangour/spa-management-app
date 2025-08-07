// FirebaseDataLoader.js
import { useState, useEffect } from "react";
import { getDocs, collection } from "firebase/firestore";
import { db } from "./firebase-client";
import { useDispatch } from "react-redux";
import {
  setExpenses,
  setIncomes,
  setSavings,
} from "../features/dashboard/slices/dashSlice";
import LoadingSkeleton from "../features/dashboard/components/LoadingSkeleton";
import ErrorComp from "../features/dashboard/components/ErrorComp";

export default function FirebaseDataLoader({ children }) {
  const dispatch = useDispatch();
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [expenses, incomes, savings] = await Promise.all([
          getDocs(collection(db, "expenses")),
          getDocs(collection(db, "incomes")),
          getDocs(collection(db, "savings")),
        ]);

        // Dispatch actions to store data in Redux
        dispatch(
          setExpenses(
            expenses.docs.map((doc) => ({ id: doc.id, ...doc.data() }))
          )
        );
        dispatch(setIncomes(
          incomes.docs.map(doc => ({ id: doc.id, ...doc.data() }))
        ));
        dispatch(setSavings(
          savings.docs.map(doc => ({ id: doc.id, ...doc.data() }))
        ));
      } catch (err) {
        setError(err);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [dispatch]); // Empty dependency array means this runs once on mount

  if (loading) return <LoadingSkeleton />;
  if (error) return <ErrorComp />;

  return children; // No need to pass data as props since it's in Redux
}
