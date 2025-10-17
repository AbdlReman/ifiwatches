/**
 * Process embedded Markdown syntax within HTML content from Contentful
 * This handles cases where Markdown syntax was entered directly into rich text fields
 */

export const processEmbeddedMarkdown = (htmlContent) => {
  if (!htmlContent || typeof htmlContent !== 'string') {
    return htmlContent;
  }

  let processedContent = htmlContent;

  // Step 1: Handle headings first (most specific patterns)
  // Handle ##**Heading** pattern (no space after ##)
  processedContent = processedContent.replace(/##\*\*(.*?)\*\*/g, '<h2>$1</h2>');
  
  // Handle ## **Heading** pattern (space after ##)
  processedContent = processedContent.replace(/## \*\*(.*?)\*\*/g, '<h2>$1</h2>');
  
  // Handle ###**Heading** pattern (no space after ###)
  processedContent = processedContent.replace(/###\*\*(.*?)\*\*/g, '<h3>$1</h3>');
  
  // Handle ### **Heading** pattern (space after ###)
  processedContent = processedContent.replace(/### \*\*(.*?)\*\*/g, '<h3>$1</h3>');
  
  // Handle ####**Heading** pattern
  processedContent = processedContent.replace(/####\*\*(.*?)\*\*/g, '<h4>$1</h4>');
  
  // Handle #### **Heading** pattern (space after ####)
  processedContent = processedContent.replace(/#### \*\*(.*?)\*\*/g, '<h4>$1</h4>');

  // Step 2: Handle bold text (but avoid interfering with already processed headings)
  // Use a more careful approach to avoid double-processing
  processedContent = processedContent.replace(/\*\*(.*?)\*\*/g, (match, content) => {
    // If this looks like it was part of a heading pattern, skip it
    if (content.includes('##') || content.includes('###') || content.includes('####')) {
      return match;
    }
    return `<strong>${content}</strong>`;
  });

  // Step 3: Handle italic text (but avoid interfering with bold patterns)
  processedContent = processedContent.replace(/\*(?!\*)(.*?)(?<!\*)\*/g, '<em>$1</em>');
  
  // Step 3.1: Handle underscore formatting
  processedContent = processedContent.replace(/__(.*?)__/g, '<strong>$1</strong>');
  processedContent = processedContent.replace(/_(.*?)_/g, '<em>$1</em>');

  // Step 4: Handle lists
  // Convert - item to <li>item</li>
  processedContent = processedContent.replace(/^- (.+)$/gm, '<li>$1</li>');
  // Wrap consecutive <li> elements in <ul>
  processedContent = processedContent.replace(/(<li>.*<\/li>)+/gs, (match) => {
    return `<ul>${match}</ul>`;
  });

  // Step 5: Handle paragraphs - split by double line breaks or heading patterns
  // First, let's split the content by heading patterns to preserve structure
  const parts = processedContent.split(/(<h[1-6]>.*?<\/h[1-6]>)/);
  
  processedContent = parts.map(part => {
    part = part.trim();
    if (part && !part.startsWith('<h') && !part.startsWith('<ul') && !part.startsWith('<li') && !part.startsWith('<strong>') && !part.startsWith('<em>')) {
      // Split by double line breaks for paragraph separation
      const paragraphs = part.split(/\n\s*\n/);
      return paragraphs.map(p => p.trim()).filter(p => p).map(p => `<p>${p}</p>`).join('\n');
    }
    return part;
  }).join('\n');

  // Step 6: Clean up extra spaces and formatting issues
  processedContent = processedContent.replace(/\s+/g, ' ').trim();
  processedContent = processedContent.replace(/>\s+</g, '><');
  processedContent = processedContent.replace(/\s+</g, '<');
  processedContent = processedContent.replace(/>\s+/g, '>');

  // Step 7: Handle specific problematic patterns before cleanup
  // Handle patterns like "*__Product Details:" or "*__" at the beginning of lines
  processedContent = processedContent.replace(/^\*\*__\s*/gm, ''); // Remove "*__" at start of lines
  processedContent = processedContent.replace(/^\*__\s*/gm, ''); // Remove "*__" at start of lines
  processedContent = processedContent.replace(/^\*\*\s*/gm, ''); // Remove "**" at start of lines
  processedContent = processedContent.replace(/^\*__\s*/gm, ''); // Remove "*__" at start of lines
  
  // Handle standalone markdown symbols that don't form proper patterns
  processedContent = processedContent.replace(/\s*\*__\s*/g, ' '); // Remove standalone "*__" with spaces
  processedContent = processedContent.replace(/\s*__\*\s*/g, ' '); // Remove standalone "__*" with spaces
  
  // Step 8: Remove any remaining literal Markdown syntax that wasn't converted
  processedContent = processedContent.replace(/##\*\*/g, '');
  processedContent = processedContent.replace(/\*\*##/g, '');
  processedContent = processedContent.replace(/###\*\*/g, '');
  processedContent = processedContent.replace(/\*\*###/g, '');
  processedContent = processedContent.replace(/\*\*\*\*/g, '');
  processedContent = processedContent.replace(/## \*\*/g, '');
  processedContent = processedContent.replace(/\*\* ##/g, '');
  processedContent = processedContent.replace(/### \*\*/g, '');
  processedContent = processedContent.replace(/\*\* ###/g, '');
  processedContent = processedContent.replace(/\*__/g, ''); // Remove any remaining "*__" patterns
  processedContent = processedContent.replace(/__\*/g, ''); // Remove any remaining "__*" patterns

  return processedContent;
};

/**
 * Enhanced processor specifically for Contentful rich text issues
 */
export const processContentfulRichText = (richTextField) => {
  if (!richTextField) {
    return "";
  }

  let content = "";

  // If it's already a string, process it directly
  if (typeof richTextField === 'string') {
    content = richTextField;
  }
  // If it's a rich text object, extract the text content
  else if (richTextField.content && Array.isArray(richTextField.content)) {
    content = extractTextFromRichText(richTextField);
  }
  // If it's an object, try to stringify it
  else if (typeof richTextField === 'object') {
    content = JSON.stringify(richTextField);
  }
  
  // Debug logging (remove in production)
  if (process.env.NODE_ENV === 'development') {
    console.log('Original Contentful content:', content);
  }
  
  // Process the content for embedded Markdown
  const processedContent = processEmbeddedMarkdown(content);
  
  // Debug logging (remove in production)
  if (process.env.NODE_ENV === 'development') {
    console.log('Processed content:', processedContent);
  }
  
  return processedContent;
};

/**
 * Extract plain text from Contentful rich text object
 */
const extractTextFromRichText = (richTextObject) => {
  if (!richTextObject.content) return "";

  let text = "";
  
  const processNode = (node) => {
    if (node.nodeType === 'text' && node.value) {
      text += node.value;
    } else if (node.content && Array.isArray(node.content)) {
      node.content.forEach(processNode);
    }
  };

  richTextObject.content.forEach(processNode);
  return text;
};
