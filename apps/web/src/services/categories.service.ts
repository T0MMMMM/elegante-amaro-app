import type { Category } from '@elegante-amaro-app/shared/types'
import { http } from './client'

export const categoriesService = {
  getAll:  ()                                  => http.get<Category[]>('/categories'),
  getById: (id: number)                        => http.get<Category>(`/categories/${id}`),
  create:  (data: Omit<Category, 'id'>)        => http.post<Category>('/categories', data),
  update:  (id: number, data: Partial<Category>) => http.put<Category>(`/categories/${id}`, data),
  remove:  (id: number)                        => http.delete(`/categories/${id}`),
}
