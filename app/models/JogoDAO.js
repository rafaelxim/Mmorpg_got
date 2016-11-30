var ObjectID= require('mongodb').ObjectId;


function JogoDAO(connection){
	this._connection = connection();	
}

JogoDAO.prototype.gerarParametros = function(usuario){	
	this._connection.open( function(err, mongoclient){ 
		mongoclient.collection('jogo', function(err, collection){  //funcao 'collection' permite manipular dados dentro das colecoes --- collection usuarios nesse caso 
			collection.insert({
				usuario: usuario,
				moeda: 15,
				suditos: 10,
				temor: Math.floor(Math.random() *1000),
				sabedoria:Math.floor(Math.random() *1000),
				comercio:Math.floor(Math.random() *1000),
				magia:Math.floor(Math.random() *1000)
			}); 

			mongoclient.close(); //fecha a conexao
		})  
	});
}

JogoDAO.prototype.iniciaJogo = function(res, usuario, casa, msg){	
	this._connection.open( function(err, mongoclient){ 
		mongoclient.collection('jogo', function(err, collection){  
			collection.find({ usuario : usuario}).toArray(function(err, result){ 
				res.render('jogo', {img_casa: casa, jogo : result[0], msg: msg}); // o render sera feito aqui passando as vars result e casa
				mongoclient.close(); //fecha a conexao
			});
		});
	}); 
}

JogoDAO.prototype.acao = function(acao){	
	this._connection.open( function(err, mongoclient){ 
		//insere as acoes no BD
		mongoclient.collection('acao', function(err, collection){  //funcao 'collection' permite manipular dados dentro das colecoes --- collection usuarios nesse caso 
			var date = new Date();
			var tempo = null;
			//definir o tempo da acao
			switch(parseInt(acao.acao)){
				case 1 : tempo = 1 * 60 * 60000;  break; //1h
				case 2 : tempo = 2 * 60 * 60000;  break; //2h
				case 3 : tempo = 5 * 60 * 60000;  break; //5h
				case 4 : tempo = 5 * 60 * 60000;  break; //5h
			}
			acao.acao_termina_em = date.getTime() + tempo; // tempo atual + tempo da acao // essa funciton getTime() pega os milisegundos passados desde 1970
			collection.insert(acao); 
			
		})
		//atualiza a moeda
		mongoclient.collection('jogo', function(err, collection){ 
			var moedas = null;
			switch(parseInt(acao.acao)){
				case 1 : moedas = -2* acao.quantidade;  break; //1h
				case 2 : moedas = -3* acao.quantidade;  break; //2h
				case 3 : moedas = -1* acao.quantidade;  break; //5h
				case 4 : moedas = -1* acao.quantidade;  break; //5h
			}

			collection.update(
				{usuario : acao.usuario},// criterio de pesquisa
				{$inc: {moeda: moedas}}//instrucao de atuaizacao INC, para incrementar. ---poderia ser set para setar
				//ainda teria mais um parametro para multi atualizacao. Mas no nosso caso somente um usuario sera afetado
			);
			mongoclient.close(); //fecha a conexao
		});
	});
}

//recuperar acoes no pergaminho
JogoDAO.prototype.getAcoes = function(usuario,res){	
	this._connection.open( function(err, mongoclient){ 
		mongoclient.collection('acao', function(err, collection){  
			var date = new Date();
			var momento_atual= date.getTime();
			collection.find({usuario: usuario, acao_termina_em: {$gt:momento_atual}}).toArray(function(err, result){ 
				res.render('pergaminhos', {acoes : result});		
				mongoclient.close(); //fecha a conexao
			});
		});
	});
}

JogoDAO.prototype.revogarAcao = function(_id, res){	
	this._connection.open( function(err, mongoclient){ 
		mongoclient.collection('acao', function(err, collection){ 
			collection.remove(
				{_id: ObjectID(_id)}, //criterio para a remocao do documento// o _id tem que ser passado como um objjeto.
				function(err, result){ //funcao de callback
					res.redirect('jogo?msg=D');
					mongoclient.close(); //fecha a conexao
				} 
			)
		});
	});
}

module.exports= function(){
	return JogoDAO;
}