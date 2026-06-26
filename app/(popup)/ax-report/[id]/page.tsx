import { AxReportViewPageClient } from './AxReportViewPageClient';

export default async function AxReportPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  return <AxReportViewPageClient reportId={id} />;
}
