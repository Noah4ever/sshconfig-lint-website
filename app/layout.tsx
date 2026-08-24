import type { Metadata } from 'next';
import './globals.scss';

const origin = process.env.NEXT_PUBLIC_SITE_URL ?? 'https://sshconfig-lint.apps.thiering.org';

export const metadata: Metadata = {
  metadataBase: new URL(origin),
  title: 'SSH Config Linter and OpenSSH Checker | sshconfig-lint',
  description:
    'Free SSH config linter and OpenSSH checker. Find duplicate hosts, unsafe options, weak algorithms, and ordering mistakes locally in your browser.',
  applicationName: 'sshconfig-lint',
  authors: [{ name: 'Noah Thiering', url: 'https://thiering.org' }],
  creator: 'Noah Thiering',
  publisher: 'Noah Thiering',
  category: 'developer tools',
  keywords: ['SSH config linter', 'SSH config checker', 'OpenSSH linter', 'SSH config validator', 'sshconfig-lint'],
  robots: { index: true, follow: true },
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

const websiteJsonLd = {
  '@context': 'https://schema.org',
  '@type': 'WebSite',
  '@id': `${origin}/#website`,
  url: origin,
  name: 'sshconfig-lint',
  alternateName: 'SSH Config Linter',
  description: 'A free browser-based SSH config linter and OpenSSH configuration checker.',
  inLanguage: ['en', 'de', 'fr', 'es'],
  publisher: { '@type': 'Person', name: 'Noah Thiering', url: 'https://thiering.org' },
  about: {
    '@type': 'SoftwareSourceCode',
    name: 'sshconfig-lint',
    codeRepository: 'https://github.com/Noah4ever/sshconfig-lint',
    programmingLanguage: 'Rust',
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
        <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(websiteJsonLd).replace(/</g, '\\u003c') }} />
        <script dangerouslySetInnerHTML={{ __html: `(function(){try{var saved=localStorage.getItem('sshconfig-lint-theme');var theme=saved==='light'||saved==='dark'?saved:(matchMedia('(prefers-color-scheme: dark)').matches?'dark':'light');document.documentElement.dataset.theme=theme;document.documentElement.style.colorScheme=theme}catch(e){}})()` }} />
      </head>
      <body>{children}</body>
    </html>
  );
}
