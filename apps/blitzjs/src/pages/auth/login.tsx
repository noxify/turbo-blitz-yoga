import { BlitzPage } from "@blitzjs/next"
import Layout from "src/core/layouts/Layout"
import { useRouter } from "next/router"
import Link from "next/link"

const LoginPage: BlitzPage = () => {
  const router = useRouter()

  return (
    <Layout title="Log In">
      <p>
        <Link href={"/api/auth/mock1"}>Sign in as Mock User - Member</Link>
      </p>
      <Link href={"/api/auth/mock2"}>Sign in as Mock User - Admin</Link>
    </Layout>
  )
}

export default LoginPage
