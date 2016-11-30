module.exports.cadastro = function(application, req, res){
	res.render('cadastro', {validacao: {}, dadosForm: {}});
}

module.exports.cadastrar = function(application, req, res){
	//criar variavel que recebe dados do form da view cadastro
	var dadosForm = req.body;
	//validacao de campos
	req.assert('nome', 'Insert a Name').notEmpty();
	req.assert('usuario', 'Insert an user').notEmpty();
	req.assert('senha', 'Insert a password').notEmpty();
	req.assert('casa', 'Insert a House').notEmpty();

	//recuperar erros de validacao
	var erros = req.validationErrors();
	console.log(erros);

	if (erros) {
		//renderizar a pagina enviando os dados de erros e os dados digitados
		res.render('cadastro', {validacao : erros, dadosForm: dadosForm});
		return;
	}

	//conectar BD
	var connection = application.config.dbConnection;

	//importar model passando como referencia a conexao
	var UsuariosDAO = new application.app.models.UsuariosDAO(connection);
	var JogoDAO = new application.app.models.JogoDAO(connection);

	//executar a funcao do model
	UsuariosDAO.inserirUsuario(dadosForm);
	JogoDAO.gerarParametros(dadosForm.usuario);
	//geraçao das habilidades da casa


	res.send('podemos cadastrar');
}