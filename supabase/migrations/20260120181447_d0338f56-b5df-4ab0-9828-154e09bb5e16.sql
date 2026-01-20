-- Create storage bucket for syllabus PDFs
INSERT INTO storage.buckets (id, name, public, file_size_limit, allowed_mime_types)
VALUES ('syllabus-pdfs', 'syllabus-pdfs', true, 10485760, ARRAY['application/pdf']);

-- Allow anyone to upload PDFs (no auth required as per requirements)
CREATE POLICY "Anyone can upload syllabus PDFs"
ON storage.objects FOR INSERT
WITH CHECK (bucket_id = 'syllabus-pdfs');

-- Allow anyone to read syllabus PDFs
CREATE POLICY "Anyone can read syllabus PDFs"
ON storage.objects FOR SELECT
USING (bucket_id = 'syllabus-pdfs');

-- Allow anyone to delete their uploaded PDFs (for cleanup)
CREATE POLICY "Anyone can delete syllabus PDFs"
ON storage.objects FOR DELETE
USING (bucket_id = 'syllabus-pdfs');