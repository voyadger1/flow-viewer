import { Link } from 'react-router-dom';

export const SessionNotFoundPage = () => {
  return (
    <div className={'flex flex-col gap-1 items-center max-h-[50vh]'}>
      <img src={'/img/1790157184.png'} className={'max-h-[40vh]'} />
      <h1 className={'text-[16pt] font-bold'}>Session not found</h1>
      <Link to={'/'} className={'underline'}>
        Back to sessions list
      </Link>
    </div>
  );
};
