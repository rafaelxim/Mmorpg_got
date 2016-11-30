//importar o crypto
var crypto = require('crypto');

//criar classe 
function UsuariosDAO(connection){
	this._connection = connection();	
}

UsuariosDAO.prototype.inserirUsuario = function(usuario){
	this._connection.open( function(err, mongoclient){ //funcao open abre a conexao com o servidor
		mongoclient.collection('usuarios', function(err, collection){  //funcao 'collection' permite manipular dados dentro das colecoes --- collection usuarios nesse caso 
			//criptografia da senha
			var senha_criptografada = crypto.createHash('md5').update(usuario.senha).digest('hex');
			usuario.senha= senha_criptografada;
			collection.insert(usuario); //insere de fato os dados que passados pelo dadosForm ao parametro usuario
			mongoclient.close(); //fecha a conexao
		})  
	});
}

UsuariosDAO.prototype.autenticar = function(usuario, req, res){ //precisa do req e res
	this._connection.open( function(err, mongoclient){ //funcao open abre a conexao com o servidor
		mongoclient.collection('usuarios', function(err, collection){  //funcao 'collection' permite manipular dados dentro das colecoes --- collection usuarios nesse caso 
			var senha_criptografada = crypto.createHash('md5').update(usuario.senha).digest('hex');
			usuario.senha= senha_criptografada;
			collection.find({   //OU EU POSSO FAZER ASSIM :   collection.find(usuario)
				usuario: {$eq: usuario.usuario},
				senha: {$eq: usuario.senha}
			}).toArray(function(err, result){ //retorna o resultado em forma de array no parametro result
				//se achou o usuario
				if(result[0] != undefined){
					//cria variaveis de sessao
					req.session.autorizado = true;
					req.session.usuario = result[0].usuario;
					req.session.casa = result[0].casa;
				}					
				if (req.session.autorizado) { //redireciona para pag de jogo caso o usuario esteja autorizado
					res.redirect('jogo');
				}
				else{ //redireciona para index caso nao ache o usuario no bd
					res.render('index', {validacao: {}});
				}


			});  
			mongoclient.close(); //fecha a conexao
		})  
	});
}

module.exports= function(){
	return UsuariosDAO;
}