import React, { useEffect, useRef } from 'react';
import Quill from 'quill';
import 'quill/dist/quill.snow.css'; // or 'quill.bubble.css'

const QuillEditorInput = ({ value, onChange,label,readOnly }) => {
  const editorRef = useRef(null);
  const quillRef = useRef(null);
  useEffect(() => {
    if (editorRef.current && !quillRef.current) {
      quillRef.current = new Quill(editorRef.current, {
        theme: 'snow',
        placeholder: `Enter your text`,
        readOnly,
        modules: {
          toolbar: [
            [{ header: [1, 2, 3, false] }],
            ['bold', 'italic', 'underline', 'strike'],
            [{ list: 'ordered' }, { list: 'bullet' }],
            ['link', 'image', 'code-block'],
            ['clean'],
          ],
        },
      });

      // Initialize with existing value
      if (value) {
        quillRef.current.root.innerHTML = value;
      }

      // Listen for text changes
      quillRef.current.on('text-change', () => {
        const html = quillRef.current.root.innerHTML;
        if (onChange) onChange(html);
      });
    }
  }, [value, onChange]);

  return <div ref={editorRef} style={{ minHeight: '200px' }} />;
};

export default QuillEditorInput;
