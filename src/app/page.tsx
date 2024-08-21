import { Button } from "@/components/ui/button"
import { CheckCircleIcon } from "lucide-react"
import Link from "next/link"

export default async function Component() {
  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-background text-foreground p-4">
      <main className="text-center">
        <CheckCircleIcon className="w-16 h-16 mb-6 text-primary mx-auto" />
        <h1 className="text-4xl font-bold mb-4">SimpleTodo</h1>
        <p className="text-xl mb-8 max-w-md mx-auto">
          Streamline your day with our minimalist todo list app. 
          Stay organized, focused, and productive.
        </p>
        <div className="flex flex-col sm:flex-row justify-center gap-4">
          <Link href={"/auth/signin"} className="font-semibold">
            Login
          </Link>
          <Link href={"/auth/signup"} className="font-semibold">
            Register
          </Link>
        </div>
      </main>
    </div>
  )
}