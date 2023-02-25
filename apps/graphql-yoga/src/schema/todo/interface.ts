export interface TodoInterface {
  id: number
  title: string
  description?: string
  createdAt: Date
  updatedAt: Date
  user: TodoUserInterface
  userId: number
}

export interface TodoUserInterface {
  id: number
  name: string
}
