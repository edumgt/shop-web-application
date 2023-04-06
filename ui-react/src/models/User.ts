export interface User { 
  accessToken: string
  email: string
  id: number
  roles: Array<string>
  tokenType: string
  username: string
}