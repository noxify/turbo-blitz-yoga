import { BlitzPage, Routes } from "@blitzjs/next"
import Link from "next/link"
import { useRouter } from "next/router"
import { useMutation } from "@blitzjs/rpc"
import Layout from "src/core/layouts/Layout"
import createTodo from "src/todos/mutations/createTodo"
import { TodoForm, FORM_ERROR } from "src/todos/components/TodoForm"

const NewTodoPage: BlitzPage = () => {
  const router = useRouter()
  const [createTodoMutation] = useMutation(createTodo)

  return (
    <Layout title={"Create New Todo"}>
      <h1>Create New Todo</h1>

      <TodoForm
        submitText="Create Todo"
        // TODO use a zod schema for form validation
        //  - Tip: extract mutation's schema into a shared `validations.ts` file and
        //         then import and use it here
        // schema={CreateTodo}
        // initialValues={{}}
        onSubmit={async (values) => {
          try {
            const todo = await createTodoMutation(values)
            await router.push(Routes.ShowTodoPage({ todoId: todo.id }))
          } catch (error: any) {
            console.error(error)
            return {
              [FORM_ERROR]: error.toString(),
            }
          }
        }}
      />

      <p>
        <Link href={Routes.TodosPage()}>Todos</Link>
      </p>
    </Layout>
  )
}

NewTodoPage.authenticate = true

export default NewTodoPage
