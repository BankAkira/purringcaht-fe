import React, { useEffect, useRef } from 'react';
import Quill from 'quill';
import 'quill/dist/quill.snow.css'; // Import Quill's CSS for styling

interface QuillEditorProps {
  value: string;
  onChange: (content: string) => void;
}

const QuillEditor: React.FC<QuillEditorProps> = ({ value, onChange }) => {
  const editorRef = useRef<HTMLDivElement | null>(null);
  const quillInstanceRef = useRef<Quill | null>(null);
  const handleChangeRef = useRef<() => void>();

  useEffect(() => {
    if (!editorRef.current) return;

    // Initialize Quill editor
    quillInstanceRef.current = new Quill(editorRef.current, {
      theme: 'snow',
      modules: {
        toolbar: [
          [{ font: [] }, { size: [] }],
          ['bold', 'italic', 'underline', 'strike'],
          [{ color: [] }, { background: [] }],
          [{ script: 'sub' }, { script: 'super' }],
          [{ list: 'ordered' }, { list: 'bullet' }],
          [{ align: [] }],
          ['link', 'image'],
        ],
      },
    });

    // Define the event handler
    const handleChange = () => {
      const editorContent = quillInstanceRef.current?.root.innerHTML || '';
      onChange(editorContent);
    };

    // Store a reference to the handler for cleanup
    handleChangeRef.current = handleChange;

    // Attach the event listener
    quillInstanceRef.current.on('text-change', handleChange);

    // Add link detection when typing or pasting
    quillInstanceRef.current.clipboard.addMatcher(
      Node.TEXT_NODE,
      (node, delta) => {
        const text = node.data;
        const urlRegex = /((https?:\/\/|www\.)[^\s]+)/g;

        if (urlRegex.test(text)) {
          const ops = [];
          let lastIndex = 0;

          text.replace(urlRegex, (url: string, offset: number) => {
            // Add the text before the URL
            if (offset > lastIndex) {
              ops.push({ insert: text.slice(lastIndex, offset) });
            }

            // Ensure the URL starts with "http://" or "https://"
            if (!/^https?:\/\//.test(url)) {
              url = 'http://' + url;
            }

            // Insert the URL as a clickable link with blue color
            ops.push({
              insert: url,
              attributes: {
                link: url,
                color: 'blue', // Set the link color to blue
              },
            });
            lastIndex = offset + url.length;
          });

          // Add the rest of the text
          if (lastIndex < text.length) {
            ops.push({ insert: text.slice(lastIndex) });
          }

          delta.ops = ops;
        }

        return delta;
      }
    );

    // Cleanup on component unmount
    return () => {
      if (quillInstanceRef.current && handleChangeRef.current) {
        quillInstanceRef.current.off('text-change', handleChangeRef.current);
        quillInstanceRef.current = null;
      }
    };
  }, [onChange]);

  // Update the content of the editor when the value prop changes
  useEffect(() => {
    if (
      quillInstanceRef.current &&
      quillInstanceRef.current.root.innerHTML !== value
    ) {
      quillInstanceRef.current.root.innerHTML = value;
    }
  }, [value]);

  return (
    <div
      ref={editorRef}
      style={{
        minHeight: '200px',
        maxHeight: '60vh',
        overflow: 'auto',
      }}
    />
  );
};

export default QuillEditor;
