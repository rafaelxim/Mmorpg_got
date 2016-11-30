module.exports.index = function(application, req, res){
	res.render('index', {validacao:{}});
}

module.exports.autenticar = function(application, req, res){
	var dadosForm = req.body;
	req.assert('usuario', 'Insert an user name').notEmpty();
	req.assert('senha','Insert a password' ).notEmpty();

	var erros = req.validationErrors();
	if (erros){
		res.render('index', {validacao: erros});
		return;
	}
	//valida o usuario no BD
	var connection = application.config.dbConnection;
	var UsuariosDAO = new application.app.models.UsuariosDAO(connection);
	UsuariosDAO.autenticar(dadosForm, req, res);	
}