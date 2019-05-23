let ref = firebase.database().ref('tempos/');

let app = new Vue({
	el: '#app',
	data: {
		nome: '',
		milisegundos: 0,
		segundos: 0,
		minutos: 0,
		tempo: '00:00',
		lista: [],
		intervalo: null,
		started: false
	},
	methods: {
		contar: function () {
			this.started = true;

			this.intervalo = setInterval(function () {
				app.segundos = app.segundos + 1;

				if(app.segundos > 59) {
					app.segundos = 0;
					app.minutos = app.minutos + 1;
				}

				app.tempo = app.formataTempo(app.minutos) + ':' + app.formataTempo(app.segundos);
			}, 1000);
		},
		parar: function () {
			clearInterval(this.intervalo);
		},
		salvar: function () {
			if(this.nome == '') {
				alert('Digite um nome.');
			} else {
				app.parar();

				let dados = { nome: this.nome, tempo: this.tempo};

				ref.push(dados).then(snapshot => {
					app.lista.push(dados);
					app.nome = '';
					app.zerar();
				}).catch(error => {
					console.log('error', error);
				});
			}
		},
		zerar: function () {
			this.tempo = '00:00';
			this.segundos = 0;
			this.minutos = 0;
			this.started = false;
		},
		formataTempo: function (valor) {
			if(valor < 10) {
				return '0'+valor;
			} else {
				return valor;
			}
		},
		isStarted: function () {
			return this.started;
		},
		action: function () {
			if(this.started) {
				this.parar();
			} else {
				this.contar();
			}
		},
		classeTempo: function () {
			if(this.started) {
				return 'active';
			} else {
				return '';
			}
		}
	},
	created: function () {
		ref.once('value').then(snapshot => {
			snapshot.forEach(value => {
				app.lista.push({ nome: value.val().nome, tempo: value.val().tempo });
			});
		});
	}
})