import type { Category } from '@elegante-amaro-app/shared/types'
import { categoriesService } from '../services'

export const getCategories   = ()                                    => categoriesService.getAll()
export const createCategory  = (data: Omit<Category, 'id'>)         => categoriesService.create(data)
export const updateCategory  = (id: number, data: Partial<Category>) => categoriesService.update(id, data)
export const deleteCategory  = (id: number)                          => categoriesService.remove(id)
