if (!Object.entries)
    Object.entries = function (obj) {
        var ownProps = Object.keys(obj),
            i = ownProps.length,
            resArray = new Array(i); // preallocate the Array
        while (i--)
            resArray[i] = [ownProps[i], obj[ownProps[i]]];

        return resArray;
    };

$(document).ready(function () {
    $('.popup').magnificPopup({
        tClose: 'Закрыть',
        type: 'inline',
        callbacks: {
            open: function () {
                const magnificPopup = $.magnificPopup.instance;
                const content = magnificPopup.content;
                const triggerEl = magnificPopup.ev;
                let bg = triggerEl.css('background-image').replace('url(', '').replace(')', '').replace(/\"/gi, "");
                content.css({'background-image': 'url(' + bg + ')'})
            }
        },
    });
    $(document).on('click', '.modal-close', function () {
        $.magnificPopup.close()
    })
    $(document).on('click', '[data-hide-menu]', function () {
        hideMenuHandler($(this))
    })
    formHandler($('form'))
});

function hideMenuHandler($hideBtn) {
    const $parent = $hideBtn.closest('.c-nav-menu')
    const isHidden = $parent.hasClass('c-nav-menu_hidden')
    console.log(isHidden)
    if (isHidden) {
        $parent.removeClass('c-nav-menu_hidden')
    } else {
        $parent.addClass('c-nav-menu_hidden')
    }
}

function getFormData(el) {
    let data = {};
    let inputs = el.querySelectorAll('input, select, textarea');
    for (let i = 0; i < inputs.length; i++) {
        if (inputs[i].name != 'undefined' && inputs[i].name != '' && inputs[i].name) {
            if (['checkbox', 'radio'].indexOf(inputs[i].type) > -1) {
                if (inputs[i].checked) {
                    data[inputs[i].name] = inputs[i].value;
                }
            } else {
                data[inputs[i].name] = inputs[i].value;
            }
        }
    }
    return data;
}

class renderResponseMessage {
    constructor(displayContainer, styleParams = {
        default: '',
        success: '',
        error: '',
        warning: '',
        text: ''
    }) {
        this.displayContainer = displayContainer;
        this.styleParams = styleParams;
        this.removeDelay = 3000
    }

    render($message, $messageContainer, messageText) {
        $message.html(messageText);
        $messageContainer.append($message)
        this.displayContainer.append($messageContainer)
        setTimeout(function () {
            $messageContainer.remove()
        }, this.removeDelay)
    }

    renderSuccess(messageText) {
        const $message = $('<div>', {
            class: `${this.styleParams.text}`
        });
        const $messageContainer = $('<div>', {
            class: `${this.styleParams.default} ${this.styleParams.success}`
        })
        this.render($message, $messageContainer, messageText)
    }

    renderError(messageText) {
        const $message = $('<div>', {
            class: `${this.styleParams.text}`
        });
        const $messageContainer = $('<div>', {
            class: `${this.styleParams.default} ${this.styleParams.error}`
        })
        this.render($message, $messageContainer, messageText)
    }

    renderWarning(messageText) {
        const $message = $('<div>', {
            class: `${this.styleParams.text}`
        });
        const $messageContainer = $('<div>', {
            class: `${this.styleParams.default} ${this.styleParams.warning}`
        })
        this.render($message, $messageContainer, messageText)
    }
}

function formHandler($form, parameters = {}) {
    const params = {
        errorMessage: parameters.errorMessage || false,
        successMessage: parameters.successMessage || false,
        beforeRequest: parameters.beforeRequest || function () {
            console.log('before')
        },
        onSuccess: parameters.onSuccess || function () {
            console.log('success')
        },
        onError: parameters.onError || function () {
            console.log('error')
        },
        afterRequest: parameters.afterRequest || function () {
            console.log('after')
        }
    }
    $form.on('submit', function (e) {
        e.preventDefault()
        const $target = $(e.target)
        const data = getFormData(e.target)
        const url = $target.attr('action')
        const method = $target.attr('method')
        const submit = $form.find('[type="submit"]')
        const renderMess = new renderResponseMessage($form.find('.c-form__header'), {
            default: 'c-alert',
            success: 'c-alert_success',
            error: 'c-alert_error',
            warning: 'c-alert_warning',
            text: 'c-title c-title_md text-center mb-0'
        })
        submit.attr('disabled', true)
        params.beforeRequest()
        $.ajax({
            url,
            method,
            data
        }).done(function () {
            $form.get(0).reset()
            submit.attr('disabled', false)
            let message;
            if (params.successMessage) {
                message = params.successMessage
            } else {
                message = 'Форма успешно отправлена'
            }
            renderMess.renderSuccess(message)
            params.onSuccess()
        }).fail(function (XMLHttpRequest, textStatus, errorThrown) {
            renderMess.renderError('что-то пошло не так')
        }).always(function () {
            params.afterRequest()
        })
    })
}


