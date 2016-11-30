//importar o mongodb
//antes ele precisa ser instalado via npm install mongodb --save
var mongo = require('mongodb');

//criar conexao com o BD
var connMongoDB = function(){
	var db = new mongo.Db(
		'got', //nome do banco
		new mongo.Server( //objeto de conexao com o servidor
			'localhost', //endereço do servidor
			27017, //porta de conexao é essa por padrao
			{} //objeto com configuracoes do servidor
			),
		{}//outro objeto de configuracao opcionais
		);
	return db;
}

//exporta a variavel de conexao com o db
module.exports = function(){
	return connMongoDB;
}