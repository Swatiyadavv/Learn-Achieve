module.exports = function convertToHTML(text) {
  if (!text) return "";
  
  // Escape HTML special characters
  let safe = text
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;");

  // Replace double line breaks with </p><p>
  safe = safe.replace(/\r?\n\r?\n/g, "</p><p>");

  // Replace single line breaks with <br>
  safe = safe.replace(/\r?\n/g, "<br>");

  // Wrap the entire thing in <p>...</p>
  return `<p>${safe}</p>`;
};
