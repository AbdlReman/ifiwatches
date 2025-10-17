import React, { useState } from 'react';
import { processContentfulRichText } from '../../helpers/markdownProcessor';

const MarkdownTester = () => {
  const [inputText, setInputText] = useState('*__Product Details:**\n\n**Brand:** Hublot\n**Movement:** Quartz\n**Dial Size:** 40mm\n\n*__Features:**\n- Water resistant\n- Premium materials\n\n##**Technical Specifications:**\n\n###**Case:**\n- Material: Stainless steel\n- Size: 40mm');
  const [outputHtml, setOutputHtml] = useState('');

  const processText = () => {
    const result = processContentfulRichText(inputText);
    setOutputHtml(result);
  };

  return (
    <div style={{ padding: '20px', maxWidth: '800px', margin: '0 auto' }}>
      <h2>Markdown Processor Tester</h2>
      
      <div style={{ marginBottom: '20px' }}>
        <h3>Input Text (Contentful Rich Text):</h3>
        <textarea
          value={inputText}
          onChange={(e) => setInputText(e.target.value)}
          style={{
            width: '100%',
            height: '200px',
            padding: '10px',
            border: '1px solid #ccc',
            borderRadius: '4px',
            fontFamily: 'monospace',
            fontSize: '12px'
          }}
        />
        <button 
          onClick={processText}
          style={{
            marginTop: '10px',
            padding: '8px 16px',
            backgroundColor: '#007bff',
            color: 'white',
            border: 'none',
            borderRadius: '4px',
            cursor: 'pointer'
          }}
        >
          Process Text
        </button>
      </div>

      <div style={{ marginBottom: '20px' }}>
        <h3>Generated HTML:</h3>
        <pre
          style={{
            backgroundColor: '#f8f9fa',
            padding: '10px',
            border: '1px solid #ccc',
            borderRadius: '4px',
            overflow: 'auto',
            fontSize: '12px'
          }}
        >
          {outputHtml}
        </pre>
      </div>

      <div>
        <h3>Rendered Output:</h3>
        <div
          className="rich-text-content"
          style={{
            border: '1px solid #ccc',
            padding: '15px',
            borderRadius: '4px',
            backgroundColor: 'white'
          }}
          dangerouslySetInnerHTML={{ __html: outputHtml }}
        />
      </div>
    </div>
  );
};

export default MarkdownTester;
