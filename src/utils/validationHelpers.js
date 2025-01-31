
exports.hasForbiddenChars = (value)=>{
    // You can add more substrings if needed (e.g., 'onload', 'javascript:', etc.)
    // const forbiddenPattern = /<|>|&lt;|&gt;|script|iframe/gi;
    const forbiddenPattern = /<|>|&lt;|&gt;|script|iframe|onerror|onload|javascript:/gi;
    return forbiddenPattern.test(value);
}

// /^[A-Za-z0-9._,<,>,&,\/,\\,\[,\].\{,\}]+$/gi