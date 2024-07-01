interface ErrorResponse {
  message: string
}

interface SuccessResponse<T> {
  data: T
  message: string
}

type PaginationResponse<T> = {
  list: T
  perPage: number
  currentPage: number
  total: number
  totalPages: number
}

export type { ErrorResponse, SuccessResponse, PaginationResponse }
