import { apiClient } from "../apiClient";

export interface TuitionPayment {
  id: number;
  amount: number;
  payment_date: string;
  payment_method: "cash" | "bank_transfer";
  student_id: number;
  verified_by?: number;
  archive_id?: number;
  created_at: string;
  updated_at: string;
}

export interface TuitionPaymentCreatePayload {
  amount: number;
  payment_date: string;
  payment_method: "cash" | "bank_transfer";
  student_id: number;
  archive_id?: number;
}

export interface StudentBalance {
  student_id: number;
  total_tuition: number;
  total_paid: number;
  remaining_balance: number;
  payment_percentage: string;
}

export interface OutstandingPayment {
  student_id: number;
  remaining_tuition: number;
  student_name: string;
  student_email: string;
  student_phone: string;
  start_year: string;
  end_year: string;
}

export const tuitionPaymentService = {
  // Create a new tuition payment
  async createTuitionPayment(
    paymentData: TuitionPaymentCreatePayload
  ): Promise<TuitionPayment> {
    const response = await apiClient.post("/tuition-payments", paymentData);
    return response.data;
  },

  // Get all tuition payments with optional filters
  async getAllTuitionPayments(filters?: {
    student_id?: number;
    payment_method?: string;
    date_from?: string;
    date_to?: string;
  }): Promise<TuitionPayment[]> {
    const params = new URLSearchParams();
    if (filters?.student_id)
      params.append("student_id", filters.student_id.toString());
    if (filters?.payment_method)
      params.append("payment_method", filters.payment_method);
    if (filters?.date_from) params.append("date_from", filters.date_from);
    if (filters?.date_to) params.append("date_to", filters.date_to);

    const response = await apiClient.get(
      `/tuition-payments?${params.toString()}`
    );
    return response.data;
  },

  // Get payments for a specific student
  async getStudentPayments(studentId: number): Promise<TuitionPayment[]> {
    const response = await apiClient.get(
      `/tuition-payments/student/${studentId}`
    );
    return response.data;
  },

  // Get student balance information
  async getStudentBalance(studentId: number): Promise<StudentBalance> {
    const response = await apiClient.get(
      `/tuition-payments/student/${studentId}/balance`
    );
    return response.data;
  },

  // Get outstanding payments
  async getOutstandingPayments(): Promise<OutstandingPayment[]> {
    const response = await apiClient.get("/tuition-payments/outstanding");
    return response.data;
  },

  // Get payment statistics
  async getPaymentStats(filters?: {
    date_from?: string;
    date_to?: string;
  }): Promise<any> {
    const params = new URLSearchParams();
    if (filters?.date_from) params.append("date_from", filters.date_from);
    if (filters?.date_to) params.append("date_to", filters.date_to);

    const response = await apiClient.get(
      `/tuition-payments/stats?${params.toString()}`
    );
    return response.data;
  },

  // Verify a payment
  async verifyPayment(paymentId: number): Promise<TuitionPayment> {
    const response = await apiClient.patch(
      `/tuition-payments/${paymentId}/verify`
    );
    return response.data;
  },

  // Update a payment
  async updateTuitionPayment(
    paymentId: number,
    updates: Partial<TuitionPaymentCreatePayload>
  ): Promise<TuitionPayment> {
    const response = await apiClient.put(
      `/tuition-payments/${paymentId}`,
      updates
    );
    return response.data;
  },

  // Delete a payment
  async deleteTuitionPayment(paymentId: number): Promise<boolean> {
    const response = await apiClient.delete(`/tuition-payments/${paymentId}`);
    return response.data;
  },

  // Get payments by date range
  async getPaymentsByDateRange(
    startDate: string,
    endDate: string
  ): Promise<TuitionPayment[]> {
    const response = await apiClient.get(
      `/tuition-payments/date-range?start_date=${startDate}&end_date=${endDate}`
    );
    return response.data;
  },
};
