// Component to display all payment methods and handle adding, deleting, and activating them

import { useEffect, useState } from "react";
import styles from "./paymentMethods.module.css";
import {
  getAllPaymentMethods,
  createPaymentMethod,
  updatePaymentMethod,
  deletePaymentMethod,
  PaymentMethod,
} from "../../api/api";
import NewPaymentMethodForm from "../newPaymentMethodForm/NewPaymentMethodForm";
import PaymentMethodItem from "../paymentMethodItem/PaymentMethodItem";

function PaymentMethods() {
  // Fetch all payment methods from the API and store in state, this is done when the component mounts or changes are made
  const [paymentMethods, setPaymentMethods] = useState<PaymentMethod[]>([]);
  const fetchMethods = async () => {
    const data = await getAllPaymentMethods();
    setPaymentMethods(data);
  };

  useEffect(() => {
    fetchMethods();
  }, []);

  // Function to handle submittin a new payment method (the form)
  const handleSubmit = async (method: PaymentMethod) => {
    await createPaymentMethod(method);
    fetchMethods();
  };

  // Function to handle deleting a payment method
  const handleDelete = async (id: string | undefined) => {
    // A simple check to prevent deletion if only one card remains (to avoid not being able to pay)
    if (paymentMethods.length === 1) {
      alert("You need to have at least one payment method.");
      return;
    }

    await deletePaymentMethod(Number(id));

    fetchMethods();
  };

  // Function to handle setting a payment method as active, and deactivating the others
  const handleSetActive = async (id: string | undefined) => {
    const updatedMethods = paymentMethods.map((method) => ({
      ...method,
      active: method.id === id,
    }));

    for (const method of updatedMethods) {
      await updatePaymentMethod(Number(method.id), method);
    }

    fetchMethods();
  };

  // Sorting the payment methods to show the active one first
  const sortedMethods = paymentMethods.sort(
    (a, b) => Number(b.active) - Number(a.active)
  );

  return (
    <div className={styles.container}>
      <h1>Payment Methods</h1>
      <div className={styles.content}>
        <div className={styles.list}>
          {sortedMethods.map((method) => (
            <PaymentMethodItem
              key={method.id}
              method={method}
              onSetActive={handleSetActive}
              onDelete={handleDelete}
            />
          ))}
        </div>
        <NewPaymentMethodForm onSubmit={handleSubmit} />
      </div>
    </div>
  );
}

export default PaymentMethods;
