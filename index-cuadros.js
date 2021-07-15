var app = {

    backend: 'http://localhost:8081/api/tiendas/cuadros',
    table: null,

    init: function () {
        app.initDatatable('#cuadros');


        $('#save').click(function () {

            var idCuadro = $('#idCuadro').val();
            var nombreCuadro = $('#nombreCuadro').val();
            var autor = $('#autor').val();
            var precio = $('#precio').val();

            console.log("Actualizando")
            app.update({
                idCuadro, nombreCuadro, autor, precio
            });
        });
    },

    initDatatable: function (id) {
        app.table = $(id).DataTable({
            ajax: {
                url: app.backend + '',
                dataSrc: function (json) {
                    return json;
                }
            },
            dom: 'Bfrtip',
            columns: [
                { data: "idCuadro"},
                { data: "nombreCuadro"},
                { data: "autor"},
                { data: "precio"},
                { data: "fechaCreacion"}
            ],
            buttons: [

                {
                    text: 'Editar',
                    action: function (evento, datatable, node, config) {

                        var data = datatable.rows('.table-active').data()[0]; //obtenemos el registro seleccionado (ensombrecido, gracias a .table-active)
                        console.log(data);

                        app.setDataToModal(data);

                        $('#cuadroModal').modal();
                    }
                },
                {
                    text: 'Eliminar',
                    action: function (evento, datatable, node, config) {

                        var data = datatable.rows('.table-active').data()[0];
                        console.log(data);

                        if (confirm('¿Estás seguro de eliminar el cuadro?')) {
                            app.delete(data.idCuadro);
                            app.table.ajax.reload();
                        }

                    }
                }
            ]
        });

        $('#cuadros tbody').on('click', 'tr', function () {  //el botón se quedá ensombrecido, como seleccionado
            if ($(this).hasClass('table-active')) {
                $(this).removeClass('table-active')
            } else {
                app.table.$('tr.table-active').removeClass('table-active')
                $(this).addClass('table-active');
            }
        });
    },

    setDataToModal: function (data) { //para que la modal recoja los datos de la table y los escriba
        $('#idCuadro').val(data.idCuadro);
        $('#nombreCuadro').val(data.nombreCuadro);
        $('#autor').val(data.autor);
        $('#precio').val(data.precio);
    },

    cleanForm: function () {
        $('#idCuadro').val('');
        $('#nombreCuadro').val('');
        $('#autor').val('');
        $('#precio').val('');
    },

    //FUNCIONES CRUD

    update: function (data) {
        var id = parseInt(data.idCuadro);
        $.ajax({
            url: app.backend + '/' + idCuadro,
            data: JSON.stringify(data),
            method: 'PUT',
            dataType: 'json',
            contentType: "application/json; charset=UTF-8",

            success: function (json) {
                $("#msg").text("Se actualizó correctamente el cuadro")
                $("#msg").show();
                $('#cuadroModal').modal('hide');
                app.table.ajax.reload();
            },
            error: function (error) {

            }
        })
    },

    delete: function (idCuadro) {
        $.ajax({
            url: app.backend + '/fire/' + idCuadro,
            method: 'DELETE',
            dataType: 'json',
            contentType: "application/json; charset=utf-8",

            success: function (json) {
                $("#msg").text('Se eliminó el cuadro correctamente');
                $("#msg").show();
                $('#cuadroModal').modal('hide');
                app.table.ajax.reload();
            },
            error: function (error) {

            }
        })
    }

};


$(document).ready(function () {
    app.init();
});