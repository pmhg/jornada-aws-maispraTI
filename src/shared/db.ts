import { Sequelize } from 'sequelize-typescript';
import { Pool } from "pg";
import * as cls from 'cls-hooked';

const {DB_URL} = process.env;

// create transaction hook
const sequelizeNamespace = cls.createNamespace('mentoria-api');

// enable hook for transactions
Sequelize.useCLS(sequelizeNamespace);

// não remover essa referência é importante para que o typescript force a geração
// do require para o módulo pg e, assim, o deploy do serverless funcione adequadamente
const pool: Pool = new Pool();

export const sequelize = new Sequelize(DB_URL, {
	dialectOptions: {
		ssl: {rejectUnauthorized: false},
	},
	define: {
		schema: 'mentoria',
	},
	models: [__dirname + "/models"],
	modelMatch: (filename, member) => {
		return filename.substring(0, filename.indexOf('.model')) === member.toLowerCase();
	},

});
