import { apiClient } from '@/lib/api'

// Mock fetch
const mockFetch = jest.fn()
global.fetch = mockFetch

// Mock localStorage
const mockLocalStorage = {
  getItem: jest.fn(),
  setItem: jest.fn(),
  removeItem: jest.fn(),
  clear: jest.fn(),
}
Object.defineProperty(window, 'localStorage', {
  value: mockLocalStorage,
})

describe('API Client', () => {
  beforeEach(() => {
    jest.clearAllMocks()
    mockLocalStorage.getItem.mockReturnValue(null)
  })

  describe('Authentication', () => {
    it('should make login request', async () => {
      const mockResponse = {
        success: true,
        data: {
          user: { id: '1', name: 'Test User', email: 'test@example.com' },
          tokens: { accessToken: 'token123', refreshToken: 'refresh123' }
        }
      }

      mockFetch.mockResolvedValueOnce({
        ok: true,
        json: async () => mockResponse,
      })

      const result = await apiClient.login('test@example.com', 'password123')

      expect(mockFetch).toHaveBeenCalledWith(
        'http://localhost:3001/api/auth/login',
        expect.objectContaining({
          method: 'POST',
          headers: expect.objectContaining({
            'Content-Type': 'application/json',
          }),
          body: JSON.stringify({
            email: 'test@example.com',
            password: 'password123',
          }),
        })
      )

      expect(result).toEqual(mockResponse)
    })

    it('should make register request', async () => {
      const mockResponse = {
        success: true,
        data: {
          user: { id: '1', name: 'Test User', email: 'test@example.com' },
          tokens: { accessToken: 'token123', refreshToken: 'refresh123' }
        }
      }

      mockFetch.mockResolvedValueOnce({
        ok: true,
        json: async () => mockResponse,
      })

      const result = await apiClient.register('Test User', 'test@example.com', 'password123')

      expect(mockFetch).toHaveBeenCalledWith(
        'http://localhost:3001/api/auth/register',
        expect.objectContaining({
          method: 'POST',
          headers: expect.objectContaining({
            'Content-Type': 'application/json',
          }),
          body: JSON.stringify({
            name: 'Test User',
            email: 'test@example.com',
            password: 'password123',
          }),
        })
      )

      expect(result).toEqual(mockResponse)
    })

    it('should include authorization header when token is available', async () => {
      mockLocalStorage.getItem.mockReturnValue('test-token')
      
      mockFetch.mockResolvedValueOnce({
        ok: true,
        json: async () => ({ success: true, data: {} }),
      })

      await apiClient.getMe()

      expect(mockFetch).toHaveBeenCalledWith(
        'http://localhost:3001/api/auth/me',
        expect.objectContaining({
          headers: expect.objectContaining({
            'Authorization': 'Bearer test-token',
          }),
        })
      )
    })
  })

  describe('Transactions', () => {
    it('should make get transactions request', async () => {
      const mockResponse = {
        success: true,
        data: {
          transactions: [],
          pagination: { page: 1, limit: 20, total: 0, pages: 0 }
        }
      }

      mockFetch.mockResolvedValueOnce({
        ok: true,
        json: async () => mockResponse,
      })

      const result = await apiClient.getTransactions()

      expect(mockFetch).toHaveBeenCalledWith(
        'http://localhost:3001/api/transactions',
        expect.objectContaining({
          headers: expect.objectContaining({
            'Content-Type': 'application/json',
          }),
        })
      )

      expect(result).toEqual(mockResponse)
    })

    it('should make create transaction request', async () => {
      const transactionData = {
        type: 'INCOME',
        amount: 100,
        category: 'Salary',
        date: '2023-01-01',
        notes: 'Test transaction'
      }

      const mockResponse = {
        success: true,
        data: { id: '1', ...transactionData }
      }

      mockFetch.mockResolvedValueOnce({
        ok: true,
        json: async () => mockResponse,
      })

      const result = await apiClient.createTransaction(transactionData)

      expect(mockFetch).toHaveBeenCalledWith(
        'http://localhost:3001/api/transactions',
        expect.objectContaining({
          method: 'POST',
          body: JSON.stringify(transactionData),
        })
      )

      expect(result).toEqual(mockResponse)
    })
  })

  describe('Error Handling', () => {
    it('should handle network errors', async () => {
      mockFetch.mockRejectedValueOnce(new Error('Network error'))

      const result = await apiClient.getMe()

      expect(result).toEqual({
        success: false,
        error: 'Network error occurred',
      })
    })

    it('should handle 401 unauthorized responses', async () => {
      mockLocalStorage.getItem.mockReturnValue('expired-token')
      
      // First call returns 401
      mockFetch.mockResolvedValueOnce({
        status: 401,
        json: async () => ({ success: false, error: 'Unauthorized' }),
      })

      // Refresh token call fails
      mockFetch.mockResolvedValueOnce({
        ok: false,
        json: async () => ({ success: false, error: 'Invalid refresh token' }),
      })

      const result = await apiClient.getMe()

      expect(mockLocalStorage.removeItem).toHaveBeenCalledWith('accessToken')
      expect(mockLocalStorage.removeItem).toHaveBeenCalledWith('refreshToken')
    })
  })

  describe('Token Management', () => {
    it('should set tokens in localStorage', () => {
      const tokens = {
        accessToken: 'access123',
        refreshToken: 'refresh123'
      }

      apiClient.setTokens(tokens)

      expect(mockLocalStorage.setItem).toHaveBeenCalledWith('accessToken', 'access123')
      expect(mockLocalStorage.setItem).toHaveBeenCalledWith('refreshToken', 'refresh123')
    })

    it('should clear tokens from localStorage', () => {
      apiClient.clearTokens()

      expect(mockLocalStorage.removeItem).toHaveBeenCalledWith('accessToken')
      expect(mockLocalStorage.removeItem).toHaveBeenCalledWith('refreshToken')
    })
  })
})