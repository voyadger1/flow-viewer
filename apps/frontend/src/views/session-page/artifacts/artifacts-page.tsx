import { LayoutSessionPage } from '@/views/session-page/ui/layout-session-page.tsx';
import { useState } from 'react';
import {
  Dialog,
  DialogClose,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '@/shared/ui/dialog.tsx';
import { Button } from '@/shared/ui/button.tsx';
import type { TArtifact } from '@flowviewer/shared';
import { Prism as SyntaxHighlighter } from 'react-syntax-highlighter';
import {
  oneDark as codeThemeDark,
  oneLight as codeThemeLight,
} from 'react-syntax-highlighter/dist/esm/styles/prism';
import { useTheme } from '@/shared/ui/theme-provider.tsx';
import { TableArtifacts } from './ui/table.tsx';

export const ArtifactsPage = () => {
  const theme = useTheme();
  const [isOpenArtifactView, setIsOpenArtifactView] = useState(false);
  const [artifactSelected, setArtifactSelected] = useState<TArtifact | null>(null);

  return (
    <>
      <LayoutSessionPage>
        <TableArtifacts
          setArtifactSelected={setArtifactSelected}
          setIsOpenArtifactView={setIsOpenArtifactView}
        />
      </LayoutSessionPage>

      <Dialog open={isOpenArtifactView} onOpenChange={setIsOpenArtifactView}>
        <DialogContent className={'min-w-[90vw] min-h-[50vh]'}>
          <DialogHeader>
            <DialogTitle>{artifactSelected?.name}</DialogTitle>
            <DialogDescription>{artifactSelected?.uri}</DialogDescription>
          </DialogHeader>
          <div>
            <SyntaxHighlighter
              showLineNumbers={true}
              style={theme.theme === 'light' ? codeThemeLight : codeThemeDark}
              data-slot="code"
              customStyle={{
                maxHeight: '50vh',
                minHeight: '50vh',
                overflowY: 'auto',
              }}
            >
              {artifactSelected?.data?.replace(/\n$/, '') || ''}
            </SyntaxHighlighter>
          </div>
          <DialogFooter>
            <DialogClose render={<Button variant="outline">Close</Button>} />
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </>
  );
};
