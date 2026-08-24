import type { Metadata } from 'next';
import './globals.scss';

export const metadata: Metadata = {
  metadataBase: new URL(process.env.NEXT_PUBLIC_SITE_URL ?? 'https://sshconfig-lint.apps.thiering.org'),
  title: 'sshconfig-lint',
  description:
    'Check an OpenSSH client configuration for duplicate hosts, unsafe options, weak algorithms, and ordering mistakes. Private and local in your browser.',
  applicationName: 'sshconfig-lint',
  authors: [{ name: 'Noah Thiering', url: 'https://thiering.org' }],
  keywords: ['SSH config checker', 'OpenSSH linter', 'SSH config validator', 'sshconfig-lint'],
  openGraph: {
    type: 'website',
    siteName: 'sshconfig-lint',
    images: [{ url: '/og.png', width: 1200, height: 630, alt: 'sshconfig-lint browser checker' }],
  },
  twitter: {
    card: 'summary_large_image',
    images: ['/og.png'],
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" suppressHydrationWarning>
      <head>
        <script dangerouslySetInnerHTML={{ __html: `(function(){try{var saved=localStorage.getItem('sshconfig-lint-theme');var theme=saved==='light'||saved==='dark'?saved:(matchMedia('(prefers-color-scheme: dark)').matches?'dark':'light');document.documentElement.dataset.theme=theme;document.documentElement.style.colorScheme=theme}catch(e){}})()` }} />
      </head>
      <body>{children}</body>
    </html>
  );
}
