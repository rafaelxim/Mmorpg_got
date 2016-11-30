module.exports.jogo = function(application, req, res){
	if (req.session.autorizado !== true) {
		res.send('usuario precisa fazer o login');		
		return; //o return faz com que nao se execute mais nenhum codigo
	}

	//caso o jogador nao preencha algum parametro necessario para uma acao dentro do jogo
	var msg = '';
	if(req.query.msg != ''){
		msg =req.query.msg;
	}

	var connection = application.config.dbConnection;
	var JogoDAO = new application.app.models.JogoDAO(connection);
	var usuario = req.session.usuario;
	var casa = req.session.casa;
	JogoDAO.iniciaJogo(res, usuario, casa, msg);	
}

module.exports.sair = function(application, req, res){
		req.session.destroy(function(err){
			res.render('index', {validacao: {}});
		});
}

module.exports.suditos = function(application, req, res){	
	if (req.session.autorizado !== true) {
		res.send('usuario precisa fazer o login');		
		return; //o return faz com que nao se execute mais nenhum codigo
	}	
	res.render('aldeoes');		
}

module.exports.pergaminhos = function(application, req, res){
	if (req.session.autorizado !== true) {
		res.send('usuario precisa fazer o login');		
		return; //o return faz com que nao se execute mais nenhum codigo
	}		

	//recuperar as acoes do BD
	var connection = application.config.dbConnection;
	var JogoDAO = new application.app.models.JogoDAO(connection);
	var usuario = req.session.usuario;
	JogoDAO.getAcoes(usuario, res);
		
}

module.exports.ordenar_acao_sudito = function(application, req, res){
	if (req.session.autorizado !== true) {
		res.send('usuario precisa fazer o login');		
		return; //o return faz com que nao se execute mais nenhum codigo
	}

	var dadosForm=req.body;
	req.assert('acao','Sir, select an action').notEmpty();
	req.assert('quantidade','Sir, select a quantity').notEmpty();

	var erros = req.validationErrors();

	if(erros){
		res.redirect('jogo?msg=A');
		return;
	}
	
	var connection = application.config.dbConnection;
	var JogoDAO = new application.app.models.JogoDAO(connection);
	dadosForm.usuario = req.session.usuario;
	JogoDAO.acao(dadosForm);

	res.redirect('jogo?msg=B');
}

module.exports.revogar_acao = function(application, req, res){	
	var url_query = req.query;

	var connection = application.config.dbConnection;
	var JogoDAO = new application.app.models.JogoDAO(connection);

	var _id = url_query.id_acao;
	JogoDAO.revogarAcao(_id, res);
}