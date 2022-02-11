import hljs from 'highlight.js/lib/core';
import xmlHljs from 'highlight.js/lib/languages/xml';

hljs.registerLanguage('xml', xmlHljs);

// Highlights code snippets
hljs.highlightAll();
