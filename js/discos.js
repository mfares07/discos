const { createApp } = Vue
createApp({
    data() {
        return {
            discos: [],
            url: 'https://alekhine12.pythonanywhere.com/discos',
            cargando: true,
            error: false,
            discosArray: [],
            minAnio: 1850,
            maxAnio: 2023,
            minTracks: 0,
            maxTracks: 40,
            show_table: true,
            totalRegistros: 0,
            rotated: false,
            buscarValue: ''

        }
    },

    methods: {
        fetchData(url) {
            fetch(url)
                .then(response => response.json())
                .then(data => {
                    this.discos = data;
                    this.totalRegistros = data.length;
                    this.cargando = false;
                })
                .catch(err => {
                    console.error(err);
                    this.error = true;
                })
        },
        fetchAnio(minYear, maxYear) {
            const url = this.url + `?minYear=${minYear}&maxYear=${maxYear}&minTracks=${this.minTracks}&maxTracks=${this.maxTracks}`;
            this.fetchData(url);
        },
        fetchTracks(minTracks, maxTracks) {
            // const url = this.url + `?minTracks=${minTracks}&maxTracks=${maxTracks}`;
            const url = this.url + `?minYear=${this.minAnio}&maxYear=${this.maxAnio}&minTracks=${minTracks}&maxTracks=${maxTracks}`;
            this.fetchData(url);
        },
        openFile() {
            const fileInput = document.createElement('input');
            fileInput.type = 'file';
            fileInput.accept = '.csv';
            fileInput.addEventListener('change', this.handleFile);
            fileInput.click();
        },
        handleFile(event) {
            const file = event.target.files[0];
            const reader = new FileReader();

            reader.onload = (event) => {
                const csvContent = event.target.result;
                this.discosArray = csvContent.split("\n").filter(item => item !== "");
                this.cargarDiscos()
            };

            reader.readAsText(file);
        },
        cargarDiscos() {
            // Preparar el bloque de registros como un array de objetos JSON
            const registros = Array.from(this.discosArray);
            var options = {
                body: JSON.stringify(registros),
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                redirect: 'follow'
            };
            fetch(this.url, options)
                .then(function () {
                    window.location.href = "./index.html";
                })
                .catch(err => {
                    console.error(err);
                    alert("Error al Modificar");
                });
        },
        ordenarAnio() {
            const order = this.rotated ? 'desc' : 'asc';
            const urlAnio = `${this.url}?minYear=${this.minAnio}&maxYear=${this.maxAnio}&minTracks=${this.minTracks}&maxTracks=${this.maxTracks}&order=${order}`;
            this.rotated = !this.rotated;
            console.log(urlAnio);
            fetch(urlAnio)
                .then(response => response.json())
                .then(data => {
                    this.discos = data;
                    this.totalRegistros = data.length;
                    this.cargando = false
                })
                .catch(err => {
                    console.error(err);
                    this.error = true;
                })
        },
        buscar(value) {
            if (value !== '') {
                const data = { valorBusqueda: value };

                fetch((this.url + '/' + 'consultar'), {
                    body: JSON.stringify(data),
                    method: 'POST',
                    headers: { 'Content-Type': 'application/json' },
                    redirect: 'follow'
                })
                    .then(response => response.json())
                    .then(data => {
                        this.discos = data;
                        this.totalRegistros = data.length;
                        this.cargando = false;
                    })
                    .catch(error => {
                        console.error('Error:', error);
                    });
                this.buscarValue = '';
            }
        },
        eliminar(disco) {
            const url = 'https://alekhine12.pythonanywhere.com/discos/' + disco;
            let options = {
                method: 'DELETE'
            }
            fetch(url, options)
                .then(res => res.json())
                .then(res => {
                    window.location.href = "./index.html";
                    // window.location.reload();
                })
                .catch(err => {
                    console.error(err);
                    this.error = true;
                })
        },
        resetear() {
            this.minAnio = 1850,
                this.maxAnio = 2023,
                this.minTracks = 0,
                this.maxTracks = 40,
                this.rotated = false
        }
    },
    watch: {
        minAnio(newAnio) {
            this.fetchAnio(newAnio, this.maxAnio);
        },
        maxAnio(newAnio) {
            this.fetchAnio(this.minAnio, newAnio);
        },
        minTracks(newTracks) {
            this.fetchTracks(newTracks, this.maxTracks);
        },
        maxTracks(newTracks) {
            this.fetchTracks(this.minTracks, newTracks);
        },
        totalRegistros(newValue) {
            if (newValue == 0) {
                this.show_table = false;
            }
            else {
                this.show_table = true;
            }
        }
    },

    created() {
        this.fetchData(this.url);
    }
}).mount('#app')


