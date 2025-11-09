import { createQuickAdminUser } from '@/server/utils/create-admin'
import { redirect } from 'next/navigation'

export default async function SetupAdminPage() {
  const result = await createQuickAdminUser()
  
  if (result.success) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-background p-4">
        <div className="max-w-md w-full space-y-6 p-8 border rounded-lg shadow-lg">
          <div className="text-center">
            <h1 className="text-3xl font-bold text-green-600 mb-2">✅ Admin Created!</h1>
            <p className="text-muted-foreground">{result.message}</p>
          </div>
          
          <div className="space-y-3 p-4 bg-muted rounded-md">
            <div>
              <p className="text-sm font-semibold text-muted-foreground">Email:</p>
              <p className="font-mono text-sm">{result.credentials?.email}</p>
            </div>
            <div>
              <p className="text-sm font-semibold text-muted-foreground">Password:</p>
              <p className="font-mono text-sm break-all">{result.credentials?.password}</p>
            </div>
            <div className="pt-2 border-t">
              <p className="text-xs text-yellow-600">{result.credentials?.note}</p>
            </div>
          </div>

          <div className="space-y-2">
            <a 
              href="/auth/login" 
              className="block w-full text-center bg-primary text-primary-foreground px-4 py-3 rounded-md font-semibold hover:bg-primary/90 transition-colors"
            >
              Go to Login →
            </a>
            <a 
              href="/admin" 
              className="block w-full text-center border border-border px-4 py-3 rounded-md font-semibold hover:bg-muted transition-colors"
            >
              Access Admin Panel
            </a>
          </div>

          <div className="text-center text-xs text-muted-foreground">
            <p>⚠️ Delete the <code className="bg-muted px-1 rounded">/app/setup-admin</code> folder after use!</p>
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-background p-4">
      <div className="max-w-md w-full p-8 border border-red-200 rounded-lg">
        <h1 className="text-2xl font-bold text-red-600 mb-4">❌ Error</h1>
        <p className="text-red-600">{result.error}</p>
        <div className="mt-6">
          <a 
            href="/" 
            className="text-sm text-muted-foreground hover:text-foreground"
          >
            ← Go back
          </a>
        </div>
      </div>
    </div>
  )
}
