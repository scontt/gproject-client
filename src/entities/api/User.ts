export interface User {
  id: string,
  username: string,
  registrationDate: Date,
}

export const construct = (data: any): User => { // eslint-disable-line @typescript-eslint/no-explicit-any
  return {
    id: data.id,
    username: data.username,
    registrationDate: new Date(data.registrationDate),
  }
}
