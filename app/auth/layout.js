import MainHeaderBackground from '@/components/main-header/main-header-background';



export const metadata = {
  title: 'Authentication',
  description: 'Welcome to our food app.',
};

export default async function AppLayout({ children }) {
  return (
    <> 
        <MainHeaderBackground/>
        {children}
    </>
          
  );
}
