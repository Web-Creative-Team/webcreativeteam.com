document.addEventListener('DOMContentLoaded', function () {
    // Check if the Quill editor container exists on the page
    var editorContainer = document.querySelector('#editor-container');
    if (editorContainer) {
        // 👉 Import and Override Size Class
        var SizeClass = Quill.import('attributors/class/size');
        SizeClass.whitelist = ['small', 'normal', 'large', 'huge'];
        Quill.register(SizeClass, true);

        // 👉 Import and Override Align Class to Use Classes Instead of Inline Styles
        var AlignClass = Quill.import('attributors/class/align');
        Quill.register(AlignClass, true);

        // 👉 Initialize Quill with enhanced toolbar options
        window.quill = new Quill('#editor-container', {
            theme: 'snow',
            modules: {
                toolbar: [
                    [{ font: [] }],  // Font family
                    [{ size: ['small', 'normal', 'large', 'huge'] }],  // Custom size options
                    [{ header: [1, 2, 3, 4, 5, 6, false] }],  // Headings
                    ['bold', 'italic', 'underline', 'strike'],  // Text styles
                    [{ color: [] }, { background: [] }],  // Text color and background color
                    [{ script: 'sub' }, { script: 'super' }],  // Subscript / Superscript
                    [{ list: 'ordered' }, { list: 'bullet' }],  // Lists
                    [{ align: [] }],  // Justify text options
                    ['link', 'image', 'code-block'],  // Links, images, and code blocks
                    ['clean']  // Clear formatting
                ]
            },
            placeholder: 'Моля въведете съдържанието на статията тук...'  // Friendly placeholder
        });

        // 👉 Force Quill to Save Classes in HTML
        quill.on('text-change', function () {
            // Fix for Font Size
            var allSpans = document.querySelectorAll('.ql-editor span[style*="font-size"]');
            allSpans.forEach(function (span) {
                var fontSize = span.style.fontSize;
                span.classList.remove('ql-size-small', 'ql-size-normal', 'ql-size-large', 'ql-size-huge');
        
                if (fontSize === '12px') {
                    span.classList.add('ql-size-small');
                } else if (fontSize === '16px') {
                    span.classList.add('ql-size-normal');
                } else if (fontSize === '24px') {
                    span.classList.add('ql-size-large');
                } else if (fontSize === '32px') {
                    span.classList.add('ql-size-huge');
                }
        
                span.removeAttribute('style');
            });
        
            // Fix for Text Alignment
            var allBlocks = document.querySelectorAll('.ql-editor div[style*="text-align"]');
            allBlocks.forEach(function (block) {
                var textAlign = block.style.textAlign;
                block.classList.remove('ql-align-left', 'ql-align-center', 'ql-align-right', 'ql-align-justify');
        
                if (textAlign === 'center') {
                    block.classList.add('ql-align-center');
                } else if (textAlign === 'right') {
                    block.classList.add('ql-align-right');
                } else if (textAlign === 'justify') {
                    block.classList.add('ql-align-justify');
                } else {
                    block.classList.add('ql-align-left');
                }
        
                block.removeAttribute('style');
            });
        
            // Update hidden input to include the modified content
            var articleContent = document.querySelector('#articleContent');
            articleContent.value = quill.root.innerHTML;
        });

        // 👉 Check if preloaded content is available
        if (window.preloadedContent) {
            // 👉 Inject the content after Quill is fully initialized
            quill.clipboard.dangerouslyPasteHTML(window.preloadedContent);
        }
    }
});
