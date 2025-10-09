import MainHeader from '@/components/main-header/main-header';
import './globals.css';
import { createClient } from '@/utils/supabase/server'



export const metadata = {
  title: 'NextLevel Food',
  description: 'Delicious meals, shared by a food-loving community.',
};

export default async function RootLayout({ children }) {
  const supabase = await createClient()
  const { data, error } = await supabase.auth.getUser();

  return (
    <html lang="en">
      <body>
          {data?.user && <MainHeader/>}
          {children}
      </body>
    </html>
  );
}
