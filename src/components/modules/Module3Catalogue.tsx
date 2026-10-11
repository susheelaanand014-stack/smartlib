import React, { useState, useMemo } from 'react';
import { useLibrary } from '../../context/LibraryContext';
import { Book } from '../../types/library';
import {
  Search,
  Filter,
  ArrowUpDown,
  BookOpen,
  Plus,
  MapPin,
  CheckCircle2,
  XCircle,
  Edit,
  Archive,
  Layers,
  ChevronLeft,
  ChevronRight,
  Barcode,
  Sparkles,
  Info
} from 'lucide-react';
import { DataIntegrityBadge } from '../common/DataIntegrityBadge';

export const Module3Catalogue: React.FC = () => {
  const {
    books,
    currentUser,
    borrowBook,
    addNewBook,
    updateBook,
    toggleBookActive,
    addCopy,
    setSelectedBookForShelf,
    setActiveTab
  } = useLibrary();

  // Search, Filter, Sort & Pagination state
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCategory, setSelectedCategory] = useState<string>('ALL');
  const [availabilityFilter, setAvailabilityFilter] = useState<'ALL' | 'AVAILABLE_ONLY'>('ALL');
  const [sortBy, setSortBy] = useState<'title' | 'author' | 'year' | 'available'>('title');
  const [sortOrder, setSortOrder] = useState<'asc' | 'desc'>('asc');
  const [currentPage, setCurrentPage] = useState(1);
  const pageSize = 6;

  // Selected book for details modal
  const [selectedBook, setSelectedBook] = useState<Book | null>(null);

  // Admin Add / Edit modal state
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [editingBook, setEditingBook] = useState<Book | null>(null);
  const [formFeedback, setFormFeedback] = useState<{ type: 'success' | 'error'; message: string } | null>(null);

  // Add/Edit Book Form state
  const [formData, setFormData] = useState({
    isbn: '',
    title: '',
    author: '',
    category: 'Computer Science',
    publisher: '',
    publishYear: 2023,
    edition: '1st Edition',
    callNumber: '',
    description: '',
    coverUrl: 'https://images.unsplash.com/photo-1544716278-ca5e3f4abd8c?w=500&auto=format&fit=crop&q=80',
    totalCopies: 3,
    shelfFloor: 2,
    shelfWing: 'North Wing',
    shelfAisle: 'Aisle 3',
    shelfBay: 'Bay B-04',
    shelfLevel: 3,
    sectionCode: 'CS-REF-101',
    walkingDirections: '2nd Floor, Central Stacks'
  });

  // Extract categories
  const categories = useMemo(() => {
    const set = new Set(books.map(b => b.category));
    return ['ALL', ...Array.from(set)];
  }, [books]);

  // Filtered & Sorted books
  const filteredBooks = useMemo(() => {
    return books
      .filter(b => {
        // Admin sees all, users see only active books
        if (currentUser.role !== 'ADMIN' && !b.isActive) return false;

        const term = searchTerm.toLowerCase();
        const matchesSearch =
          !searchTerm ||
          b.title.toLowerCase().includes(term) ||
          b.author.toLowerCase().includes(term) ||
          b.isbn.toLowerCase().includes(term) ||
          b.tags.some(t => t.toLowerCase().includes(term));

        const matchesCategory = selectedCategory === 'ALL' || b.category === selectedCategory;
        const matchesAvailability = availabilityFilter === 'ALL' || b.availableCopies > 0;

        return matchesSearch && matchesCategory && matchesAvailability;
      })
      .sort((a, b) => {
        let cmp = 0;
        if (sortBy === 'title') cmp = a.title.localeCompare(b.title);
        else if (sortBy === 'author') cmp = a.author.localeCompare(b.author);
        else if (sortBy === 'year') cmp = a.publishYear - b.publishYear;
        else if (sortBy === 'available') cmp = a.availableCopies - b.availableCopies;
        return sortOrder === 'asc' ? cmp : -cmp;
      });
  }, [books, searchTerm, selectedCategory, availabilityFilter, sortBy, sortOrder, currentUser.role]);

  // Paginated books
  const totalPages = Math.ceil(filteredBooks.length / pageSize) || 1;
  const paginatedBooks = useMemo(() => {
    const start = (currentPage - 1) * pageSize;
    return filteredBooks.slice(start, start + pageSize);
  }, [filteredBooks, currentPage, pageSize]);

  // Quick ISBN validation (ISBN-10 or ISBN-13 format)
  const isValidIsbn = (isbn: string) => {
    const cleaned = isbn.replace(/[-\s]/g, '');
    return cleaned.length === 10 || cleaned.length === 13;
  };

  const handleOpenAdd = () => {
    setFormData({
      isbn: '978-013' + Math.floor(1000000 + Math.random() * 9000000),
      title: '',
      author: '',
      category: 'Computer Science',
      publisher: 'Pearson / MIT Press',
      publishYear: 2024,
      edition: '1st Edition',
      callNumber: 'QA 76.73 .' + Math.floor(100 + Math.random() * 899),
      description: '',
      coverUrl: 'https://images.unsplash.com/photo-1544716278-ca5e3f4abd8c?w=500&auto=format&fit=crop&q=80',
      totalCopies: 4,
      shelfFloor: 2,
      shelfWing: 'North Wing',
      shelfAisle: 'Aisle 4',
      shelfBay: 'Bay B-05',
      shelfLevel: 2,
      sectionCode: 'CS-ADV-302',
      walkingDirections: 'North Stacks, 4th Row'
    });
    setEditingBook(null);
    setFormFeedback(null);
    setIsAddModalOpen(true);
  };

  const handleOpenEdit = (b: Book) => {
    setFormData({
      isbn: b.isbn,
      title: b.title,
      author: b.author,
      category: b.category,
      publisher: b.publisher,
      publishYear: b.publishYear,
      edition: b.edition,
      callNumber: b.callNumber,
      description: b.description,
      coverUrl: b.coverUrl,
      totalCopies: b.totalCopies,
      shelfFloor: b.shelf.floor,
      shelfWing: b.shelf.wing,
      shelfAisle: b.shelf.aisle,
      shelfBay: b.shelf.bay,
      shelfLevel: b.shelf.shelfLevel,
      sectionCode: b.shelf.sectionCode,
      walkingDirections: b.shelf.walkingDirections
    });
    setEditingBook(b);
    setFormFeedback(null);
    setIsAddModalOpen(true);
  };

  const handleSaveBook = (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.title || !formData.author || !formData.isbn) {
      setFormFeedback({ type: 'error', message: 'Title, Author, and ISBN are mandatory.' });
      return;
    }

    if (!isValidIsbn(formData.isbn)) {
      setFormFeedback({ type: 'error', message: 'Invalid ISBN format. Must be a valid 10 or 13-digit standard ISBN.' });
      return;
    }

    if (editingBook) {
      const res = updateBook(editingBook.id, {
        title: formData.title,
        author: formData.author,
        isbn: formData.isbn,
        category: formData.category,
        publisher: formData.publisher,
        publishYear: Number(formData.publishYear),
        edition: formData.edition,
        callNumber: formData.callNumber,
        description: formData.description,
        coverUrl: formData.coverUrl,
        shelf: {
          ...editingBook.shelf,
          floor: Number(formData.shelfFloor),
          wing: formData.shelfWing,
          aisle: formData.shelfAisle,
          bay: formData.shelfBay,
          shelfLevel: Number(formData.shelfLevel),
          sectionCode: formData.sectionCode,
          walkingDirections: formData.walkingDirections
        }
      });
      setFormFeedback({ type: 'success', message: res.message });
      setTimeout(() => setIsAddModalOpen(false), 1200);
    } else {
      const res = addNewBook({
        isbn: formData.isbn,
        title: formData.title,
        author: formData.author,
        category: formData.category,
        publisher: formData.publisher,
        publishYear: Number(formData.publishYear),
        edition: formData.edition,
        callNumber: formData.callNumber,
        description: formData.description,
        coverUrl: formData.coverUrl,
        totalCopies: Number(formData.totalCopies),
        isActive: true,
        shelf: {
          floor: Number(formData.shelfFloor),
          wing: formData.shelfWing,
          aisle: formData.shelfAisle,
          bay: formData.shelfBay,
          shelfLevel: Number(formData.shelfLevel),
          sectionCode: formData.sectionCode,
          x: 40 + Math.floor(Math.random() * 30),
          y: 30 + Math.floor(Math.random() * 30),
          walkingDirections: formData.walkingDirections
        },
        tags: [formData.category.toLowerCase(), formData.title.toLowerCase()]
      });
      setFormFeedback({ type: 'success', message: res.message });
      setTimeout(() => setIsAddModalOpen(false), 1200);
    }
  };

  const handleBorrow = (book: Book) => {
    const res = borrowBook(book.id);
    alert(res.message);
  };

  const handleLocateOnMap = (book: Book) => {
    setSelectedBookForShelf(book);
    setActiveTab('shelf');
  };

  return (
    <div className="space-y-6">
      {/* Top Header & Admin Add Button */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 border-b border-slate-200 pb-5">
        <div>
          <div className="flex items-center gap-2">
            <span className="text-xs font-bold text-blue-600 uppercase tracking-wider">Module 3</span>
            <span className="text-slate-300">·</span>
            <DataIntegrityBadge type="verified" label="Standard MARC21 / Library of Congress" />
          </div>
          <h2 className="text-2xl font-bold text-slate-900 mt-1">University Book Catalogue</h2>
          <p className="text-xs text-slate-500 mt-0.5">
            Search physical books, inspect copy barcodes, and view shelf location coordinates
          </p>
        </div>

        {currentUser.role === 'ADMIN' && (
          <button
            onClick={handleOpenAdd}
            className="px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white text-xs font-semibold rounded-xl shadow-xs transition-colors flex items-center gap-1.5"
          >
            <Plus className="w-4 h-4" />
            <span>Add New Book (Admin)</span>
          </button>
        )}
      </div>

      {/* Search & Filter Bar */}
      <div className="bg-white p-4 rounded-2xl border border-slate-200 shadow-xs space-y-3">
        <div className="grid grid-cols-1 md:grid-cols-12 gap-3">
          {/* Search Input */}
          <div className="md:col-span-5 relative">
            <Search className="w-4 h-4 text-slate-400 absolute left-3 top-2.5" />
            <input
              type="text"
              placeholder="Search by Title, Author, ISBN, or Subject..."
              value={searchTerm}
              onChange={e => { setSearchTerm(e.target.value); setCurrentPage(1); }}
              className="w-full pl-9 pr-3 py-2 text-xs rounded-xl border border-slate-200 focus:outline-none focus:ring-2 focus:ring-blue-500 bg-slate-50/50"
            />
          </div>

          {/* Category Filter */}
          <div className="md:col-span-3">
            <select
              value={selectedCategory}
              onChange={e => { setSelectedCategory(e.target.value); setCurrentPage(1); }}
              className="w-full px-3 py-2 text-xs rounded-xl border border-slate-200 focus:outline-none focus:ring-2 focus:ring-blue-500 bg-white"
            >
              {categories.map(c => (
                <option key={c} value={c}>
                  {c === 'ALL' ? 'All Disciplines / Categories' : c}
                </option>
              ))}
            </select>
          </div>

          {/* Availability Toggle */}
          <div className="md:col-span-2">
            <select
              value={availabilityFilter}
              onChange={e => { setAvailabilityFilter(e.target.value as any); setCurrentPage(1); }}
              className="w-full px-3 py-2 text-xs rounded-xl border border-slate-200 focus:outline-none focus:ring-2 focus:ring-blue-500 bg-white"
            >
              <option value="ALL">All Items</option>
              <option value="AVAILABLE_ONLY">In-Stock Only</option>
            </select>
          </div>

          {/* Sort Selector */}
          <div className="md:col-span-2 flex items-center gap-1">
            <select
              value={sortBy}
              onChange={e => setSortBy(e.target.value as any)}
              className="w-full px-3 py-2 text-xs rounded-xl border border-slate-200 focus:outline-none focus:ring-2 focus:ring-blue-500 bg-white"
            >
              <option value="title">Sort by Title</option>
              <option value="author">Sort by Author</option>
              <option value="year">Sort by Year</option>
              <option value="available">Sort by Availability</option>
            </select>
            <button
              onClick={() => setSortOrder(prev => prev === 'asc' ? 'desc' : 'asc')}
              className="p-2 border border-slate-200 rounded-xl hover:bg-slate-50 text-slate-600"
              title="Toggle sort direction"
            >
              <ArrowUpDown className="w-3.5 h-3.5" />
            </button>
          </div>
        </div>

        {/* Status count bar */}
        <div className="flex flex-wrap items-center justify-between gap-2 text-xs text-slate-500 pt-1 border-t border-slate-100">
          <div>
            Showing <strong className="text-slate-900">{filteredBooks.length}</strong> books matching criteria
          </div>
          <div className="flex items-center gap-3">
            <span className="flex items-center gap-1">
              <span className="w-2 h-2 rounded-full bg-emerald-500"></span> Available on shelf
            </span>
            <span className="flex items-center gap-1">
              <span className="w-2 h-2 rounded-full bg-amber-500"></span> Checked out
            </span>
          </div>
        </div>
      </div>

      {/* Book Grid */}
      {filteredBooks.length === 0 ? (
        <div className="bg-white rounded-2xl p-12 text-center border border-slate-200 text-slate-500 space-y-3">
          <BookOpen className="w-10 h-10 mx-auto text-slate-300" />
          <h3 className="font-semibold text-slate-700">No books found matching your query</h3>
          <p className="text-xs text-slate-400">
            Try adjusting your search keywords, clearing discipline filters, or check the official library portal.
          </p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
          {paginatedBooks.map(book => {
            const hasAvailable = book.availableCopies > 0;
            return (
              <div
                key={book.id}
                className={`bg-white rounded-2xl border p-5 shadow-xs transition-all flex flex-col justify-between hover:shadow-md ${
                  !book.isActive ? 'border-dashed border-slate-300 opacity-70 bg-slate-50' : 'border-slate-200'
                }`}
              >
                <div className="space-y-3">
                  {/* Top metadata & cover thumbnail */}
                  <div className="flex items-start gap-3">
                    <img
                      src={book.coverUrl}
                      alt={book.title}
                      className="w-16 h-22 object-cover rounded-lg shadow-xs border border-slate-200 flex-shrink-0"
                    />
                    <div className="flex-1 min-w-0">
                      <div className="text-[10px] text-slate-500 font-semibold uppercase tracking-wider">
                        {book.category} · {book.publishYear}
                      </div>
                      <h3
                        onClick={() => setSelectedBook(book)}
                        className="text-sm font-bold text-slate-900 line-clamp-2 hover:text-blue-600 cursor-pointer mt-0.5 leading-snug"
                        title={book.title}
                      >
                        {book.title}
                      </h3>
                      <p className="text-xs text-slate-600 line-clamp-1 mt-0.5 font-medium">
                        {book.author}
                      </p>
                      <div className="text-[11px] text-slate-400 font-mono mt-1">
                        Call #: {book.callNumber}
                      </div>
                    </div>
                  </div>

                  {/* Physical Shelf Coordinates */}
                  <div className="p-2.5 bg-slate-50 rounded-xl border border-slate-100 text-xs space-y-1">
                    <div className="flex items-center justify-between text-[11px]">
                      <span className="text-slate-500 flex items-center gap-1">
                        <MapPin className="w-3 h-3 text-blue-600" />
                        Floor {book.shelf.floor} · {book.shelf.wing}
                      </span>
                      <span className="font-mono font-semibold text-slate-800">
                        {book.shelf.bay}
                      </span>
                    </div>
                    <div className="text-[10px] text-slate-500 font-mono truncate">
                      Section: {book.shelf.sectionCode}
                    </div>
                  </div>

                  {/* Copies availability count */}
                  <div className="flex items-center justify-between text-xs pt-1">
                    <div className="flex items-center gap-1.5">
                      <span
                        className={`w-2 h-2 rounded-full ${
                          hasAvailable ? 'bg-emerald-500' : 'bg-rose-500'
                        }`}
                      ></span>
                      <span className="font-semibold text-slate-700">
                        {book.availableCopies} of {book.totalCopies} copies available
                      </span>
                    </div>
                    {!book.isActive && (
                      <span className="text-[10px] bg-slate-200 text-slate-700 px-1.5 py-0.5 rounded font-bold">
                        ARCHIVED
                      </span>
                    )}
                  </div>
                </div>

                {/* Card Actions */}
                <div className="pt-4 mt-3 border-t border-slate-100 flex items-center justify-between gap-2">
                  <button
                    onClick={() => handleLocateOnMap(book)}
                    className="px-2.5 py-1.5 text-xs font-semibold text-blue-600 hover:text-blue-800 bg-blue-50 hover:bg-blue-100 rounded-lg transition-colors flex items-center gap-1"
                    title="Find exact shelf coordinates on interactive map"
                  >
                    <MapPin className="w-3.5 h-3.5" />
                    <span>Find Shelf</span>
                  </button>

                  <div className="flex items-center gap-1.5">
                    {currentUser.role === 'ADMIN' ? (
                      <>
                        <button
                          onClick={() => handleOpenEdit(book)}
                          className="p-1.5 text-slate-600 hover:text-slate-900 border border-slate-200 rounded-lg hover:bg-slate-50"
                          title="Edit Book Details"
                        >
                          <Edit className="w-3.5 h-3.5" />
                        </button>
                        <button
                          onClick={() => addCopy(book.id)}
                          className="p-1.5 text-blue-600 hover:text-blue-800 border border-blue-200 rounded-lg hover:bg-blue-50"
                          title="Add +1 Physical Copy"
                        >
                          <Plus className="w-3.5 h-3.5" />
                        </button>
                        <button
                          onClick={() => toggleBookActive(book.id)}
                          className="p-1.5 text-slate-500 hover:text-rose-600 border border-slate-200 rounded-lg hover:bg-rose-50"
                          title={book.isActive ? 'Deactivate / Archive' : 'Reactivate Book'}
                        >
                          <Archive className="w-3.5 h-3.5" />
                        </button>
                      </>
                    ) : (
                      <button
                        onClick={() => handleBorrow(book)}
                        disabled={!hasAvailable || !book.isActive}
                        className={`px-3 py-1.5 text-xs font-semibold rounded-lg transition-colors shadow-xs ${
                          hasAvailable && book.isActive
                            ? 'bg-blue-600 hover:bg-blue-700 text-white'
                            : 'bg-slate-100 text-slate-400 cursor-not-allowed'
                        }`}
                      >
                        {hasAvailable ? 'Borrow' : 'Checked Out'}
                      </button>
                    )}
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      )}

      {/* Pagination Controls */}
      {totalPages > 1 && (
        <div className="flex items-center justify-between bg-white px-4 py-3 rounded-2xl border border-slate-200 text-xs">
          <div className="text-slate-500">
            Page <strong className="text-slate-900">{currentPage}</strong> of <strong className="text-slate-900">{totalPages}</strong>
          </div>
          <div className="flex items-center gap-1">
            <button
              onClick={() => setCurrentPage(p => Math.max(1, p - 1))}
              disabled={currentPage === 1}
              className="p-1.5 rounded-lg border border-slate-200 text-slate-600 hover:bg-slate-50 disabled:opacity-40"
            >
              <ChevronLeft className="w-4 h-4" />
            </button>
            {Array.from({ length: totalPages }).map((_, idx) => (
              <button
                key={idx}
                onClick={() => setCurrentPage(idx + 1)}
                className={`w-7 h-7 rounded-lg text-xs font-semibold ${
                  currentPage === idx + 1
                    ? 'bg-blue-600 text-white'
                    : 'text-slate-600 hover:bg-slate-50'
                }`}
              >
                {idx + 1}
              </button>
            ))}
            <button
              onClick={() => setCurrentPage(p => Math.min(totalPages, p + 1))}
              disabled={currentPage === totalPages}
              className="p-1.5 rounded-lg border border-slate-200 text-slate-600 hover:bg-slate-50 disabled:opacity-40"
            >
              <ChevronRight className="w-4 h-4" />
            </button>
          </div>
        </div>
      )}

      {/* Book Details Modal */}
      {selectedBook && (
        <div className="fixed inset-0 z-50 bg-slate-900/60 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white rounded-3xl max-w-2xl w-full max-h-[90vh] overflow-y-auto shadow-2xl border border-slate-200 p-6 sm:p-8 space-y-6">
            <div className="flex items-start justify-between">
              <div className="flex items-start gap-4">
                <img
                  src={selectedBook.coverUrl}
                  alt={selectedBook.title}
                  className="w-20 h-28 object-cover rounded-xl shadow-md border border-slate-200 flex-shrink-0"
                />
                <div>
                  <span className="text-[10px] font-bold text-blue-600 uppercase tracking-wider">
                    {selectedBook.category} · {selectedBook.edition}
                  </span>
                  <h3 className="text-lg font-bold text-slate-900 mt-1 leading-snug">{selectedBook.title}</h3>
                  <p className="text-xs text-slate-600 font-medium mt-1">Author: {selectedBook.author}</p>
                  <p className="text-xs text-slate-500 mt-0.5">Publisher: {selectedBook.publisher} ({selectedBook.publishYear})</p>
                </div>
              </div>
              <button
                onClick={() => setSelectedBook(null)}
                className="text-slate-400 hover:text-slate-600 p-1"
              >
                ✕
              </button>
            </div>

            <p className="text-xs text-slate-600 leading-relaxed bg-slate-50 p-4 rounded-xl border border-slate-100">
              {selectedBook.description}
            </p>

            {/* Cataloguing & Shelf details */}
            <div className="grid grid-cols-2 sm:grid-cols-3 gap-3 text-xs">
              <div className="p-3 bg-slate-50 rounded-xl border border-slate-100">
                <span className="text-slate-500 block text-[10px]">ISBN-13</span>
                <span className="font-mono font-bold text-slate-900">{selectedBook.isbn}</span>
              </div>
              <div className="p-3 bg-slate-50 rounded-xl border border-slate-100">
                <span className="text-slate-500 block text-[10px]">Call Number</span>
                <span className="font-mono font-bold text-slate-900">{selectedBook.callNumber}</span>
              </div>
              <div className="p-3 bg-slate-50 rounded-xl border border-slate-100">
                <span className="text-slate-500 block text-[10px]">Shelf Location</span>
                <span className="font-bold text-blue-600">Floor {selectedBook.shelf.floor}, {selectedBook.shelf.bay}</span>
              </div>
            </div>

            {/* Physical Circulating Copies Barcode Table */}
            <div className="space-y-2">
              <div className="flex items-center justify-between">
                <h4 className="text-xs font-bold text-slate-800 uppercase tracking-wider flex items-center gap-1.5">
                  <Barcode className="w-4 h-4 text-blue-600" />
                  Physical Circulating Copies ({selectedBook.copies.length})
                </h4>
                <span className="text-xs text-emerald-600 font-semibold">
                  {selectedBook.availableCopies} Copies Available on Shelf
                </span>
              </div>

              <div className="border border-slate-200 rounded-xl overflow-hidden divide-y divide-slate-100 text-xs">
                {selectedBook.copies.map(copy => (
                  <div key={copy.copyBarcode} className="p-3 flex items-center justify-between hover:bg-slate-50">
                    <div className="flex items-center gap-3">
                      <Barcode className="w-4 h-4 text-slate-400" />
                      <div>
                        <span className="font-mono font-bold text-slate-900">{copy.copyBarcode}</span>
                        <span className="text-slate-400 text-[11px] ml-2">Copy #{copy.copyNumber} · Condition: {copy.condition}</span>
                      </div>
                    </div>
                    <div>
                      {copy.isAvailable ? (
                        <span className="inline-flex items-center gap-1 text-[11px] font-semibold text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded border border-emerald-200">
                          <CheckCircle2 className="w-3 h-3 text-emerald-500" /> In Library
                        </span>
                      ) : (
                        <span className="inline-flex items-center gap-1 text-[11px] font-semibold text-amber-700 bg-amber-50 px-2 py-0.5 rounded border border-amber-200">
                          Due {copy.currentDueDate || 'on loan'}
                        </span>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            </div>

            <div className="flex items-center justify-between pt-2">
              <button
                onClick={() => {
                  handleLocateOnMap(selectedBook);
                  setSelectedBook(null);
                }}
                className="px-4 py-2 bg-blue-50 hover:bg-blue-100 text-blue-700 font-semibold text-xs rounded-xl border border-blue-200 flex items-center gap-1.5"
              >
                <MapPin className="w-4 h-4" />
                <span>Locate on 2D Floor Map</span>
              </button>

              <button
                onClick={() => {
                  handleBorrow(selectedBook);
                  setSelectedBook(null);
                }}
                disabled={selectedBook.availableCopies === 0}
                className="px-5 py-2 bg-blue-600 hover:bg-blue-700 disabled:bg-slate-200 text-white font-semibold text-xs rounded-xl shadow-xs"
              >
                Borrow Book Now
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Admin Add / Edit Modal */}
      {isAddModalOpen && (
        <div className="fixed inset-0 z-50 bg-slate-900/60 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white rounded-3xl max-w-xl w-full max-h-[90vh] overflow-y-auto shadow-2xl border border-slate-200 p-6 sm:p-8 space-y-5">
            <div className="flex items-center justify-between border-b border-slate-100 pb-3">
              <h3 className="text-lg font-bold text-slate-900">
                {editingBook ? 'Edit Book Record' : 'Add New Book to Catalogue'}
              </h3>
              <button onClick={() => setIsAddModalOpen(false)} className="text-slate-400 hover:text-slate-600">
                ✕
              </button>
            </div>

            {formFeedback && (
              <div
                className={`p-3 rounded-xl text-xs flex items-center gap-2 ${
                  formFeedback.type === 'success'
                    ? 'bg-emerald-50 text-emerald-800 border border-emerald-200'
                    : 'bg-rose-50 text-rose-800 border border-rose-200'
                }`}
              >
                {formFeedback.type === 'success' ? (
                  <CheckCircle2 className="w-4 h-4 text-emerald-600" />
                ) : (
                  <XCircle className="w-4 h-4 text-rose-600" />
                )}
                <span>{formFeedback.message}</span>
              </div>
            )}

            <form onSubmit={handleSaveBook} className="space-y-4 text-xs">
              <div>
                <label className="block font-semibold text-slate-700 mb-1">Book Title *</label>
                <input
                  type="text"
                  required
                  value={formData.title}
                  onChange={e => setFormData({ ...formData, title: e.target.value })}
                  placeholder="e.g. Distributed Systems: Concepts and Design"
                  className="w-full px-3 py-2 border border-slate-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:outline-none"
                />
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="block font-semibold text-slate-700 mb-1">Author(s) *</label>
                  <input
                    type="text"
                    required
                    value={formData.author}
                    onChange={e => setFormData({ ...formData, author: e.target.value })}
                    placeholder="George Coulouris, Jean Dollimore"
                    className="w-full px-3 py-2 border border-slate-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:outline-none"
                  />
                </div>
                <div>
                  <label className="block font-semibold text-slate-700 mb-1">ISBN-10 / 13 *</label>
                  <input
                    type="text"
                    required
                    value={formData.isbn}
                    onChange={e => setFormData({ ...formData, isbn: e.target.value })}
                    placeholder="978-0132143011"
                    className="w-full px-3 py-2 border border-slate-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:outline-none font-mono"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                <div>
                  <label className="block font-semibold text-slate-700 mb-1">Discipline</label>
                  <select
                    value={formData.category}
                    onChange={e => setFormData({ ...formData, category: e.target.value })}
                    className="w-full px-3 py-2 border border-slate-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:outline-none bg-white"
                  >
                    <option value="Computer Science">Computer Science</option>
                    <option value="Artificial Intelligence">Artificial Intelligence</option>
                    <option value="Data Science">Data Science</option>
                    <option value="Business & Management">Business & Management</option>
                    <option value="Law & Governance">Law & Governance</option>
                    <option value="Engineering">Engineering</option>
                  </select>
                </div>
                <div>
                  <label className="block font-semibold text-slate-700 mb-1">Publish Year</label>
                  <input
                    type="number"
                    value={formData.publishYear}
                    onChange={e => setFormData({ ...formData, publishYear: Number(e.target.value) })}
                    className="w-full px-3 py-2 border border-slate-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:outline-none"
                  />
                </div>
                <div>
                  <label className="block font-semibold text-slate-700 mb-1">Call Number</label>
                  <input
                    type="text"
                    value={formData.callNumber}
                    onChange={e => setFormData({ ...formData, callNumber: e.target.value })}
                    placeholder="QA 76.9 .D5"
                    className="w-full px-3 py-2 border border-slate-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:outline-none font-mono"
                  />
                </div>
              </div>

              <div>
                <label className="block font-semibold text-slate-700 mb-1">Description</label>
                <textarea
                  rows={2}
                  value={formData.description}
                  onChange={e => setFormData({ ...formData, description: e.target.value })}
                  placeholder="Summary of course topics and syllabus relevance..."
                  className="w-full px-3 py-2 border border-slate-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:outline-none"
                />
              </div>

              {/* Shelf Coordinates */}
              <div className="p-3.5 bg-slate-50 rounded-xl border border-slate-200 space-y-3">
                <span className="font-bold text-slate-800 uppercase tracking-wider block text-[11px]">
                  Physical Shelf & Floor Coordinates
                </span>
                <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
                  <div>
                    <label className="block text-[10px] text-slate-500">Floor</label>
                    <input
                      type="number"
                      value={formData.shelfFloor}
                      onChange={e => setFormData({ ...formData, shelfFloor: Number(e.target.value) })}
                      className="w-full px-2 py-1.5 border rounded-lg bg-white"
                    />
                  </div>
                  <div>
                    <label className="block text-[10px] text-slate-500">Wing</label>
                    <input
                      type="text"
                      value={formData.shelfWing}
                      onChange={e => setFormData({ ...formData, shelfWing: e.target.value })}
                      className="w-full px-2 py-1.5 border rounded-lg bg-white"
                    />
                  </div>
                  <div>
                    <label className="block text-[10px] text-slate-500">Aisle</label>
                    <input
                      type="text"
                      value={formData.shelfAisle}
                      onChange={e => setFormData({ ...formData, shelfAisle: e.target.value })}
                      className="w-full px-2 py-1.5 border rounded-lg bg-white"
                    />
                  </div>
                  <div>
                    <label className="block text-[10px] text-slate-500">Bay</label>
                    <input
                      type="text"
                      value={formData.shelfBay}
                      onChange={e => setFormData({ ...formData, shelfBay: e.target.value })}
                      className="w-full px-2 py-1.5 border rounded-lg bg-white font-mono"
                    />
                  </div>
                </div>
              </div>

              {!editingBook && (
                <div>
                  <label className="block font-semibold text-slate-700 mb-1">Initial Physical Copies to Mint</label>
                  <input
                    type="number"
                    min={1}
                    max={20}
                    value={formData.totalCopies}
                    onChange={e => setFormData({ ...formData, totalCopies: Number(e.target.value) })}
                    className="w-full px-3 py-2 border border-slate-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:outline-none"
                  />
                  <p className="text-[11px] text-slate-400 mt-0.5">Barcodes will be automatically minted (e.g. SL-CS-2026-C1)</p>
                </div>
              )}

              <div className="flex items-center justify-end gap-2 pt-2 border-t border-slate-100">
                <button
                  type="button"
                  onClick={() => setIsAddModalOpen(false)}
                  className="px-4 py-2 border border-slate-300 rounded-xl font-semibold text-slate-600 hover:bg-slate-50"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 bg-blue-600 hover:bg-blue-700 text-white font-semibold rounded-xl shadow-xs"
                >
                  {editingBook ? 'Update Book' : 'Add to Catalogue'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
