import { useEffect, useRef, useState } from 'react';
import { useNavigate } from 'react-router';
import {
  getDocuments,
  getFaculty,
  getFormerFaculty,
  getPrograms,
  getPublications,
} from '~/data/loaders';
import styles from './CommandPalette.module.css';

type SearchResult = {
  title: string;
  url: string;
  category: string;
};

export function CommandPalette() {
  const [isOpen, setIsOpen] = useState(false);
  const [query, setQuery] = useState('');
  const [selectedIndex, setSelectedIndex] = useState(0);
  const inputRef = useRef<HTMLInputElement>(null);
  const navigate = useNavigate();

  const results = useSearch(query);

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if ((e.metaKey || e.ctrlKey) && e.key === 'k') {
        e.preventDefault();
        setIsOpen((prev) => !prev);
      }
      if (e.key === 'Escape') {
        setIsOpen(false);
      }
    };

    document.addEventListener('keydown', handleKeyDown);
    return () => document.removeEventListener('keydown', handleKeyDown);
  }, []);

  useEffect(() => {
    if (isOpen) {
      inputRef.current?.focus();
      // Reset selection when modal opens
      // eslint-disable-next-line react-hooks/set-state-in-effect
      setSelectedIndex(0);
    } else {
      // Clear query when modal closes

      setQuery('');
    }
  }, [isOpen]);

  useEffect(() => {
    // Reset selection when search query changes
    // eslint-disable-next-line react-hooks/set-state-in-effect
    setSelectedIndex(0);
  }, [query]);

  const handleSelect = (url: string) => {
    navigate(url);
    setIsOpen(false);
  };

  const handleKeyDownInPalette = (e: React.KeyboardEvent) => {
    if (e.key === 'ArrowDown') {
      e.preventDefault();
      setSelectedIndex((i) => (i + 1) % results.length);
    } else if (e.key === 'ArrowUp') {
      e.preventDefault();
      setSelectedIndex((i) => (i - 1 + results.length) % results.length);
    } else if (e.key === 'Enter' && results[selectedIndex]) {
      e.preventDefault();
      handleSelect(results[selectedIndex].url);
    }
  };

  if (!isOpen) return null;

  return (
    <div className={styles.backdrop} onClick={() => setIsOpen(false)}>
      <div
        className={styles.palette}
        onClick={(e) => e.stopPropagation()}
        onKeyDown={handleKeyDownInPalette}
        role="dialog"
        aria-modal="true"
        aria-label="Search"
      >
        <div className={styles.header}>
          <input
            ref={inputRef}
            type="search"
            className={styles.input}
            placeholder="Search programmes, people, documents..."
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            aria-label="Search"
          />
          <kbd className={styles.kbd}>ESC</kbd>
        </div>
        <div className={styles.results}>
          {results.length === 0 && query && (
            <div className={styles.empty}>No results found for "{query}"</div>
          )}
          {results.length === 0 && !query && (
            <div className={styles.empty}>
              Start typing to search programmes, people, and documents
            </div>
          )}
          {results.slice(0, 10).map((result, i) => (
            <button
              key={result.url}
              className={`${styles.result} ${i === selectedIndex ? styles.selected : ''}`}
              onClick={() => handleSelect(result.url)}
              onMouseEnter={() => setSelectedIndex(i)}
            >
              <div className={styles.resultTitle}>{result.title}</div>
              <div className={styles.resultCategory}>{result.category}</div>
            </button>
          ))}
        </div>
        <div className={styles.footer}>
          <span className={styles.hint}>
            <kbd>↑</kbd>
            <kbd>↓</kbd> Navigate
          </span>
          <span className={styles.hint}>
            <kbd>↵</kbd> Select
          </span>
          <span className={styles.hint}>
            <kbd>ESC</kbd> Close
          </span>
        </div>
      </div>
    </div>
  );
}

function useSearch(query: string): SearchResult[] {
  if (!query || query.length < 2) return [];

  const lowerQuery = query.toLowerCase();
  const results: SearchResult[] = [];

  // Search programmes
  const programs = getPrograms();
  programs.forEach((p) => {
    if (
      p.title.toLowerCase().includes(lowerQuery) ||
      p.level.toLowerCase().includes(lowerQuery)
    ) {
      results.push({
        title: p.title,
        url: `/academics/programs/${p.slug}`,
        category: 'Programmes',
      });
    }
  });

  // Search faculty
  const faculty = getFaculty();
  faculty.forEach((f) => {
    if (
      f.name.toLowerCase().includes(lowerQuery) ||
      f.title.toLowerCase().includes(lowerQuery)
    ) {
      results.push({
        title: f.name,
        url: `/people/faculty/${f.slug}`,
        category: 'Faculty',
      });
    }
  });

  // Search former faculty
  const former = getFormerFaculty();
  former.forEach((f) => {
    if (f.name.toLowerCase().includes(lowerQuery)) {
      results.push({
        title: f.name,
        url: `/people/former/${f.slug}`,
        category: 'Former Faculty',
      });
    }
  });

  // Search publications
  const publications = getPublications();
  publications.forEach((p) => {
    if (
      p.title.toLowerCase().includes(lowerQuery) ||
      p.authors.toLowerCase().includes(lowerQuery)
    ) {
      results.push({
        title: p.title,
        url: `/research/publications/${p.id}`,
        category: 'Publications',
      });
    }
  });

  // Search documents
  const documents = getDocuments();
  documents.forEach((d) => {
    if (
      d.title.toLowerCase().includes(lowerQuery) ||
      d.type.toLowerCase().includes(lowerQuery)
    ) {
      results.push({
        title: d.title,
        url: `/documents/${d.slug}`,
        category: 'Documents',
      });
    }
  });

  return results.slice(0, 50); // Limit to 50 results
}
