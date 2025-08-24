import { documentToHtmlString } from "@contentful/rich-text-html-renderer";
import { processContentfulRichText } from "./markdownProcessor";

/**
 * Process Contentful rich text field and convert it to HTML string
 * @param {Object|string} richTextField - The rich text field from Contentful
 * @returns {string} - HTML string representation of the rich text
 */
export const processRichText = (richTextField) => {
  if (!richTextField) {
    return "";
  }

  // Use the enhanced Markdown processor for better handling of embedded Markdown
  return processContentfulRichText(richTextField);
};

/**
 * Process Contentful product data and ensure consistent structure
 * @param {Object} item - Contentful item
 * @returns {Object} - Processed product object
 */
export const processContentfulProduct = (item) => {
  const fields = item.fields;
  
  return {
    id: item.sys.id,
    name: fields.name || "Product",
    slug: fields.slug,
    price: parseFloat(fields.price) || 0,
    discount: parseFloat(fields.discount) || 0,
    giftBoxPrice: parseFloat(fields.giftBoxPrice) || 0,
    shortDescription: fields.shortDescription || "",
    fullDescription: processRichText(fields.fullDescription),
    video: (() => {
      const videoField = fields.video;
      
      if (!videoField) return null;
      
      // If it's a string, return it directly
      if (typeof videoField === 'string') {
        return videoField.trim();
      }
      
      // If it's an object, try to extract URL
      if (typeof videoField === 'object') {
        // Check for common Contentful asset fields
        if (videoField.fields && videoField.fields.file) {
          return videoField.fields.file.url;
        }
        // Check for direct URL properties
        if (videoField.url) return videoField.url;
        if (videoField.src) return videoField.src;
        if (videoField.link) return videoField.link;
      }
      
      return null;
    })(), // Add video field
    category: fields.category || [],
    tag: fields.tag || [],
    images: fields.images?.map(img => img.fields.file.url) || [],
    color: fields.color || [],
    size: fields.size || [],
    metaTitle: fields.metaTitle || fields.name || "Product",
    metaDescription: fields.metaDescription || fields.shortDescription || "",
    stock: fields.stock || 0,
    // For backward compatibility with existing components
    image: fields.images?.[0]?.fields?.file?.url,
    title: fields.name || "Product",
    description: fields.shortDescription || "",
    // Add variation structure if colors exist
    variation: fields.color && fields.color.length > 0 ? 
      fields.color.map(color => ({
        color: color
      })) : null
  };
};
