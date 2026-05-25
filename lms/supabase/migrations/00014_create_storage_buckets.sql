insert into storage.buckets (id, name, public, file_size_limit, allowed_mime_types)
values
  (
    'deliverables',
    'deliverables',
    false,
    26214400,
    array[
      'application/pdf',
      'application/vnd.openxmlformats-officedocument.wordprocessingml.document',
      'image/png',
      'image/jpeg',
      'text/plain',
      'text/markdown'
    ]
  ),
  (
    'footage',
    'footage',
    false,
    524288000,
    array['video/mp4', 'video/quicktime', 'video/webm']
  )
on conflict (id) do nothing;
