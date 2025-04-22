const baseUrl = import.meta.env.VITE_API_BASE_URL;

export type PaymentMethod = {
  id?: string;
  cardDetails: number;
  expiryDate: string;
  CVV: string;
  issuer: string;
  active: boolean;
};

// Generic function to avoid duplicated code
async function request<T>(
  endpoint: string,
  method: 'GET' | 'POST' | 'PUT' | 'DELETE',
  body?: object
): Promise<T> {
  const response = await fetch(`${baseUrl}${endpoint}`, {
    method,
    headers: { 'Content-Type': 'application/json' },
    body: body ? JSON.stringify(body) : undefined,
  });

  if (!response.ok) {
    const errorText = await response.text();
    throw new Error(`HTTP ${response.status}: ${errorText}`);
  }

  return response.json() as Promise<T>;
}

// Function to get all payment methods from the API
export function getAllPaymentMethods(): Promise<PaymentMethod[]> {
  return request<PaymentMethod[]>(`/updatePayMethodDetails`, 'GET');
}

// Function to create a new payment method
export function createPaymentMethod(
  paymentData: PaymentMethod
): Promise<{ success: boolean; message: string }> {
  return request(`/updatePayMethodDetails`, 'POST', paymentData);
}

// Function to update an already existing payment method, used to set a payment method as active
export function updatePaymentMethod(
  id: number,
  paymentData: PaymentMethod
): Promise<{ success: boolean; message: string }> {
  return request(`/updatePayMethodDetails/${id}`, 'PUT', paymentData);
}

// Function to delete a payment method
export function deletePaymentMethod(
  id: number
): Promise<{ success: boolean; message: string }> {
  return request(`/updatePayMethodDetails/${id}`, 'DELETE');
}
