import { Suspense } from "react"
import { BlitzPage, Routes } from "@blitzjs/next"
import Head from "next/head"
import Link from "next/link"
import { useRouter } from "next/router"
import { useQuery, useMutation } from "@blitzjs/rpc"
import { useParam } from "@blitzjs/next"

import Layout from "src/core/layouts/Layout"
import getTodo from "src/todos/queries/getTodo"
import deleteTodo from "src/todos/mutations/deleteTodo"

export const Todo = () => {
  const router = useRouter()
  const todoId = useParam("todoId", "number")
  const [deleteTodoMutation] = useMutation(deleteTodo)
  const [todo] = useQuery(getTodo, { id: todoId })

  return (
    <>
      <Head>
        <title>Todo {todo.id}</title>
      </Head>

      <div>
        <h1>Todo {todo.id}</h1>
        <pre>{JSON.stringify(todo, null, 2)}</pre>

        <Link href={Routes.EditTodoPage({ todoId: todo.id })}>Edit</Link>

        <button
          type="button"
          onClick={async () => {
            if (window.confirm("This will be deleted")) {
              await deleteTodoMutation({ id: todo.id })
              await router.push(Routes.TodosPage())
            }
          }}
          style={{ marginLeft: "0.5rem" }}
        >
          Delete
        </button>
      </div>
    </>
  )
}

const ShowTodoPage: BlitzPage = () => {
  return (
    <div>
      <p>
        <Link href={Routes.TodosPage()}>Todos</Link>
      </p>

      <Suspense fallback={<div>Loading...</div>}>
        <Todo />
      </Suspense>
    </div>
  )
}

ShowTodoPage.authenticate = true
ShowTodoPage.getLayout = (page) => <Layout>{page}</Layout>

export default ShowTodoPage
