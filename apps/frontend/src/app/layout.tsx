import { ThemeProvider } from '@/shared/ui/theme-provider.tsx';
import { BrowserRouter, Route, Routes } from 'react-router-dom';
import { ROUTES } from './routes.tsx';
import { LayoutPage } from '@/app/layout-page.tsx';
import { Toaster } from '@/shared/ui/toast.tsx';

export const Layout = () => {
  return (
    <>
      <BrowserRouter>
        <ThemeProvider defaultTheme={'dark'} storageKey={'theme'}>
          <LayoutPage>
            <Routes>
              {ROUTES.map(item => (
                <Route key={item.path} path={item.path} element={item.node} />
              ))}
            </Routes>
          </LayoutPage>
          <Toaster />
        </ThemeProvider>
      </BrowserRouter>
    </>
  );
};
