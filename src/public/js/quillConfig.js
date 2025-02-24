document.addEventListener('DOMContentLoaded', function () {
    // Check if the Quill editor container exists on the page
    var editorContainer = document.querySelector('#editor-container');
    if (editorContainer) {
        // 👉 Register the necessary alignment and style modules
        var AlignStyle = Quill.import('attributors/style/align');
        var DirectionStyle = Quill.import('attributors/style/direction');
        Quill.register(AlignStyle, true);
        Quill.register(DirectionStyle, true);

        // 👉 Initialize Quill with enhanced toolbar options
        window.quill = new Quill('#editor-container', {
            theme: 'snow',
            modules: {
                toolbar: [
                    [{ font: [] }],  // Font family
                    [{ size: ['small', false, 'large', 'huge'] }],  // Font size
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
            placeholder: 'Въведете съдържанието на статията тук...'  // Friendly placeholder
        });

        // 👉 Check if preloaded content is available
        if (window.preloadedContent) {
            // 👉 Inject the content after Quill is fully initialized
            quill.clipboard.dangerouslyPasteHTML(window.preloadedContent);
        }
    }
});