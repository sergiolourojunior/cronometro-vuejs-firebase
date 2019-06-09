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
		started: false,
		menuExpansive: false,
		salvarDisabled: false
	},
	methods: {
		contar: function () {
			this.started = true;
			this.salvarDisabled = false;

			this.intervalo = setInterval(function () {
				app.milisegundos = app.milisegundos + 1;

				if(app.milisegundos > 99) {
					app.segundos = app.segundos + 1;
					app.milisegundos = 0;
				}
				if(app.segundos > 59) {
					app.segundos = 0;
					app.minutos = app.minutos + 1;
				}

				app.tempo = app.formataTempo(app.minutos) + ':' + app.formataTempo(app.segundos);
			}, 10);
		},
		parar: function () {
			clearInterval(this.intervalo);
			this.started = false;
			this.salvarDisabled = true;
		},
		salvar: function () {
			if(this.nome == '') {
				alert('Digite um nome.');
			} else {
				app.parar();

				let dados = { nome: this.nome, tempo: this.tempo + ':' + this.formataTempo(this.milisegundos) };

				let data = new Date();
				let data_atual = data.getFullYear() + '-' + (data.getMonth() + 1) + '-' + data.getDate();

				ref.child(data_atual).push(dados).then(snapshot => {
					app.getListaTempos();
					app.nome = '';
					app.zerar();
					app.salvarDisabled = true;
				}).catch(error => {
					console.log('error', error);
				});
			}
		},
		zerar: function () {
			this.tempo = '00:00';
			this.milisegundos = 0;
			this.segundos = 0;
			this.minutos = 0;
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
		isDisabled: function () {
			return this.salvarDisabled;
		},
		action: function () {
			if(this.started) {
				this.parar();
				this.toggleMenu();
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
		},
		classeMenu: function () {
			if(this.menuExpansive) {
				return 'active';
			} else {
				return '';
			}
		},
		toggleMenu: function () {
			this.menuExpansive = !this.menuExpansive;
		},
		getListaTempos: function () {
			ref.once('value').then(snapshot => {
				app.lista = [];

				snapshot.forEach(value => {
					let data_split = value.key.split('-');
					let data_formated = data_split.reverse().join('/');

					app.lista.push({ data: data_formated, itens : value.val() });
				});
			});
		}
	},
	created: function () {
		this.getListaTempos();
	}
})