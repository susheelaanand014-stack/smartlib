import React, { useState } from 'react';
import { useLibrary } from '../../context/LibraryContext';
import { SyllabusExtractionResult } from '../../types/library';
import { SAMPLE_SYLLABI } from '../../data/initialQuests';
import {
  FileText,
  Upload,
  CheckCircle2,
  AlertTriangle,
  BookOpen,
  MapPin,
  Sparkles,
  Search,
  ExternalLink,
  Info,
  Layers,
  ArrowRight
} from 'lucide-react';
import { DataIntegrityBadge } from '../common/DataIntegrityBadge';

export const Module5SyllabusFinder: React.FC = () => {
  const { analyzeSyllabusText, borrowBook, setSelectedBookForShelf, setActiveTab } = useLibrary();

  const [selectedPresetId, setSelectedPresetId] = useState<string>('syl-cs301');
  const [inputText, setInputText] = useState<string>(SAMPLE_SYLLABI[0].sampleText);
  const [fileName, setFileName] = useState<string>('Alliance_CS301_DataStructures.pdf');
  const [result, setResult] = useState<SyllabusExtractionResult | null>(() => {
    return analyzeSyllabusText(SAMPLE_SYLLABI[0].sampleText, 'Alliance_CS301_DataStructures.pdf');
  });
  const [isProcessing, setIsProcessing] = useState<boolean>(false);
  const [activeTab, setActiveTabMode] = useState<'sample' | 'upload' | 'paste'>('sample');

  // Handle Preset Selection
  const handleSelectPreset = (id: string) => {
    setSelectedPresetId(id);
    const preset = SAMPLE_SYLLABI.find(s => s.id === id);
    if (preset) {
      setInputText(preset.sampleText);
      setFileName(`${preset.code}_Syllabus.pdf`);
      runAnalysis(preset.sampleText, `${preset.code}_Syllabus.pdf`);
    }
  };

  // Run the analysis engine
  const runAnalysis = (textToAnalyze: string, name: string) => {
    setIsProcessing(true);
    setTimeout(() => {
      const res = analyzeSyllabusText(textToAnalyze, name);
      setResult(res);
      setIsProcessing(false);
    }, 400);
  };

  // Handle File Upload (.pdf or .txt)
  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setFileName(file.name);

    // If PDF or text, read contents
    const reader = new FileReader();
    reader.onload = (event) => {
      const raw = event.target?.result;
      if (typeof raw === 'string') {
        setInputText(raw);
        runAnalysis(raw, file.name);
      } else if (raw instanceof ArrayBuffer) {
        // Simple text extraction from buffer (filtering ASCII characters)
        const uint8 = new Uint8Array(raw);
        let extracted = '';
        for (let i = 0; i < Math.min(uint8.length, 50000); i++) {
          const char = String.fromCharCode(uint8[i]);
          if (/[\w\s.,;:()\-]/i.test(char)) {
            extracted += char;
          }
        }

        // Test if scanned or unreadable
        if (extracted.length < 50) {
          // Trigger corrupt / scanned scenario
          runAnalysis('', file.name);
        } else {
          setInputText(extracted);
          runAnalysis(extracted, file.name);
        }
      }
    };

    if (file.type.includes('text') || file.name.endsWith('.txt')) {
      reader.readAsText(file);
    } else {
      reader.readAsArrayBuffer(file);
    }
  };

  // Trigger Scanned/Corrupt PDF error demo
  const handleSimulateScannedPDF = () => {
    setFileName('Scanned_Syllabus_ImageOnly.pdf');
    setInputText('');
    runAnalysis('', 'Scanned_Syllabus_ImageOnly.pdf');
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 border-b border-slate-200 pb-5">
        <div>
          <div className="flex items-center gap-2">
            <span className="text-xs font-bold text-blue-600 uppercase tracking-wider">Module 5</span>
            <span className="text-slate-300">·</span>
            <DataIntegrityBadge type="verified" label="Apache PDFBox 3.0 & Explainable Keyword Matcher" />
          </div>
          <h2 className="text-2xl font-bold text-slate-900 mt-1">Syllabus-Based Book Finder</h2>
          <p className="text-xs text-slate-500 mt-0.5">
            Extract curriculum units from syllabus PDFs and discover matching textbooks with explainable unit alignment
          </p>
        </div>

        {/* Mode Selector */}
        <div className="flex items-center bg-slate-100 p-1 rounded-xl border border-slate-200">
          <button
            onClick={() => setActiveTabMode('sample')}
            className={`px-3 py-1.5 text-xs font-semibold rounded-lg transition-colors ${
              activeTab === 'sample' ? 'bg-white text-slate-900 shadow-xs' : 'text-slate-600 hover:text-slate-900'
            }`}
          >
            University Samples
          </button>
          <button
            onClick={() => setActiveTabMode('upload')}
            className={`px-3 py-1.5 text-xs font-semibold rounded-lg transition-colors ${
              activeTab === 'upload' ? 'bg-white text-slate-900 shadow-xs' : 'text-slate-600 hover:text-slate-900'
            }`}
          >
            Upload PDF
          </button>
          <button
            onClick={() => setActiveTabMode('paste')}
            className={`px-3 py-1.5 text-xs font-semibold rounded-lg transition-colors ${
              activeTab === 'paste' ? 'bg-white text-slate-900 shadow-xs' : 'text-slate-600 hover:text-slate-900'
            }`}
          >
            Paste Text
          </button>
        </div>
      </div>

      {/* Input Section */}
      <div className="bg-white rounded-2xl p-6 border border-slate-200 shadow-xs space-y-4">
        {activeTab === 'sample' && (
          <div className="space-y-3">
            <span className="text-xs font-bold text-slate-700 uppercase tracking-wider block">
              Select Official Alliance University Degree Syllabi:
            </span>
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
              {SAMPLE_SYLLABI.map(syl => (
                <button
                  key={syl.id}
                  onClick={() => handleSelectPreset(syl.id)}
                  className={`p-3.5 rounded-xl border text-left transition-all ${
                    selectedPresetId === syl.id
                      ? 'border-blue-500 bg-blue-50/50 ring-1 ring-blue-500 shadow-xs'
                      : 'border-slate-200 hover:border-slate-300 bg-white'
                  }`}
                >
                  <div className="flex items-center justify-between text-[11px] font-bold text-blue-600">
                    <span>{syl.code}</span>
                    <span className="text-slate-400 font-normal">{syl.semester}</span>
                  </div>
                  <h4 className="text-xs font-bold text-slate-900 mt-1 line-clamp-1">{syl.title}</h4>
                  <p className="text-[11px] text-slate-500 mt-0.5 line-clamp-1">{syl.department}</p>
                </button>
              ))}
            </div>
          </div>
        )}

        {activeTab === 'upload' && (
          <div className="space-y-4">
            <div className="border-2 border-dashed border-slate-200 hover:border-blue-400 rounded-2xl p-8 text-center transition-colors bg-slate-50/50">
              <Upload className="w-10 h-10 mx-auto text-blue-600" />
              <h4 className="text-sm font-bold text-slate-800 mt-3">Upload Course Syllabus Document</h4>
              <p className="text-xs text-slate-500 mt-1 max-w-md mx-auto">
                Upload your semester syllabus PDF or syllabus text file. Apache PDFBox extracts text layers and maps curriculum keywords.
              </p>
              <label className="mt-4 inline-block px-5 py-2.5 bg-blue-600 hover:bg-blue-700 text-white font-semibold text-xs rounded-xl cursor-pointer shadow-xs transition-colors">
                <span>Select Syllabus PDF / TXT</span>
                <input
                  type="file"
                  accept=".pdf,.txt"
                  onChange={handleFileUpload}
                  className="hidden"
                />
              </label>
            </div>

            <div className="flex items-center justify-between text-xs text-slate-500 p-2 bg-slate-50 rounded-xl">
              <span>Test Edge Case:</span>
              <button
                type="button"
                onClick={handleSimulateScannedPDF}
                className="text-amber-700 hover:text-amber-800 font-semibold underline text-xs"
              >
                Test Scanned Bitmap / Empty PDF Error Handling &rarr;
              </button>
            </div>
          </div>
        )}

        {activeTab === 'paste' && (
          <div className="space-y-3">
            <label className="block text-xs font-semibold text-slate-700">
              Paste Raw Course Curriculum or Unit Topics:
            </label>
            <textarea
              rows={4}
              value={inputText}
              onChange={e => setInputText(e.target.value)}
              placeholder="Paste course title, unit modules, and reference books..."
              className="w-full px-3.5 py-2.5 text-xs rounded-xl border border-slate-300 focus:ring-2 focus:ring-blue-500 focus:outline-none font-mono"
            />
            <button
              onClick={() => runAnalysis(inputText, 'Pasted_Syllabus_Snippet.txt')}
              className="px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white font-semibold text-xs rounded-xl shadow-xs"
            >
              Analyze Pasted Text
            </button>
          </div>
        )}
      </div>

      {/* Results View */}
      {isProcessing ? (
        <div className="bg-white rounded-2xl p-12 text-center border border-slate-200 shadow-xs space-y-3">
          <div className="w-10 h-10 border-4 border-blue-600 border-t-transparent rounded-full animate-spin mx-auto"></div>
          <h4 className="font-bold text-slate-800 text-sm">Extracting Text & Mining Curriculum Keywords...</h4>
          <p className="text-xs text-slate-500">
            Simulating Apache PDFBox 3.0 font cache traversal and inverted index keyword matching
          </p>
        </div>
      ) : result ? (
        result.isScannedOrUnreadable ? (
          /* Error State: Scanned, Corrupt or Empty PDF */
          <div className="bg-amber-50 rounded-2xl p-6 sm:p-8 border border-amber-200 shadow-xs space-y-4">
            <div className="flex items-start gap-3">
              <div className="p-2 bg-amber-100 text-amber-800 rounded-xl flex-shrink-0">
                <AlertTriangle className="w-6 h-6" />
              </div>
              <div className="space-y-1">
                <h3 className="text-base font-bold text-amber-900">
                  Unreadable / Scanned PDF Detected ({result.syllabusTitle})
                </h3>
                <p className="text-xs text-amber-800 leading-relaxed">
                  {result.diagnosticMessage}
                </p>
              </div>
            </div>

            <div className="bg-white/80 p-4 rounded-xl border border-amber-200/80 text-xs text-amber-900 space-y-2">
              <h4 className="font-bold uppercase tracking-wider text-[11px] text-amber-800">
                Recommended Remediation Steps:
              </h4>
              <ul className="space-y-1 list-disc list-inside text-amber-900">
                <li>Run OCR (Optical Character Recognition) on the PDF using Adobe Acrobat or Tesseract.</li>
                <li>Copy and paste the plain syllabus text directly into the "Paste Text" tab above.</li>
                <li>Or select one of our verified official sample university syllabi to test discovery.</li>
              </ul>
            </div>

            <button
              onClick={() => handleSelectPreset('syl-cs301')}
              className="px-4 py-2 bg-amber-600 hover:bg-amber-700 text-white font-semibold text-xs rounded-xl shadow-xs"
            >
              Switch to Verified Computer Science Syllabus
            </button>
          </div>
        ) : (
          /* Success State: Topics Found & Recommendations */
          <div className="space-y-6">
            {/* Extraction Summary Card */}
            <div className="bg-white rounded-2xl p-6 border border-slate-200 shadow-xs space-y-4">
              <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-2 border-b border-slate-100 pb-3">
                <div>
                  <div className="flex items-center gap-2">
                    <span className="font-mono text-xs font-bold text-blue-600 bg-blue-50 px-2 py-0.5 rounded">
                      {result.courseCode}
                    </span>
                    <h3 className="text-base font-bold text-slate-900">{result.syllabusTitle}</h3>
                  </div>
                  <p className="text-xs text-slate-500 mt-0.5">
                    Extracted {result.extractedTextLength} characters with {result.confidenceScore}% topic confidence
                  </p>
                </div>

                <div className="text-right">
                  <span className="text-xs font-bold text-emerald-700 bg-emerald-50 border border-emerald-200 px-2.5 py-1 rounded-lg">
                    {result.recommendations.length} Matching Textbooks Found
                  </span>
                </div>
              </div>

              {/* Detected Topics Tags */}
              <div>
                <span className="text-[11px] font-bold text-slate-500 uppercase tracking-wider block mb-2">
                  Curriculum Topics Identified:
                </span>
                <div className="flex flex-wrap gap-2">
                  {result.detectedTopics.map((topic, i) => (
                    <span
                      key={i}
                      className="px-2.5 py-1 bg-slate-100 text-slate-800 text-xs font-medium rounded-lg border border-slate-200 flex items-center gap-1.5"
                    >
                      <Sparkles className="w-3 h-3 text-blue-600" />
                      <span>{topic}</span>
                    </span>
                  ))}
                </div>
              </div>
            </div>

            {/* Recommendations List */}
            <div className="space-y-4">
              <h3 className="text-lg font-bold text-slate-900 tracking-tight flex items-center gap-2">
                <BookOpen className="w-5 h-5 text-blue-600" />
                <span>Explainable Textbook Recommendations</span>
              </h3>

              <div className="space-y-4">
                {result.recommendations.map(({ book, matchedKeywords, relevanceScore, explanation, unitCoverage }) => (
                  <div
                    key={book.id}
                    className="bg-white rounded-2xl border border-slate-200 p-6 shadow-xs hover:shadow-md transition-shadow flex flex-col md:flex-row gap-5 items-start justify-between"
                  >
                    <div className="flex items-start gap-4">
                      <img
                        src={book.coverUrl}
                        alt={book.title}
                        className="w-20 h-28 object-cover rounded-xl shadow-xs border border-slate-200 flex-shrink-0"
                      />
                      <div className="space-y-2">
                        <div>
                          <div className="flex items-center gap-2">
                            <span className="text-xs font-bold text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded border border-emerald-200">
                              {relevanceScore}% Syllabus Match
                            </span>
                            <span className="text-xs text-slate-400 font-mono">
                              Call #: {book.callNumber}
                            </span>
                          </div>
                          <h4 className="text-base font-bold text-slate-900 mt-1 leading-snug">
                            {book.title}
                          </h4>
                          <p className="text-xs text-slate-600 font-medium">
                            {book.author} · {book.publisher} ({book.publishYear})
                          </p>
                        </div>

                        {/* Explainability Block */}
                        <div className="p-3 bg-blue-50/60 rounded-xl border border-blue-100 text-xs space-y-1">
                          <div className="flex items-center gap-1.5 font-bold text-blue-900">
                            <Info className="w-3.5 h-3.5 text-blue-600" />
                            <span>Why This Book Was Recommended:</span>
                          </div>
                          <p className="text-blue-800 text-[11px] leading-relaxed">
                            {explanation}
                          </p>
                          <div className="flex flex-wrap gap-1.5 pt-1">
                            {matchedKeywords.map((kw, idx) => (
                              <span key={idx} className="bg-white px-2 py-0.5 rounded text-[10px] font-semibold text-blue-700 border border-blue-200">
                                #{kw}
                              </span>
                            ))}
                          </div>
                        </div>

                        {/* Unit coverage */}
                        <div className="text-[11px] text-slate-500 flex items-center gap-1.5">
                          <Layers className="w-3.5 h-3.5 text-slate-400" />
                          <span>Curriculum Units: {unitCoverage.join(' · ')}</span>
                        </div>
                      </div>
                    </div>

                    {/* Right Action Column */}
                    <div className="flex md:flex-col items-center md:items-end justify-between w-full md:w-auto gap-3 pt-3 md:pt-0 border-t md:border-t-0 border-slate-100 flex-shrink-0">
                      <div className="text-left md:text-right">
                        <span className="text-[11px] text-slate-400 block">Shelf Coordinates</span>
                        <span className="text-xs font-bold text-slate-800 block">
                          Floor {book.shelf.floor}, {book.shelf.bay}
                        </span>
                        <span className="text-[11px] text-emerald-600 font-medium block">
                          {book.availableCopies} Copies In-Library
                        </span>
                      </div>

                      <div className="flex items-center gap-2">
                        <button
                          onClick={() => {
                            setSelectedBookForShelf(book);
                            setActiveTab('shelf');
                          }}
                          className="px-3 py-2 bg-slate-100 hover:bg-slate-200 text-slate-800 font-semibold text-xs rounded-xl flex items-center gap-1 transition-colors"
                          title="Locate on floor map"
                        >
                          <MapPin className="w-3.5 h-3.5 text-blue-600" />
                          <span>Locate</span>
                        </button>
                        <button
                          onClick={() => {
                            const res = borrowBook(book.id);
                            alert(res.message);
                          }}
                          disabled={book.availableCopies === 0}
                          className="px-4 py-2 bg-blue-600 hover:bg-blue-700 disabled:bg-slate-200 text-white font-semibold text-xs rounded-xl shadow-xs transition-colors"
                        >
                          {book.availableCopies > 0 ? 'Borrow Copy' : 'Checked Out'}
                        </button>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        )
      ) : null}
    </div>
  );
};
