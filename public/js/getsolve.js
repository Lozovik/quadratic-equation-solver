$(function () {

    //$.getJSON('parametres', updateReport);

    $('#paramEqua').submit(function (e) {
        e.preventDefault();
        $.post('parametres', {
            a: $('#a').val(),
            b: $('#b').val(),
            c: $('#c').val(),
        }, updateReport);
    });

    function updateReport(data) {
        var output = "";
        $('#reportsolve').replaceWith('<div id="reportsolve"> </div>');
        $('#btnpdf').replaceWith('<div id="btnpdf"> </div>');

        output = `
        <p>
            `+ data.report +`
        </p>
        `
        $('#reportsolve').append(output);
        MathJax.Hub.Queue(["Typeset", MathJax.Hub]);
    }


    $('#pdfForm').submit(function (e) {
        e.preventDefault();
        $.post('pdfreport', {
            reporthtml: $('#reportsolve').html(),
        });
    });



   


/*
function updateReport(data) {
    var output = "";

    $('#some_modal').replaceWith('<div id="some_modal" class="ui modal"></div>');
    output = `
        <div id="some_modal" class="ui modal">
        <i class="close icon"></i>
        <div class="header">
            Analytical Solve
        </div>
        <div class="image content">
            <div class="ui medium image">
            `+ data.report + `
            </div>
        </div>
        <div class="actions">
            <div class="ui positive right labeled icon button">
            Print to PDF
            <i class="checkmark icon"></i>
            </div>
        </div>
        </div>
    `
    $('#some_modal').replaceWith(output);
    MathJax.Hub.Queue(["Typeset", MathJax.Hub]);
    $('.ui.modal').modal('show');
}
*/

});