import { Link } from 'react-router-dom';
import type { ReactNode } from 'react';

type FooterBlockItem = {
  title: string;
  src: string;
  icon?: ReactNode;
  newTab?: boolean;
};

interface FooterBlockProps {
  title: string;
  items: FooterBlockItem[];
}

export const FooterBlock = ({ title, items }: FooterBlockProps) => {
  return (
    <div className={'flex flex-col gap-2'}>
      <span className={'text-foreground/60 font-bold'}>{title}</span>
      {items.map((item, index) => (
        <Link
          key={index}
          to={item.src}
          target={item.newTab ? '_blank' : '_self'}
          className={'flex flex-row gap-2 items-center hover:underline'}
        >
          {item.icon}
          {item.title}
        </Link>
      ))}
    </div>
  );
};
