import { PayPalButtons, PayPalScriptProvider } from "@paypal/react-paypal-js";
import type { PayPalOrderDetails } from "../../types/paypal";

interface PayPalButtonProps {
  amount: string;
  onSuccess: (data: PayPalOrderDetails) => void;
  onError: (error: unknown) => void;
}

const PayPalButton = ({ amount, onSuccess, onError }: PayPalButtonProps) => {
  return (
    <PayPalScriptProvider
      options={{
        clientId: import.meta.env.VITE_PAYPAL_CLIENT_ID,
      }}
    >
      <PayPalButtons
        style={{ layout: "vertical" }}
        createOrder={(_data, actions) => {
          return actions?.order?.create({
            intent: "CAPTURE",
            purchase_units: [
              {
                amount: {
                  currency_code: "USD",
                  value: parseFloat(amount).toFixed(2),
                },
              },
            ],
          });
        }}
        onApprove={(_data, actions) => {
          if (!actions?.order) {
            return Promise.reject(new Error("Order actions not available"));
          }
          return actions.order.capture().then((details) => {
            onSuccess(details as PayPalOrderDetails);
          });
        }}
        onError={onError}
      />
    </PayPalScriptProvider>
  );
};

export default PayPalButton;
