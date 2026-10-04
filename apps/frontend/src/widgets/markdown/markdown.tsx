import ReactMarkdown from 'react-markdown';
import remarkGfm from 'remark-gfm';
import { Prism as SyntaxHighlighter } from 'react-syntax-highlighter';
import {
  oneDark as codeThemeDark,
  oneLight as codeThemeLight,
} from 'react-syntax-highlighter/dist/esm/styles/prism';
import { cn } from '@/shared/lib/utils.ts';
import { markdownSlug } from './lib/utils.ts';
import type { ElementContent } from 'hast';
import { useEffect, useRef } from 'react';
import './style.css';
import { useTheme } from '@/shared/ui/theme-provider.tsx';
import { IS_DEV } from '@/shared/lib/getEnvs.ts';

const childrenToText = (children?: ElementContent[]): string => {
  return (
    children
      ?.map(child => {
        if (child.type === 'text' || child.type === 'raw' || child.type === 'comment') {
          return child.value;
        }
        if (child.type === 'element') {
          return childrenToText(child.children);
        }

        return '';
      })
      .join('')
      .trim() || ''
  );
};

const MarkDown = ({ markDown }: { markDown: string }) => {
  const theme = useTheme();
  const titleIndex = useRef(0);

  const getID = (children?: ElementContent[]): string => {
    titleIndex.current += 1;
    const id = IS_DEV ? titleIndex.current / 2 - 1 : titleIndex.current - 1;
    return `${id}-${markdownSlug(childrenToText(children))}`;
  };

  useEffect(() => {
    titleIndex.current = 0;
  });

  return (
    <div className={'flex flex-col gap-2 font-thin text-[12pt]'}>
      <ReactMarkdown
        remarkPlugins={[remarkGfm]}
        components={{
          h1: ({ node, ...props }) => (
            <h1
              id={getID(node?.children)}
              className="text-5xl font-bold text-primary scroll-mt-32"
              {...props}
            >
              {String(props.children)}
            </h1>
          ),
          h2: ({ node, ...props }) => (
            <h2
              id={getID(node?.children)}
              className="mt-10 text-4xl font-bold text-primary scroll-mt-32"
              {...props}
            />
          ),
          h3: ({ node, ...props }) => (
            <h3
              id={getID(node?.children)}
              className="mt-8 text-3xl font-bold text-primary scroll-mt-32"
              {...props}
            />
          ),
          h4: ({ children, node, ...props }) => (
            <h4
              id={getID(node?.children)}
              className="mt-6 text-2xl font-bold text-primary scroll-mt-32"
              {...props}
            >
              {children}
            </h4>
          ),
          h5: ({ children, node, ...props }) => (
            <h5
              id={getID(node?.children)}
              className="mt-6 text-xl font-bold text-primary scroll-mt-32"
              {...props}
            >
              {children}
            </h5>
          ),
          h6: ({ children, node, ...props }) => (
            <h6
              id={getID(node?.children)}
              className="mt-6 text-lg font-bold text-primary scroll-mt-32"
              {...props}
            >
              {children}
            </h6>
          ),

          p: ({ ...props }) => <p className="leading-relaxed" {...props} />,
          a: ({ ...props }) => <a className="text-blue-500" target={'_blank'} {...props} />,
          ul: ({ ...props }) => <ul className="list-disc list-inside space-y-1 pl-5" {...props} />,
          ol: ({ ...props }) => (
            <ol className="list-decimal list-outside pl-6 space-y-1" {...props} />
          ),
          pre: ({ ...props }) => <pre className={'bg-background-code p-2 rounded-lg'} {...props} />,
          code({ className, children, ...props }) {
            const match = /language-(\w+)/.exec(className || '');
            return match ? (
              <div className={'rounded-lg overflow-hidden'}>
                <SyntaxHighlighter
                  // eslint-disable-next-line @typescript-eslint/ban-ts-comment
                  // @ts-expect-error
                  style={
                    (theme.theme === 'light' ? codeThemeLight : codeThemeDark) as
                      { [key: string]: React.CSSProperties } | undefined
                  }
                  data-slot="code"
                  language={match[1]}
                  {...props}
                >
                  {String(children).replace(/\n$/, '')}
                </SyntaxHighlighter>
              </div>
            ) : (
              <code
                className={cn(className, 'bg-background-code p-1 rounded-sm font-mono text-[10pt]')}
                {...props}
              >
                {children}
              </code>
            );
          },
          table: ({ children }) => (
            <div className="overflow-x-auto my-4">
              <table className="min-w-full border-collapse border border-border">{children}</table>
            </div>
          ),
          tr: ({ children }) => <tr className="border-b border-border">{children}</tr>,
          th: ({ children }) => (
            <th className="text-left p-2 font-medium border border-border bg-border/40">
              {children}
            </th>
          ),
          td: ({ children }) => <td className="p-2 border">{children}</td>,
          blockquote: ({ children }) => (
            <blockquote className={'bg-border/20 p-2 pl-4 border-l-2 mt-2'}>{children}</blockquote>
          ),
        }}
      >
        {markDown}
      </ReactMarkdown>
    </div>
  );
};
export default MarkDown;
