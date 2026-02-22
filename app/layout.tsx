import './globals.css';
import Script from 'next/script';
import type { Metadata } from 'next';

export const metadata: Metadata = {
  verification: {
    google: 'YNHAKhqqH6CSjYo9krLJOUws8fCjvJHjCMU-P6p8G84', // <-- remplace par ta nouvelle clé Google
  },
  title: 'Mémoires de la Marine',
  description: 'Carte collaborative des lieux de mémoire de la marine : tombes, monuments, batailles navales, épaves.',
  icons: {
    icon: '/favicon.png',
    shortcut: '/favicon.png',
  },
  alternates: {
    canonical: 'https://www.memoiresdelamarine.fr/',
  },
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="fr">
      <body>
        {children}

        {/* Google Analytics */}
        <Script
          src="https://www.googletagmanager.com/gtag/js?id=G-DEMR5PWQPJ"
          strategy="afterInteractive"
        />

        <Script id="google-analytics" strategy="afterInteractive">
          {`
            window.dataLayer = window.dataLayer || [];
            function gtag(){dataLayer.push(arguments);}
            gtag('js', new Date());
            gtag('config', 'G-DEMR5PWQPJ', { page_path: window.location.pathname });
          `}
        </Script>

      </body>
    </html>
  );
}
