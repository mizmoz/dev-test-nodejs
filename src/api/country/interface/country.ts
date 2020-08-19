export interface Country {
  name: string
  code: string
}

export interface Population extends Country {
  population?: number
}
