import { Suspense } from "react"
import { Routes } from "@blitzjs/next"
import Head from "next/head"
import Link from "next/link"
import { usePaginatedQuery } from "@blitzjs/rpc"
import { useRouter } from "next/router"
import Layout from "src/core/layouts/Layout"
import getTodos from "src/todos/queries/getTodos"

const ITEMS_PER_PAGE = 100

export const TodosList = () => {
  const router = useRouter()
  const page = Number(router.query.page) || 0
  const [{ todos, hasMore }] = usePaginatedQuery(getTodos, {
    orderBy: { id: "asc" },
    skip: ITEMS_PER_PAGE * page,
    take: ITEMS_PER_PAGE,
  })

  const goToPreviousPage = () => router.push({ query: { page: page - 1 } })
  const goToNextPage = () => router.push({ query: { page: page + 1 } })

  return (
    <div>
      <ul>
        {todos.map((todo) => (
          <li key={todo.id}>
            <Link href={Routes.ShowTodoPage({ todoId: todo.id })}>{todo.title}</Link>
          </li>
        ))}
      </ul>

      <button disabled={page === 0} onClick={goToPreviousPage}>
        Previous
      </button>
      <button disabled={!hasMore} onClick={goToNextPage}>
        Next
      </button>
    </div>
  )
}

const TodosPage = () => {
  return (
    <Layout>
      <Head>
        <title>Todos</title>
      </Head>

      <div>
        <p>
          <Link href={Routes.NewTodoPage()}>Create Todo</Link>
        </p>

        <Suspense fallback={<div>Loading...</div>}>
          <TodosList />
        </Suspense>
      </div>
    </Layout>
  )
}

export default TodosPage
