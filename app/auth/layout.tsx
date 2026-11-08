import '@/styles/app.css'

export default function AuthLayout({ children }: { children: React.ReactNode }) {
  return <div className="lq flex min-h-screen items-center justify-center bg-page p-4 text-ink">{children}</div>
}
