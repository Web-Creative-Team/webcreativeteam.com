
exports.hasForbiddenChars = (value)=>{
    // You can add more substrings if needed (e.g., 'onload', 'javascript:', etc.)
    const forbiddenPattern = /<|>|&lt;|&gt;|script|iframe/gi;
    return forbiddenPattern.test(value);
}

