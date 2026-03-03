export const PostBody = ({ html }: { html: string }) => (
  <section
    className="prose prose-slate dark:prose-invert max-w-none font-sans"
    dangerouslySetInnerHTML={{ __html: html }}
  />
);
