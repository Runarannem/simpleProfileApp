// Component to display a single payment method with buttons to activate or delete it

import { PaymentMethod } from "../../api/api";
import styles from "./paymentMethodItem.module.css";

type PaymentMethodItemProps = {
  method: PaymentMethod;
  onSetActive: (id: string | undefined) => void;
  onDelete: (id: string | undefined) => void;
};

const PaymentMethodItem = ({
  method, // The payment method data
  onSetActive, // Callback function to set a payment method as active (given the id)
  onDelete, // Callback function to delete a payment method (given the id)
}: PaymentMethodItemProps) => {
  return (
    <div className={`${styles.card} ${method.active ? styles.activeCard : ""}`}>
      <div className={styles.cardDetails}>
        <strong className={styles.issuer}>{method.issuer}</strong>
        <div className={styles.cardNumber}>
          •••• {method.cardDetails.toString().slice(-4)}
        </div>
        <div className={styles.expiry}>Expires: {method.expiryDate}</div>
      </div>
      <div className={styles.actions}>
        <button
          className={styles.setActiveButton}
          onClick={() => onSetActive(method.id)}
          style={{ visibility: method.active ? "hidden" : "visible" }} // Hide activation button if already active
        >
          Activate
        </button>
        <button
          className={styles.deleteButton}
          onClick={() => onDelete(method.id)}
        >
          Delete
        </button>
      </div>
    </div>
  );
};

export default PaymentMethodItem;
