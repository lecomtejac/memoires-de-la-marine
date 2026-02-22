import './globals.css';
import Script from 'next/script';
import type { Metadata } from 'next';

export const metadata: Metadata = {
  verification: {
    google: 'YNHAKhqqH6CSjYo9krLJOUws8fCjvJHjCMU-P6p8G84',
  },
  title: 'Mémoires de la Marine',
  description: 'Carte collaborative des lieux de mémoires de la marine',
  icons: {
    icon: '/favicon.png', // <--- ici, ton favicon dans /public
    shortcut: '/favicon.png', // pour les navigateurs qui utilisent "shortcut icon"
  },
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
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
            gtag('config', 'G-DEMR5PWQPJ');
          `}
        </Script>

      </body>
    </html>
  );
}
