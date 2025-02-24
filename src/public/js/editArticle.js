document.addEventListener('DOMContentLoaded', function () {
    // Проверка дали Quill е инициализиран
    if (window.quill) {
        // 👉 Поставяне на предварително заредено съдържание
        var editorContainer = document.querySelector('#editor-container .ql-editor');
        editorContainer.innerHTML = window.preloadedContent;
    }

    // Обновяване на скритото поле преди подаване на формата
    var form = document.querySelector('form');
    form.onsubmit = function () {
        var articleContent = document.querySelector('#articleContent');
        articleContent.value = quill.root.innerHTML;
    };
});

// 👉 Зареждане на съдържанието като глобална JS променлива
window.preloadedContent = window.preloadedContent || '';
