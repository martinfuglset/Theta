import './globals.css';

export const metadata = {
  title: 'Script Plotter',
  description: 'Plot variables defined in a script',
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <body>{children}</body>
    </html>
  );
}
