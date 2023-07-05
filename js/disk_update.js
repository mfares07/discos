// console.log(location.search); // lee los argumentos pasados a este formulario
var id = location.search.substr(4);
const { createApp } = Vue;
createApp({
  data() {
    return {
      id: 0,
      nombre: "",
      artista: "",
      genero: "",
      anio: "",
      tracks: 0,
      duracion: "",
      imagen: "",
      url: 'https://alekhine12.pythonanywhere.com/discos/' + id,
      url_add: 'https://alekhine12.pythonanywhere.com/discos'
    };
  },
  methods: {

    modificar() {
      let disco = {
        nombre: this.nombre,
        artista: this.artista,
        genero: this.genero,
        anio: this.anio,
        tracks: this.tracks,
        duracion: this.duracion,
        imagen: this.imagen
      };
      var options = {
        body: JSON.stringify(disco),
        method: 'PUT',
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

    grabar() {
      let disco = {
        nombre: this.nombre,
        artista: this.artista,
        genero: this.genero,
        anio: this.anio,
        tracks: this.tracks,
        duracion: this.duracion,
        imagen: this.imagen
      };
      var options = {
        body: JSON.stringify(disco),
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        redirect: 'follow'
      };
      fetch(this.url_add, options)
        .then(function () {
          window.location.href = "./index.html";
        })
        .catch(err => {
          console.error(err);
          alert("Error al Modificar");
        });

    }
  },
  created() {
    // this.fetchData(this.url);
    fetch(this.url)
      .then(response => response.json())
      .then(data => {
        this.id = data.ID;
        this.nombre = data.Nombre;
        this.artista = data.Artista;
        this.genero = data.Genero;
        this.anio = data.Anio;
        this.tracks = data.Tracks;
        this.duracion = data.Duracion;
        this.imagen = data.Imagen;
      })
      .catch(err => {
        console.error(err);
        this.error = true;
      });
  },
}).mount('#app');