function requestLogin() {
    let username = $('#loginUsername').val();
    let password = $('#loginPassword').val();

    if(username.length === 0 || password.length === 0) {
        toastr["error"]("Tutti i campi sono obbligatori", "Attenzione");
        return;
    }

    let dataReq = JSON.stringify({
        password: password
    });

    //Se siamo arrivati fin qui tutto ok. Facciamo una richiesta POST per registrare il nostro utente.

    $.ajax({
        async: true,
        url: `auth/${username}`,
        method: 'POST',
        data: dataReq,
        dataType: 'json',
        contentType: "application/json",
        success: function (data) {

        },
        error: function (data, status, error) {
            switch (data.status) {
                case 403:
                    toastr["error"]("Autenticazione fallita. Riprovare", "Attenzione");
                    break;
                default:
                    toastr["error"]("Errore di sistema, contattare assistenza.", "Attenzione");
                    break;
            }
        }
    });

}
/*
function showModalRegister() {
    $('#registerUsername').val('');
    $('#registerEmail').val('');
    $('#registerFirstName').val('');
    $('#registerLastName').val('');
    $('#registerPassword').val('');
    $('#confirmPassword').val('');
    $('#modalRegistrazione').modal('show');
}
 */

/*
function registerUser() {
    let username = $('#registerUsername').val();
    let email = $('#registerEmail').val();
    let firstname = $('#registerFirstName').val();
    let lastname = $('#registerLastName').val();
    let password = $('#registerPassword').val();
    let passwordConfirm = $('#confirmPassword').val();

    username = username.trim();
    email = email.trim();
    firstname = firstname.trim();
    lastname = lastname.trim();
    password = password.trim();
    passwordConfirm = passwordConfirm.trim();

    if (username.length === 0 || email.length === 0 || firstname.length === 0 || lastname.length === 0 || password.length === 0) {
        toastr["error"]("Tutti i campi solo obbligatori", "Attenzione");
        return;
    }

    if (password !== passwordConfirm) {
        toastr["error"]("Le password inserite non coincidono", "Attenzione");
        return;
    }

    if (password.length < 8) {
        toastr["error"]("La password inserita è troppo breve", "Attenzione");
        return;
    }

    let dataReq = JSON.stringify({
        user: {
            username: username,
            email: email,
            firstname: firstname,
            lastname: lastname,
            password: password
        }
    });

    //Se siamo arrivati fin qui tutto ok. Facciamo una richiesta POST per registrare il nostro utente.

    $.ajax({
        async: true,
        url: 'user/',
        method: 'POST',
        data: dataReq,
        dataType: 'json',
        contentType: "application/json",
        success: function (data) {
            toastr["success"]("Utente registrato fare login.");
            $('#modalRegistrazione').modal('hide');
        },
        error: function (data, status, error) {
            switch (data.responseJSON.req_error) {
                case -1:
                    toastr["error"]("Username già usato, sceglierne un altro.", "Attenzione");
                    break;
                case -102:
                    toastr["error"]("Email non valida.", "Attenzione");
                    break;
                default:
                    toastr["error"]("Errore nella richiesta al server. Riprovare.", "Attenzione");
                    break;
            }

        }
    });
}
 */

/*
function showModalRecuperaAccount() {
    //TODO IMPLEMENT THIS
    toastr["error"]("Funzione ancora non implementata");
}

 */