document.addEventListener('DOMContentLoaded', function () {
    var editorContainer = document.querySelector('#editor-container');
    if (editorContainer) {
        // 👉 Initialize Quill with enhanced toolbar options
        window.quill = new Quill('#editor-container', {
            theme: 'snow',
            modules: {
                toolbar: [
                    [{ font: [] }],
                    [{ size: ['small', 'normal', 'large', 'huge'] }],
                    [{ header: [1, 2, 3, 4, 5, 6, false] }],
                    ['bold', 'italic', 'underline', 'strike'],
                    [{ color: [] }, { background: [] }],
                    [{ script: 'sub' }, { script: 'super' }],
                    [{ list: 'ordered' }, { list: 'bullet' }],
                    [{ align: [] }],
                    ['link', 'image', 'code-block'],
                    ['clean']
                ]
            },
            placeholder: 'Моля въведете съдържанието на статията тук...'
        });

        // 👉 Update hidden input before form submission
        var form = document.querySelector('form');
        form.onsubmit = function () {
            var articleContent = document.querySelector('#articleContent');
            articleContent.value = quill.root.innerHTML;
        };
    }
});
