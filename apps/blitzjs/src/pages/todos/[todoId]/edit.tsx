import {Suspense} from "react"
import {Routes} from '@blitzjs/next'
import Head from "next/head"
import Link from 'next/link'
import { useRouter } from "next/router"
import {useQuery, useMutation} from '@blitzjs/rpc'
import {useParam} from '@blitzjs/next'

import Layout from "src/core/layouts/Layout"
import getTodo from "src/todos/queries/getTodo"
import updateTodo from "src/todos/mutations/updateTodo"
import {TodoForm, FORM_ERROR} from "src/todos/components/TodoForm"

export const EditTodo = () => {
  const router = useRouter()
  const todoId = useParam("todoId", "number")
  const [todo, {setQueryData}] = useQuery(
    getTodo,
    {id: todoId},
    {
      // This ensures the query never refreshes and overwrites the form data while the user is editing.
      staleTime: Infinity
    }
  )
  const [updateTodoMutation] = useMutation(updateTodo)

  return <>
    <Head>
      <title>Edit Todo {todo.id}</title>
    </Head>

    <div>
      <h1>Edit Todo {todo.id}</h1>
      <pre>{JSON.stringify(todo, null, 2)}</pre>

      <TodoForm
        submitText="Update Todo"
        // TODO use a zod schema for form validation
        //  - Tip: extract mutation's schema into a shared `validations.ts` file and
        //         then import and use it here
        // schema={UpdateTodo}
        initialValues={todo}
        onSubmit={async (values) => {
          try {
            const updated = await updateTodoMutation({
              id: todo.id,
              ...values
            })
            await setQueryData(updated)
            await router.push(
              Routes.ShowTodoPage({ todoId: updated.id })
            )
          } catch (error: any) {
            console.error(error)
            return {
              [FORM_ERROR]: error.toString(),
            }
          }
        }}
      />
    </div>
  </>;
}

const EditTodoPage = () => {
  return (
    <div>
      <Suspense fallback={<div>Loading...</div>}>
        <EditTodo />
      </Suspense>

      <p>
        <Link href={Routes.TodosPage()}>
          Todos
        </Link>
      </p>
    </div>
  );
}

EditTodoPage.authenticate = true
EditTodoPage.getLayout = (page) => <Layout>{page}</Layout>

export default EditTodoPage
