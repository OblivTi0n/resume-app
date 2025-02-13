'use client';

import { useEffect, useRef, useState } from 'react';
import { Upload, Loader2, ArrowRight } from 'lucide-react';
import { useRouter } from 'next/navigation';
import { supabase } from '@/lib/supabase';

export default function PDFViewer() {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const renderTaskRef = useRef<any>(null);
  const [pdfText, setPdfText] = useState<string>('');
  const [error, setError] = useState<string | null>(null);
  const [isDragging, setIsDragging] = useState(false);
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [isProcessing, setIsProcessing] = useState(false);
  const [isConverting, setIsConverting] = useState(false);
  const [structuredData, setStructuredData] = useState<any>(null);
  const router = useRouter();

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(true);
  };

  const handleDragLeave = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(false);
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(false);
    
    const file = e.dataTransfer.files?.[0];
    if (file && file.type === 'application/pdf') {
      processPDFFile(file);
    } else {
      setError('Please upload a valid PDF file.');
    }
  };

  const handleFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      await processPDFFile(file);
    }
  };

  const processPDFFile = async (file: File) => {
    try {
      setError(null);
      setPdfText('');
      setSelectedFile(file);
      setIsProcessing(true);

      const pdfJS = await import('pdfjs-dist');
      pdfJS.GlobalWorkerOptions.workerSrc = '/pdf.worker.min.mjs';

      const arrayBuffer = await file.arrayBuffer();
      const pdf = await pdfJS.getDocument({ data: arrayBuffer }).promise;
      const firstPage = await pdf.getPage(1);

      // Render PDF to canvas
      const viewport = firstPage.getViewport({ scale: 1.5 });
      const canvas = canvasRef.current!;
      const canvasContext = canvas.getContext('2d')!;
      canvas.width = viewport.width;
      canvas.height = viewport.height;

      if (renderTaskRef.current) {
        await renderTaskRef.current.promise;
      }

      const renderContext = { canvasContext, viewport };
      const renderTask = firstPage.render(renderContext);
      renderTaskRef.current = renderTask;
      await renderTask.promise;

      // Extract text
      let extractedText = '';
      for (let i = 1; i <= pdf.numPages; i++) {
        const page = await pdf.getPage(i);
        const textContent = await page.getTextContent();
        extractedText += textContent.items.map((item: any) => item.str).join(' ');
      }
      setPdfText(extractedText);
    } catch (err) {
      console.error('Error processing PDF:', err);
      setError('Failed to process PDF. Please try again.');
    } finally {
      setIsProcessing(false);
    }
  };

  const handleContinue = async () => {
    if (!pdfText) return;

    setIsConverting(true);
    try {
      // Convert text to JSON - updated endpoint URL
      const convertResponse = await fetch('http://localhost:3000/', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ text: pdfText, llm: "gemini"}),
      });

      if (!convertResponse.ok) {
        const errorData = await convertResponse.json();
        throw new Error(errorData.error || 'Conversion failed');
      }

      let parsedData;
      try {
        parsedData = await convertResponse.json();
      } catch (jsonError) {
        throw new Error('Invalid JSON response from server');
      }
      
      console.log('Parsed data:', parsedData);

      // Get current user session
      const { data: { session }, error: authError } = await supabase.auth.getSession();
      
      if (authError || !session) {
        throw new Error('User not authenticated');
      }

      // Insert into Supabase
      const { data, error: dbError } = await supabase
        .from('resumes')
        .insert([{
          user_id: session.user.id,
          title: '-', 
          type: 'base',
          content: parsedData
        }])
        .select();

      if (dbError) throw dbError;

      // Store and redirect
      sessionStorage.setItem('resumeData', JSON.stringify(data[0].content));
      router.push('/resumeedit');

    } catch (err) {
      console.error('Error:', err);
      setError(err instanceof Error ? err.message : 'Failed to process resume');
    } finally {
      setIsConverting(false);
    }
  };

  useEffect(() => {
    return () => {
      if (renderTaskRef.current) {
        renderTaskRef.current.cancel();
      }
    };
  }, []);

  return (
    <div className="min-h-screen bg-gradient-to-b from-gray-50 to-gray-100 py-12 px-4">
      <div className="max-w-3xl mx-auto">
        <div className="text-center mb-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-4">Import Your Resume</h1>
          <p className="text-gray-600">Upload your existing PDF resume to get started</p>
        </div>

        <div
          className={`mt-8 p-8 border-2 border-dashed rounded-lg transition-colors duration-200 ${
            isDragging
              ? 'border-blue-500 bg-blue-50'
              : 'border-gray-300 bg-white hover:border-gray-400'
          }`}
          onDragOver={handleDragOver}
          onDragLeave={handleDragLeave}
          onDrop={handleDrop}
        >
          <div className="text-center">
            <div className="mx-auto w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mb-4">
              <Upload className="h-8 w-8 text-gray-600" />
            </div>
            <p className="text-gray-600 mb-4">
              Drag and drop your PDF here, or{' '}
              <label className="text-blue-500 hover:text-blue-600 cursor-pointer">
                browse
                <input
                  type="file"
                  className="hidden"
                  accept=".pdf"
                  onChange={handleFileChange}
                />
              </label>
            </p>
            {selectedFile && (
              <div className="mt-4">
                <p className="text-sm text-gray-600">Selected file: {selectedFile.name}</p>
              </div>
            )}
          </div>
        </div>

        {selectedFile && (
          <div className="mt-8 space-y-6">
            <canvas
              ref={canvasRef}
              className="border border-gray-200 rounded-lg w-full max-w-2xl mx-auto"
            />

            {pdfText && !isProcessing && (
              <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-200">
                <h3 className="text-lg font-semibold mb-4">Extracted Text</h3>
                <div className="max-h-96 overflow-y-auto p-4 bg-gray-50 rounded-md">
                  <pre className="whitespace-pre-wrap font-mono text-sm">
                    {pdfText}
                  </pre>
                </div>
              </div>
            )}
          </div>
        )}

        {error && (
          <div className="mt-4 p-4 bg-red-50 border border-red-200 rounded-lg">
            <p className="text-red-600 text-sm">{error}</p>
          </div>
        )}

        {isProcessing && (
          <div className="mt-8 text-center">
            <div className="inline-flex items-center gap-2 text-gray-600">
              <Loader2 className="h-5 w-5 animate-spin" />
              <span>Extracting text from PDF...</span>
            </div>
          </div>
        )}

        {pdfText && !isProcessing && (
          <div className="mt-8 text-center space-y-4">
            <button
              onClick={handleContinue}
              disabled={isConverting}
              className="bg-blue-500 hover:bg-blue-600 text-white px-6 py-2 rounded-lg inline-flex items-center gap-2 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {isConverting ? (
                <>
                  <Loader2 className="h-4 w-4 animate-spin" />
                  Processing...
                </>
              ) : (
                <>
                  Continue to Structure Data
                  <ArrowRight className="h-4 w-4" />
                </>
              )}
            </button>
            
            {structuredData && (
              <div className="mt-4 p-4 bg-green-50 border border-green-200 rounded-lg">
                <p className="text-green-600 text-sm">
                  Data structured successfully! Check console for details.
                </p>
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
}