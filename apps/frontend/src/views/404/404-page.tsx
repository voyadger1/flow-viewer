import { Header } from '@/widgets/header/header.tsx';
import { Link, useLocation } from 'react-router-dom';

export const NotFoundPage = () => {
  const location = useLocation();

  return (
    <div className={'flex flex-col items-center'}>
      <Header />

      <div className={'flex flex-col gap-0 w-full max-w-[50vw] items-center'}>
        <img src={'/img/1790157618.png'} className={'max-h-[40vh]'} />
        <h1 className={'text-[16pt] font-bold'}>404 Error</h1>
        <p>Page {location.pathname} not found</p>
        <Link to={'/'} className={'text-[10pt] underline'}>
          Back to home
        </Link>
      </div>
    </div>
  );
};
