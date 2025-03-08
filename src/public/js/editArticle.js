document.addEventListener('DOMContentLoaded', function () {
    if (window.quill) {
        var editorContainer = document.querySelector('#editor-container .ql-editor');
        editorContainer.innerHTML = window.preloadedContent;
    }

    var form = document.querySelector('form');
    form.onsubmit = function () {
        var articleContent = document.querySelector('#articleContent');
        articleContent.value = quill.root.innerHTML;
    };
});