import { apiClient } from "../apiClient";
import { API_ENDPOINTS } from "../constants";

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
  remaining_tuition: string;
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
    const response = await apiClient<TuitionPayment>(
      API_ENDPOINTS.TUITION_PAYMENTS.CREATE,
      {
        method: "POST",
        body: JSON.stringify(paymentData),
      }
    );
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

    const response = await apiClient<TuitionPayment[]>(
      `${API_ENDPOINTS.TUITION_PAYMENTS.GET_ALL}?${params.toString()}`
    );
    return response.data;
  },

  // Get payments for a specific student
  async getStudentPayments(studentId: number): Promise<TuitionPayment[]> {
    const response = await apiClient<TuitionPayment[]>(
      API_ENDPOINTS.TUITION_PAYMENTS.GET_STUDENT_PAYMENTS(studentId)
    );
    return response.data;
  },

  // Get student balance information
  async getStudentBalance(studentId: number): Promise<StudentBalance> {
    const response = await apiClient<StudentBalance>(
      API_ENDPOINTS.TUITION_PAYMENTS.GET_STUDENT_BALANCE(studentId)
    );
    return response.data;
  },

  // Get outstanding payments
  async getOutstandingPayments(): Promise<OutstandingPayment[]> {
    const response = await apiClient<OutstandingPayment[]>(
      API_ENDPOINTS.TUITION_PAYMENTS.GET_OUTSTANDING
    );
    return response.data;
  },

  // Get payment statistics
  async getPaymentStats(filters?: {
    date_from?: string;
    date_to?: string;
  }): Promise<
    {
      payment_method: string;
      total_amount: number;
      payment_count: number;
      average_amount: number;
    }[]
  > {
    const params = new URLSearchParams();
    if (filters?.date_from) params.append("date_from", filters.date_from);
    if (filters?.date_to) params.append("date_to", filters.date_to);

    const response = await apiClient<
      {
        payment_method: string;
        total_amount: number;
        payment_count: number;
        average_amount: number;
      }[]
    >(`${API_ENDPOINTS.TUITION_PAYMENTS.GET_STATS}?${params.toString()}`);
    return response.data;
  },

  // Verify a payment
  async verifyPayment(paymentId: number): Promise<TuitionPayment> {
    const response = await apiClient<TuitionPayment>(
      API_ENDPOINTS.TUITION_PAYMENTS.VERIFY(paymentId),
      { method: "PATCH" }
    );
    return response.data;
  },

  // Update a payment
  async updateTuitionPayment(
    paymentId: number,
    updates: Partial<TuitionPaymentCreatePayload>
  ): Promise<TuitionPayment> {
    const response = await apiClient<TuitionPayment>(
      API_ENDPOINTS.TUITION_PAYMENTS.UPDATE(paymentId),
      {
        method: "PUT",
        body: JSON.stringify(updates),
      }
    );
    return response.data;
  },

  // Delete a payment
  async deleteTuitionPayment(paymentId: number): Promise<boolean> {
    const response = await apiClient<boolean>(
      API_ENDPOINTS.TUITION_PAYMENTS.DELETE(paymentId),
      {
        method: "DELETE",
      }
    );
    return response.data;
  },

  // Get payments by date range
  async getPaymentsByDateRange(
    startDate: string,
    endDate: string
  ): Promise<TuitionPayment[]> {
    const response = await apiClient<TuitionPayment[]>(
      `${API_ENDPOINTS.TUITION_PAYMENTS.GET_BY_DATE_RANGE}?start_date=${startDate}&end_date=${endDate}`
    );
    return response.data;
  },
};
