import React, { useRef, useEffect, useState } from 'react';
import WritingToolbar from './WritingToolbar';

const RichTextEditor = ({ value, onChange, placeholder = 'Start writing your notes...', height = '400px' }) => {
  const editorRef = useRef(null);
  const [isInitialized, setIsInitialized] = useState(false);

  useEffect(() => {
    if (editorRef.current && !isInitialized) {
      editorRef.current.innerHTML = value || '';
      setIsInitialized(true);
    }
  }, [value, isInitialized]);

  const handleInput = () => {
    const newContent = editorRef.current.innerHTML;
    onChange(newContent);
  };

  const execCommand = (command, cmdValue = null) => {
    editorRef.current.focus();
    document.execCommand(command, false, cmdValue);
  };

  const handleBold = () => execCommand('bold');
  const handleItalic = () => execCommand('italic');
  const handleUnderline = () => execCommand('underline');
  const handleBulletList = () => execCommand('insertUnorderedList');
  const handleNumberedList = () => execCommand('insertOrderedList');
  const handleClear = () => {
    execCommand('removeFormat');
    execCommand('formatBlock', 'div');
  };

  return (
    <div className="glass-card rounded-2xl border border-gray-700/30 overflow-hidden relative hover-lift">
      <WritingToolbar
        onBold={handleBold}
        onItalic={handleItalic}
        onUnderline={handleUnderline}
        onBulletList={handleBulletList}
        onNumberedList={handleNumberedList}
        onClear={handleClear}
      />
      <div
        ref={editorRef}
        contentEditable
        onInput={handleInput}
        className="bg-gray-900/50 text-gray-200 p-4 min-h-[400px] focus:outline-none focus:ring-2 focus:ring-blue-500/50 focus:border-transparent rounded-b-xl"
        style={{ minHeight: height }}
        suppressContentEditableWarning={true}
      />
      {!editorRef.current?.innerHTML && (
        <div 
          className="absolute top-16 left-4 text-gray-500/70 pointer-events-none italic"
        >
          {placeholder}
        </div>
      )}
    </div>
  );
};

export default RichTextEditor;
