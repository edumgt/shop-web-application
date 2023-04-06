export interface UserInfo {
  id: number
  username: string
  email: string
  roles: Array<{
    id: number
    name: string
  }>
  photoUrl?: string
  blocked: boolean
}