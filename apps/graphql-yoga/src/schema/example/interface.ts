export interface ExampleInterface {
  name: string
  birthdate: string
  height: number
  sub: ExampleSubInterface
  subMany: ExampleSubInterface[]
}

export interface ExampleSubInterface {
  name1: string
  birthdate1: string
  height1: number
}
