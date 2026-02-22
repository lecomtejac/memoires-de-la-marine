import './globals.css';
import Script from 'next/script';

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="fr">
        <head>
        {/* Vérification Google Search Console */}
        <meta
          name="google-site-verification"
          content="<meta name="google-site-verification" content="YNHAKhqqH6CSjYo9krLJOUws8fCjvJHjCMU-P6p8G84" />"
        />
      </head>
      <body>
        {children}

        {/* Google Analytics */}
        <Script
          src="https://www.googletagmanager.com/gtag/js?id=G-XXXXXXXXXX"
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
