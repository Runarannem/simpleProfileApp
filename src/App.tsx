import PaymentMethods from "./components/paymentMethods/PaymentMethods";
import styles from "./app.module.css";

function App() {
  return (
    <div className={styles.page}>
      <PaymentMethods />
    </div>
  );
}

export default App;
