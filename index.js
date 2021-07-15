var app = {

    backend: 'http://localhost:8081/api/tiendas',
    table: null,

    init: function () {
        app.initDatatable('#tiendas');


        $('#save').click(function () {

            var idTienda = $('#idTienda').val();
            var nombreTienda = $('#nombreTienda').val();
            var maxCuadros = $('#maxCuadros').val()

            if (isNaN(idTienda) || idTienda == '' || idTienda === '') {
                console.log("Creando")
                app.save({
                    idTienda, nombreTienda, maxCuadros
                })

            } else {
                console.log("Actualizando")
                app.update({
                    idTienda, nombreTienda, maxCuadros
                });
            }

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
                { data: "idTienda" },
                { data: "nombreTienda" },
                { data: "maxCuadros" }
            ],
            buttons: [
                {
                    text: 'Crear',
                    action: function (evento, datatable, node, config) {
                        app.cleanForm();
                        $('#tiendaModal').modal();
                    }
                },
                {
                    text: 'Editar',
                    action: function (evento, datatable, node, config) {

                        var data = datatable.rows('.table-active').data()[0]; //obtenemos el registro seleccionado (ensombrecido, gracias a .table-active)
                        console.log(data);

                        app.setDataToModal(data);

                        $('#tiendaModal').modal();
                    }
                },
                {
                    text: 'Eliminar',
                    action: function (evento, datatable, node, config) {

                        var data = datatable.rows('.table-active').data()[0];
                        console.log(data);

                        if (confirm('¿Estás seguro de eliminar la tienda?')) {
                            app.delete(data.idTienda);
                            app.table.ajax.reload();
                        }

                    }
                }
            ]
        });

        $('#tiendas tbody').on('click', 'tr', function () {  //el botón se quedá ensombrecido, como seleccionado
            if ($(this).hasClass('table-active')) {
                $(this).removeClass('table-active')
            } else {
                app.table.$('tr.table-active').removeClass('table-active')
                $(this).addClass('table-active');
            }
        });
    },

    setDataToModal: function (data) { //para que la modal recoja los datos de la table y los escriba
        $('#idTienda').val(data.idTienda);
        $('#nombreTienda').val(data.nombreTienda);
        $('#maxCuadros').val(data.maxCuadros);
    },

    cleanForm: function () {
        $('#idTienda').val('');
        $('#nombreTienda').val('');
        $('#maxCuadros').val('');
    },

    //FUNCIONES CRUD

    update: function (data) {
        var id = parseInt(data.idTienda);
        $.ajax({
            url: app.backend + '/' + id,
            data: JSON.stringify(data),
            method: 'PUT',
            dataType: 'json',
            contentType: "application/json; charset=UTF-8",

            success: function (json) {
                $("#msg").text("Se actualizó correctamente la tienda")
                $("#msg").show();
                $('#tiendaModal').modal('hide');
                app.table.ajax.reload();
            },
            error: function (error) {

            }
        })
    },

    save: function (data) {
        $.ajax({
            url: app.backend + '',
            data: JSON.stringify(data),
            method: 'POST',
            dataType: 'json',
            contentType: "application/json; charset=utf-8",

            success: function (json) {
                $("#msg").text('Se guardó la tienda correctamente');
                $("#msg").show();
                $('#tiendaModal').modal('hide');
                app.table.ajax.reload();
            },
            error: function (error) {

            }
        })
    },

    delete: function (idTienda) {
        $.ajax({
            url: app.backend + '/fire/' + idTienda,
            method: 'DELETE',
            dataType: 'json',
            contentType: "application/json; charset=utf-8",

            success: function (json) {
                $("#msg").text('Se eliminó la tienda correctamente');
                $("#msg").show();
                $('#tiendaModal').modal('hide');
            },
            error: function (error) {

            }
        })
    }

};


$(document).ready(function () {
    app.init();
});