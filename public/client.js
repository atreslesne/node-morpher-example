$(function($, window, document) {
    $.fn.morpher = function(parameters) {
        $(this).each(function () {
            var
                settings = ($.isPlainObject(parameters)) ? $.extend(true, {}, $.fn.morpher.settings, parameters) : $.extend({}, $.fn.morpher.settings),

                $module  = $(this),
                element  = this,

                form     = {
                    input: $module.find('.morpher-form input'),
                    button: $module.find('.morpher-form button')
                },
                terminal = $module.find('.morpher-response'),
                uri      = $module.data('uri'),
                method   = $module.data('method');

            if (method.split(' ').length > 1) method = method.split(' ');

            function clearForm() {
                form.input.val('');
                term();
            }

            function term(value) {
                var values = terminal.html().split('<br>').slice(0, -1);
                if (!value) values = [];
                terminal[0].innerHTML = values.join('<br>') + (values.length ? '<br>' : '') + (value ? value + '<br>' : '') + '> <i>&nbsp;</i>';
            }

            form.input.keyup(function (e) {
                if (e.keyCode == 13) form.button.trigger('click');
            });

            form.button.click(function () {
                if (form.input.val()) {
                    var request = { data: form.input.val() };
                    clearForm();

                    if (typeof method == 'string') {
                        term('> morpher.' + method + '("' + request.data + '")');
                    } else {
                        var a = request.data.split(' ');
                        term('> morpher.' + method[0] + '("' + a.join('", "') + '")');
                        request.data = a;
                    }

                    $.ajax({
                        url: uri,
                        type: 'POST',
                        data: JSON.stringify(request),
                        contentType: 'application/json',
                        success: function (response) {
                            if (response.error) {
                                term('<span style="color:red">Ошибка: ' + response.error + '</span>');
                            } else {
                                response.result.forEach(function (el) {
                                    term(el['field'] + ': <strong>' + el['value'] + '</strong>');
                                });
                            }
                        }
                    });
                }
            });

            clearForm();
        });
    };
}(jQuery, window, document));
