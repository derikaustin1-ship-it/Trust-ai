import type {
  TokenResponse, User, Conversation, Message, AssistantProcessResponse,
  DashboardSummary, Decision, ReviewRequest, EvaluationDataset, EvaluationRun, SpecialistAgent
} from '../types';

const API_BASE = import.meta.env.VITE_API_BASE_URL || 'http://localhost:8000/api/v1';

class ApiClient {
  private getHeaders(): HeadersInit {
    const token = localStorage.getItem('trustiq_token');
    const headers: Record<string, string> = {
      'Content-Type': 'application/json',
    };
    if (token) {
      headers['Authorization'] = `Bearer ${token}`;
    }
    return headers;
  }

  private async request<T>(endpoint: string, options: RequestInit = {}): Promise<T> {
    const url = `${API_BASE}${endpoint}`;
    const response = await fetch(url, {
      ...options,
      headers: {
        ...this.getHeaders(),
        ...options.headers,
      },
    });

    if (!response.ok) {
      if (response.status === 401) {
        localStorage.removeItem('trustiq_token');
        localStorage.removeItem('trustiq_user');
      }
      const errData = await response.json().catch(() => ({ detail: response.statusText }));
      throw new Error(errData.detail || 'API request failed');
    }

    return response.json();
  }

  // Auth
  async login(email: string, password: string): Promise<TokenResponse> {
    return this.request<TokenResponse>('/auth/login', {
      method: 'POST',
      body: JSON.stringify({ email, password }),
    });
  }

  async register(email: string, password: string, display_name: string, role = 'user'): Promise<TokenResponse> {
    return this.request<TokenResponse>('/auth/register', {
      method: 'POST',
      body: JSON.stringify({ email, password, display_name, role }),
    });
  }

  async getMe(): Promise<User> {
    return this.request<User>('/auth/me');
  }

  // Dashboard
  async getDashboardSummary(): Promise<DashboardSummary> {
    return this.request<DashboardSummary>('/dashboard/summary');
  }

  // Conversations & Assistant
  async getConversations(): Promise<Conversation[]> {
    return this.request<Conversation[]>('/conversations');
  }

  async createConversation(title?: string): Promise<Conversation> {
    return this.request<Conversation>('/conversations', {
      method: 'POST',
      body: JSON.stringify({ title }),
    });
  }

  async getConversation(id: string): Promise<Conversation> {
    return this.request<Conversation>(`/conversations/${id}`);
  }

  async deleteConversation(id: string): Promise<{ message: string }> {
    return this.request<{ message: string }>(`/conversations/${id}`, {
      method: 'DELETE',
    });
  }

  async sendMessage(content: string, conversationId?: string, overrideCategory?: string): Promise<AssistantProcessResponse> {
    const url = conversationId ? `/assistant/message?conversation_id=${conversationId}` : '/assistant/message';
    return this.request<AssistantProcessResponse>(url, {
      method: 'POST',
      body: JSON.stringify({ content, override_category: overrideCategory }),
    });
  }

  // Decisions
  async getDecisions(filters: Record<string, string> = {}): Promise<Decision[]> {
    const params = new URLSearchParams(filters).toString();
    return this.request<Decision[]>(`/decisions${params ? `?${params}` : ''}`);
  }

  async getDecision(id: string): Promise<Decision> {
    return this.request<Decision>(`/decisions/${id}`);
  }

  // Reviews
  async getReviewQueue(statusFilter?: string): Promise<ReviewRequest[]> {
    const url = statusFilter ? `/reviews?status_filter=${statusFilter}` : '/reviews';
    return this.request<ReviewRequest[]>(url);
  }

  async approveReview(id: string, notes?: string): Promise<ReviewRequest> {
    return this.request<ReviewRequest>(`/reviews/${id}/approve`, {
      method: 'POST',
      body: JSON.stringify({ notes }),
    });
  }

  async rejectReview(id: string, notes?: string): Promise<ReviewRequest> {
    return this.request<ReviewRequest>(`/reviews/${id}/reject`, {
      method: 'POST',
      body: JSON.stringify({ notes }),
    });
  }

  // Evaluation Lab
  async getEvaluationDatasets(): Promise<EvaluationDataset[]> {
    return this.request<EvaluationDataset[]>('/evaluation/datasets');
  }

  async runEvaluation(datasetId: string): Promise<EvaluationRun> {
    return this.request<EvaluationRun>('/evaluation/runs', {
      method: 'POST',
      body: JSON.stringify({ dataset_id: datasetId }),
    });
  }

  async getEvaluationRuns(): Promise<EvaluationRun[]> {
    return this.request<EvaluationRun[]>('/evaluation/runs');
  }

  async getEvaluationRun(id: string): Promise<EvaluationRun> {
    return this.request<EvaluationRun>(`/evaluation/runs/${id}`);
  }

  // Specialist Agents
  async getAgents(): Promise<SpecialistAgent[]> {
    return this.request<SpecialistAgent[]>('/agents');
  }

  // Analytics
  async getAnalyticsOverview(): Promise<any> {
    return this.request<any>('/analytics/overview');
  }
}

export const api = new ApiClient();
