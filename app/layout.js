import MainHeader from '@/components/main-header/main-header';
import './globals.css';
import { createSupabaseServerClient } from '@/lib/supabaseServer';



export const metadata = {
  title: 'NextLevel Food',
  description: 'Delicious meals, shared by a food-loving community.',
};

export default async function RootLayout({ children }) {
  const supabase = await createSupabaseServerClient();

      const {
    data: { session },
  } = await supabase.auth.getSession();

  return (
    <html lang="en">
      <body>
          {session && <MainHeader/>}
          {children}
      </body>
    </html>
  );
}
