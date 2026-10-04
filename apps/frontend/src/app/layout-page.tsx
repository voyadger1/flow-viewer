import { Footer } from '@/widgets/footer/footer.tsx';

interface LayoutPageProps {
  children?: React.ReactNode;
}

export const LayoutPage = ({ children }: LayoutPageProps) => {
  return (
    <div className={'min-h-[100vh] flex flex-col gap-4'}>
      <div>{children}</div>
      <Footer />
    </div>
  );
};
