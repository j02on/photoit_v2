import { Background } from '@/assets';
import './globals.css';

export const metadata = {
  title: 'photoIt',
  description: 'Hello, User!!',
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body>
        {children}
        <Background />
      </body>
    </html>
  );
}
