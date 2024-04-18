import { SidebarProvider } from '@/context/SidebarContext/GlobalProvider'
import '@/styles/globals.css'
import { Poppins } from '@next/font/google'
import { Cabin } from '@next/font/google'
import { SessionProvider } from 'next-auth/react'

const poppins = Poppins({
  variable: '--poppins-font',
  subsets: ['latin'],
  weight: ['400', '500', '600', '700']
})

const cabin = Cabin({
  variable: '--cabin-font',
  subsets: ['latin'],
})

export default function App({ Component, session, pageProps }) {
  return (
    <SessionProvider session={session} basePath="/api/auth">
      <SidebarProvider>
        <style jsx global>
          {`
          :root {
            --poppins-font: ${poppins.style.fontFamily};
            --cabin-font: ${cabin.style.fontFamily};
          }
        `}
        </style>
        <Component {...pageProps} />
      </SidebarProvider>
    </SessionProvider>
  )
}