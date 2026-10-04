import { LayoutDocsPage } from '@/views/docs/ui/layout-docs-page.tsx';
import { useEffect, useState } from 'react';
import { DocsViewer } from '@/views/docs/ui/components/docs-viewer.tsx';

export const DocsWebViewPage = () => {
  const [docs, setDocs] = useState<string | null>(null);

  useEffect(() => {
    (async () => {
      const docsResponse = await fetch('/docs/web-view.md');
      const docs = (await docsResponse.text()).replaceAll('<BASE_URL>', window.location.origin);
      setDocs(docs);
    })();
  }, []);

  return (
    <LayoutDocsPage>
      <DocsViewer docs={docs} />
    </LayoutDocsPage>
  );
};
