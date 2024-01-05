var registros = [];

    function registrarTurno() {
        // Validar que todos los campos estén llenos
        var nombre = document.getElementById("nombre").value.trim();
        var apellido = document.getElementById("apellido").value.trim();
        var dni = document.getElementById("dni").value.trim();
        var asunto = document.getElementById("asunto").value;
        var fecha = document.getElementById("fecha").value.trim();

        if (nombre === "" || apellido === "" || dni === "" || asunto === "" || fecha === "") {
            alert("Todos los campos son obligatorios.");
            return;
        }

        // Validar que el DNI sea un número
        if (isNaN(dni)) {
            alert("El DNI debe ser un número.");
            return;
        }

        // Agregar el nuevo registro al array
        var nuevoRegistro = { nombre, apellido, dni, asunto, fecha };
        registros.push(nuevoRegistro);

        // Actualizar el listado de registros
        mostrarListadoRegistros();

        // Limpiar el formulario
        document.getElementById("formularioRegistro").reset();
    }

    function mostrarListadoRegistros() {
        var listaRegistros = document.getElementById("listaRegistros");
        listaRegistros.innerHTML = '';

        registros.forEach(function (registro) {
            var listItem = document.createElement("li");
            listItem.className = "list-group-item";
            listItem.textContent = `${registro.nombre} ${registro.apellido} - DNI: ${registro.dni} - Asunto: ${registro.asunto} - Fecha: ${registro.fecha}`;
            listaRegistros.appendChild(listItem);
        });
    }

    function cargarArchivo() {
        var input = document.getElementById("archivo");

        // Verificar si se seleccionó un archivo
        if (input.files.length > 0) {
            var file = input.files[0];
            var reader = new FileReader();

            reader.onload = function (e) {
                var data = new Uint8Array(e.target.result);
                var workbook = XLSX.read(data, { type: 'array' });

                // Limpiar registros anteriores al cargar un nuevo archivo
                registros = [];

                // Lógica para procesar el archivo Excel y añadir nuevos registros
                var nuevaData = XLSX.utils.sheet_to_json(workbook.Sheets[workbook.SheetNames[0]]);
                registros = registros.concat(nuevaData);

                // Actualizar el listado de registros
                mostrarListadoRegistros();
            };

            reader.readAsArrayBuffer(file);
        } else {
            alert("Selecciona un archivo Excel válido.");
        }
    }

    function descargarRegistros() {
        // Verificar si hay registros para descargar
        if (registros.length === 0) {
            alert("No hay registros para descargar.");
            return;
        }

        // Crear un nuevo libro de Excel
        var workbook = XLSX.utils.book_new();
        var hojaRegistros = XLSX.utils.json_to_sheet(registros);

        // Añadir la hoja de registros al libro
        XLSX.utils.book_append_sheet(workbook, hojaRegistros, 'Registros');

        // Descargar el archivo Excel
        XLSX.writeFile(workbook, 'registros.xlsx');
    }