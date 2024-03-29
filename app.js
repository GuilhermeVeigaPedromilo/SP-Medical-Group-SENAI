const express = require('express');
const mysql = require('mysql2');
const session = require('express-session');
const bodyParser = require('body-parser');
const app = express();
const path = require('path');
const { NEWDATE } = require('mysql/lib/protocol/constants/types');


// Configurar a conexão com o banco de dados MySQL
const db = mysql.createConnection({
  host: 'localhost',
  user: 'phpmyadmin',
  password: '0z0x0c0v0b0n0m',
  database: 'spmedicalgroupdb',
});


db.connect((err) => {
  if (err) {
    console.error('Erro ao conectar ao banco de dados:', err);
    throw err;
  }
  console.log('Conexão com o banco de dados MySQL estabelecida.');
});


// Configurar a sessão
app.use(
  session({
    secret: '0z0x0c0v0b0n0m',
    resave: true,
    saveUninitialized: true,
  })
);

// app.use(express.static(__dirname + '/views'));
// app.use(bodyParser.urlencoded({ extended: true }));

app.use(express.static(__dirname + '/views'));
app.use(bodyParser.urlencoded({ extended: true }));

app.use(express.static(__dirname + '/assets'));
app.use(bodyParser.urlencoded({ extended: true }));

app.use(express.static(__dirname + '/admin-pages'));
app.use(bodyParser.urlencoded({ extended: true }));

app.use(express.static(__dirname + '/assets/css'));
app.use(bodyParser.urlencoded({ extended: true }));

app.use(express.static(__dirname + '/pages'));
app.use(bodyParser.urlencoded({ extended: true }));

// Configurar EJS como o motor de visualização
app.set('view engine', 'ejs');

// Rota para a página de login
app.get('/', (req, res) => {
  res.render('index');
  app.use(express.static(__dirname + '/views'));
  app.use(express.static(__dirname + '/'));


});

app.get('/login', (req, res) => {
  res.render('login'); // Renders views/login.ejs
});
// Rota para processar o formulário de login
app.post('/login', (req, res) => {
  const { username, password, cpf } = req.body;

  const query = 'SELECT * FROM users WHERE username = ? AND password = SHA1(?) AND cpf = ?';

  db.query(query, [username, password, cpf], (err, results) => {
    if (err) throw err;

    if (results.length > 0) {
      // Autenticação bem-sucedida
      req.session.loggedin = true;
      req.session.name = username;

      // Verifique o tipo de usuário
      const tipoUsuario = results[0].tipo;

      req.session.tipoUsuario = tipoUsuario

      if (tipoUsuario === 'user') {
        console.log("Usuario Logado");
        res.redirect('/agendamento')
        req.session.loggedin = true;
        req.session.name = username;
      } else if (tipoUsuario === 'Medico') {
        console.log("Usuario Logado");
        res.redirect('/medicopage')
        req.session.loggedin = true;
        req.session.name = username;
      } else if (tipoUsuario === 'Gestor') {
        console.log("Usuario Logado");
        res.redirect('/gestorpage')
        req.session.loggedin = true;
        req.session.name = username;
      } else if (tipoUsuario === 'Administrador') {
        console.log("Usuario Logado");
        res.redirect('/indexadmin')
        req.session.loggedin = true;
        req.session.name = username;
      } else {
        // Tratamento para outros tipos de usuário ou tipo desconhecido
        res.send('Tipo de usuário desconhecido. <a href="/">Tente novamente</a>');
      }
    } else {
      // Credenciais incorretas
      res.send('<h1>Credenciais Incorretas');
    }
  });
});


// Rota para fazer logout
app.get('/logout', (req, res) => {
  req.session.destroy(() => {
    res.redirect('/');
    console.log('Desconectado')
  });
});

app.get('/perfil', (req, res) => {

  if (req.session.loggedin && req.session.name) {
    db.query('SELECT * FROM users where username=?', [req.session.name], (err, row) => {
      if (err) throw err;
      res.render('perfil', { req: req, dados: row });
    });
  } else {
    // Se não estiver autenticado, redireciona para a página de login
    res.send(404, '<!DOCTYPE html><html lang="en"><head><meta charset="UTF-8"><meta name="viewport" content="width=device-width, initial-scale=1.0"><link href="assets/SP-Medical Group/assets/img/logoicon.png" rel="icon"><title>SP-Medical Group</title><style>body{align-items:center;text-align:center;justify-content:center;background-color:rgb(240,240,240);}a{color:black;}.logo{margin-top:100px;}</style></head><body><img class="logo" src="assets/SP-Medical Group/assets/img/logo.png"><br><br><br><br><br><br><br><br><br><br><br><br><a href="/login">É necessário fazer login para acessar sua página</a></body></html>');
  }
});


app.get('/consultas', (req, res) => {

  if (req.session.loggedin && req.session.name) {
    db.query('SELECT * FROM consultas where username=?', [req.session.name], (err, row) => {
      if (err) throw err;
      res.render('consultas', { req: req, dados: row });
    });
  } else {
    // Se não estiver autenticado, redireciona para a página de login
    res.send(404, '<!DOCTYPE html><html lang="en"><head><meta charset="UTF-8"><meta name="viewport" content="width=device-width, initial-scale=1.0"><link href="assets/SP-Medical Group/assets/img/logoicon.png" rel="icon"><title>SP-Medical Group</title><style>body{align-items:center;text-align:center;justify-content:center;background-color:rgb(240,240,240);}a{color:black;}.logo{margin-top:100px;}</style></head><body><img class="logo" src="assets/SP-Medical Group/assets/img/logo.png"><br><br><br><br><br><br><br><br><br><br><br><br><a href="/login">É necessário fazer login para acessar sua página</a></body></html>');
  }
});

app.get('/agendamento', (req, res) => {
  if (req.session.loggedin && req.session.name) {
    res.render('agendamento', { req: req });
    console.log(req.session);

  } else {
    // Se não estiver autenticado, redireciona para a página de login
    res.send(404, '<!DOCTYPE html><html lang="en"><head><meta charset="UTF-8"><meta name="viewport" content="width=device-width, initial-scale=1.0"><link href="assets/SP-Medical Group/assets/img/logoicon.png" rel="icon"><title>SP-Medical Group</title><style>body{align-items:center;text-align:center;justify-content:center;background-color:rgb(240,240,240);}a{color:black;}.logo{margin-top:100px;}</style></head><body><img class="logo" src="assets/SP-Medical Group/assets/img/logo.png"><br><br><br><br><br><br><br><br><br><br><br><br><a href="/login">É necessário fazer login para acessar sua página</a></body></html>');
  }
});

app.post('/agendamento', (req, res) => {
  const username = req.session.name;
  const { email, date, horario, medico, informacoesamais } = req.body;

  const query = 'INSERT INTO consultas (username, email, date, horario, medico, informacoesamais) VALUES ( ?, ?, ?, ?, ?, ?)';
  db.query(query, [username, email, date, horario, medico, informacoesamais], (err, results) => {
    if (err) {
      console.error('Erro ao agendar a consulta', err);
      res.send('<!DOCTYPE html><html lang="en"><head><meta charset="UTF-8"><meta name="viewport" content="width=device-width, initial-scale=1.0"><link href="assets/SP-Medical Group/assets/img/logoicon.png" rel="icon"><title>SP-Medical Group</title><style>body{align-items:center;text-align:center;justify-content:center;background-color:rgb(240,240,240);}a{color:black;}.logo{margin-top:100px;}</style></head><body><img class="logo" src="assets/SP-Medical Group/assets/img/logo.png"><br><br><br><br><br><br><br><br><br><br><br><br><a href="/agendamento">Erro ao agendar sua consulta, tente novamente</a></body></html>');
    } else {
      res.send('<!DOCTYPE html><html lang="en"><head><meta charset="UTF-8"><meta name="viewport" content="width=device-width, initial-scale=1.0"><link href="assets/SP-Medical Group/assets/img/logoicon.png" rel="icon"><title>SP-Medical Group</title><style>body{align-items:center;text-align:center;justify-content:center;background-color:rgb(240,240,240);}a{color:black;}.logo{margin-top:100px;}</style></head><body><img class="logo" src="assets/SP-Medical Group/assets/img/logo.png"><br><br><br><br><br><br><br><br><h1>Obrigado por sua escolha!</h1><br><br><br><br><a href="/agendamento">Sua consulta foi realizada com sucesso, volte para sua página</a></body></html>');
    }
  });

});

app.get('/gestorpage', (req, res) => {
  if (req.session.loggedin && req.session.name) {
    if (req.session.tipoUsuario === 'Gestor' || req.session.tipoUsuario === 'Administrador') {
      db.query('SELECT * FROM Blog', (err, result) => {
        if (err) throw err;
        res.render('gestorpage', { req: req, Blog: result });
        console.log(req.session);
      });
      // Tentativa de invasão por usuários sem permissão, leva o usuário ser desconectado da págian
    } else {
      res.send(403);
    }
  } else {
    // Se não estiver autenticado, redireciona para a página de login
    res.send(404, '<!DOCTYPE html><html lang="en"><head><meta charset="UTF-8"><meta name="viewport" content="width=device-width, initial-scale=1.0"><link href="assets/SP-Medical Group/assets/img/logoicon.png" rel="icon"><title>SP-Medical Group</title><style>body{align-items:center;text-align:center;justify-content:center;background-color:rgb(240,240,240);}a{color:black;}.logo{margin-top:100px;}</style></head><body><img class="logo" src="assets/SP-Medical Group/assets/img/logo.png"><br><br><br><br><br><br><br><br><br><br><br><br><a href="/login">É necessário fazer login para acessar sua página</a></body></html>');
  }
});

app.get('/medicopage', (req, res) => {
  if (req.session.loggedin && req.session.name) {
    // if (req.session.tipoUsuario === 'Medico', 'Administrador'){ // NÃO UTILIZAR ESTE TIPO DE CONSTRUÇÃO EM IF
    if (req.session.tipoUsuario === 'Medico' || req.session.tipoUsuario === 'Administrador') {
      console.log(`Entrando em /medicopage`)
      db.query('SELECT * FROM consultas', (err, result) => {
        if (err) throw err;
        res.render('medicopage', { req: req, consultas: result });
        console.log(req.session);
      });
      // Tentativa de invasão por usuários sem permissão, leva o usuário ser desconectado da págian
    } else {
      res.send(403);
    }
  } else {
    // Se não estiver autenticado, redireciona para a página de login
    res.send(404, '<!DOCTYPE html><html lang="en"><head><meta charset="UTF-8"><meta name="viewport" content="width=device-width, initial-scale=1.0"><link href="assets/SP-Medical Group/assets/img/logoicon.png" rel="icon"><title>SP-Medical Group</title><style>body{align-items:center;text-align:center;justify-content:center;background-color:rgb(240,240,240);}a{color:black;}.logo{margin-top:100px;}</style></head><body><img class="logo" src="assets/SP-Medical Group/assets/img/logo.png"><br><br><br><br><br><br><br><br><br><br><br><br><a href="/login">É necessário fazer login para acessar sua página</a></body></html>');
  }
});

app.get('/indexadmin', (req, res) => {

  // Verifica se o usuário está autenticado

  if (req.session.loggedin && req.session.name) {
    if (req.session.tipoUsuario === 'Administrador') {

      // Se estiver autenticado, consulta os usuários e renderiza a página
      db.query('SELECT * FROM users', (err, result) => {
        if (err) throw err;
        res.render('indexadmin', { req: req, users: result });
        console.log(req.session);
      });
      // Tentativa de invasão por usuários sem permissão, leva o usuário ser desconectado da págian
    } else {
      res.send(403);
    }
  } else {
    // Se não estiver autenticado, redireciona para a página de login
    res.send(404, '<!DOCTYPE html><html lang="en"><head><meta charset="UTF-8"><meta name="viewport" content="width=device-width, initial-scale=1.0"><link href="assets/SP-Medical Group/assets/img/logoicon.png" rel="icon"><title>SP-Medical Group</title><style>body{align-items:center;text-align:center;justify-content:center;background-color:rgb(240,240,240);}a{color:black;}.logo{margin-top:100px;}</style></head><body><img class="logo" src="assets/SP-Medical Group/assets/img/logo.png"><br><br><br><br><br><br><br><br><br><br><br><br><a href="/login">É necessário fazer login para acessar sua página</a></body></html>');
  }
});

app.get('/indexadmintableconsultas', (req, res) => {

  // Verifica se o usuário está autenticado

  if (req.session.loggedin && req.session.name) {
    if (req.session.tipoUsuario === 'Administrador') {

      // Se estiver autenticado, consulta os usuários e renderiza a página
      db.query('SELECT * FROM consultas', (err, result) => {
        if (err) throw err;
        res.render('indexadmintableconsultas', { req: req, consultas: result });
        console.log(req.session);
      });
      // Tentativa de invasão por usuários sem permissão, leva o usuário ser desconectado da págian
    } else {
      res.send(403);
    }
  } else {
    // Se não estiver autenticado, redireciona para a página de login
    res.send(404, '<!DOCTYPE html><html lang="en"><head><meta charset="UTF-8"><meta name="viewport" content="width=device-width, initial-scale=1.0"><link href="assets/SP-Medical Group/assets/img/logoicon.png" rel="icon"><title>SP-Medical Group</title><style>body{align-items:center;text-align:center;justify-content:center;background-color:rgb(240,240,240);}a{color:black;}.logo{margin-top:100px;}</style></head><body><img class="logo" src="assets/SP-Medical Group/assets/img/logo.png"><br><br><br><br><br><br><br><br><br><br><br><br><a href="/login">É necessário fazer login para acessar sua página</a></body></html>');
  }
});

app.get('/indexadmintablemensagens', (req, res) => {

  // Verifica se o usuário está autenticado

  if (req.session.loggedin && req.session.name) {
    if (req.session.tipoUsuario === 'Administrador') {

      // Se estiver autenticado, consulta os usuários e renderiza a página
      db.query('SELECT * FROM mensagens', (err, result) => {
        if (err) throw err;
        res.render('indexadmintablemensagens', { req: req, mensagens: result });
        console.log(req.session);
      });
      // Tentativa de invasão por usuários sem permissão, leva o usuário ser desconectado da págian
    } else {
      res.send(403);
    }
  } else {
    // Se não estiver autenticado, redireciona para a página de login
    res.send(404, '<!DOCTYPE html><html lang="en"><head><meta charset="UTF-8"><meta name="viewport" content="width=device-width, initial-scale=1.0"><link href="assets/SP-Medical Group/assets/img/logoicon.png" rel="icon"><title>SP-Medical Group</title><style>body{align-items:center;text-align:center;justify-content:center;background-color:rgb(240,240,240);}a{color:black;}.logo{margin-top:100px;}</style></head><body><img class="logo" src="assets/SP-Medical Group/assets/img/logo.png"><br><br><br><br><br><br><br><br><br><br><br><br><a href="/login">É necessário fazer login para acessar sua página</a></body></html>');
  }
});

app.get('/indexadmintablepost', (req, res) => {

  // Verifica se o usuário está autenticado

  if (req.session.loggedin && req.session.name) {
    if (req.session.tipoUsuario === 'Administrador') {

      // Se estiver autenticado, consulta os usuários e renderiza a página
      db.query('SELECT * FROM Blog', (err, result) => {
        if (err) throw err;
        res.render('indexadmintablepost', { req: req, Blog: result });
        console.log(req.session);
      });
      // Tentativa de invasão por usuários sem permissão, leva o usuário ser desconectado da págian
    } else {
      res.send(403);
    }
  } else {
    // Se não estiver autenticado, redireciona para a página de login
    res.send(404, '<!DOCTYPE html><html lang="en"><head><meta charset="UTF-8"><meta name="viewport" content="width=device-width, initial-scale=1.0"><link href="assets/SP-Medical Group/assets/img/logoicon.png" rel="icon"><title>SP-Medical Group</title><style>body{align-items:center;text-align:center;justify-content:center;background-color:rgb(240,240,240);}a{color:black;}.logo{margin-top:100px;}</style></head><body><img class="logo" src="assets/SP-Medical Group/assets/img/logo.png"><br><br><br><br><br><br><br><br><br><br><br><br><a href="/login">É necessário fazer login para acessar sua página</a></body></html>');
  }
});


app.get('/Cadastro', (req, res) => {
  res.render('Cadastro');
});

app.post('/Cadastro', (req, res) => {
  const { username, cpf, datanascimento, sexo, password, email } = req.body
  const verification = 'SELECT * FROM users WHERE username = ? OR cpf = ?';
  db.query(verification, [username, cpf], (verifErr, results) => {
    if (verifErr) {
      console.error('Erro no inserimento dos dados', checkErr);
    }
    if (results.length <= 0) {
      console.log(`Inserindo novo usuário no sistema com estes dados: ${username} - ${cpf}`);
      const query = 'INSERT INTO users (username, cpf, datanascimento, sexo, password, email, tipo) VALUES (?, ?, ?, ?, SHA1(?), ?, "user")';
      db.query(query, [username, cpf, datanascimento, sexo, password, email], (err, results) => {
        if (err) {
          console.error('Erro ao inserir usuário:', err);
          res.send('<!DOCTYPE html><html lang="en"><head><meta charset="UTF-8"><meta name="viewport" content="width=device-width, initial-scale=1.0"><link href="assets/SP-Medical Group/assets/img/logoicon.png" rel="icon"><title>SP-Medical Group</title><style>body{align-items:center;text-align:center;justify-content:center;background-color:rgb(240,240,240);}a{color:black;}.logo{margin-top:100px;}</style></head><body><img class="logo" src="assets/SP-Medical Group/assets/img/logo.png"><br><br><br><br><br><br><br><br><br><br><br><br><a href="/cadastro">Erro ao cadastrar, tente novamente</a></body></html>');
        } else {
          res.send('<!DOCTYPE html><html lang="en"><head><meta charset="UTF-8"><meta name="viewport" content="width=device-width, initial-scale=1.0"><link href="assets/SP-Medical Group/assets/img/logoicon.png" rel="icon"><title>SP-Medical Group</title><style>body{align-items:center;text-align:center;justify-content:center;background-color:rgb(240,240,240);}a{color:black;}.logo{margin-top:100px;}</style></head><body><img class="logo" src="assets/SP-Medical Group/assets/img/logo.png"><br><br><br><br><br><br><br><br><h1>Obrigado por sua escolha!</h1><br><br><br><br><a href="/login">Seu cadastro foi realizado com sucesso, volte para sua página</a></body></html>');
        }
      });
    } else {
      console.log(`O cadastro com estás informações já constam no sistema: ${username} - ${cpf}`)
      res.send('<h1>Um usuário já está cadastrado com estes dados</h1><br><a href="/cadastro">Tente Novamente</a>');
    }
  });
});

app.get('/register', (req, res) => {
  if (req.session) {
    if (req.session.tipoUsuario === 'Administrador') {
      res.render('register');
      console.log(req.session);
      // Tentativa de invasão por usuários sem permissão, leva o usuário ser desconectado da págian
    } else {
      res.send(403);
    }
  } else {
    // Se não estiver autenticado, redireciona para a página de login
    res.send(404, '<!DOCTYPE html><html lang="en"><head><meta charset="UTF-8"><meta name="viewport" content="width=device-width, initial-scale=1.0"><link href="assets/SP-Medical Group/assets/img/logoicon.png" rel="icon"><title>SP-Medical Group</title><style>body{align-items:center;text-align:center;justify-content:center;background-color:rgb(240,240,240);}a{color:black;}.logo{margin-top:100px;}</style></head><body><img class="logo" src="assets/SP-Medical Group/assets/img/logo.png"><br><br><br><br><br><br><br><br><br><br><br><br><a href="/login">É necessário fazer login para acessar sua página</a></body></html>');
  }
});

app.post('/register', (req, res) => {
  const { username, cpf, datanascimento, sexo, password, email, tipo } = req.body
  const verification = 'SELECT * FROM users WHERE username = ? OR cpf = ?';
  db.query(verification, [username, cpf], (verifErr, results) => {
    if (verifErr) {
      console.error('Erro no inserimento dos dados', checkErr);
    }
    if (results.length <= 0) {
      console.log(`Inserindo novo usuário no sistema com estes dados: ${username} - ${cpf}`);
      const query = 'INSERT INTO users (username, cpf, datanascimento, sexo, password, email, tipo) VALUES (?, ?, ?, ?, SHA1(?), ?, ?)';
      db.query(query, [username, cpf, datanascimento, sexo, password, email, tipo], (err, results) => {
        if (err) {
          console.error('Erro ao inserir usuário:', err);
          res.send('<!DOCTYPE html><html lang="en"><head><meta charset="UTF-8"><meta name="viewport" content="width=device-width, initial-scale=1.0"><link href="assets/SP-Medical Group/assets/img/logoicon.png" rel="icon"><title>SP-Medical Group</title><style>body{align-items:center;text-align:center;justify-content:center;background-color:rgb(240,240,240);}a{color:black;}.logo{margin-top:100px;}</style></head><body><img class="logo" src="assets/SP-Medical Group/assets/img/logo.png"><br><br><br><br><br><br><br><br><h1>ERRO!</h1><br><br><br><br><a href="/register">Erro ao cadastrar, tente novamente</a></body></html>');
        } else {
          res.send('<!DOCTYPE html><html lang="en"><head><meta charset="UTF-8"><meta name="viewport" content="width=device-width, initial-scale=1.0"><link href="assets/SP-Medical Group/assets/img/logoicon.png" rel="icon"><title>SP-Medical Group</title><style>body{align-items:center;text-align:center;justify-content:center;background-color:rgb(240,240,240);}a{color:black;}.logo{margin-top:100px;}</style></head><body><img class="logo" src="assets/SP-Medical Group/assets/img/logo.png"><br><br><br><br><br><br><br><br><h1>Obrigado por sua escolha!</h1><br><br><br><br><a href="/register">Seu cadastro foi realizado com sucesso, volte para sua página</a></body></html>');
        }
      });
    } else {
      console.log(`O cadastro com estás informações já constam no sistema: ${username} - ${cpf}`)
      res.send('<h1>Um usuário já está cadastrado com estes dados</h1><br><a href="/register">Tente Novamente</a>');
    }
  });
});

app.get('/Blog', (req,res) => {
  if (req.session.loggedin && req.session.name) {
    db.query('SELECT * FROM Blog', (err, result) => {
      if (err) throw err;
      res.render('Blog', { req: req, Blog: result });
      console.log(req.session);
    });
} else {
  // Se não estiver autenticado, redireciona para a página de login
  res.send(404, '<!DOCTYPE html><html lang="en"><head><meta charset="UTF-8"><meta name="viewport" content="width=device-width, initial-scale=1.0"><link href="assets/SP-Medical Group/assets/img/logoicon.png" rel="icon"><title>SP-Medical Group</title><style>body{align-items:center;text-align:center;justify-content:center;background-color:rgb(240,240,240);}a{color:black;}.logo{margin-top:100px;}</style></head><body><img class="logo" src="assets/SP-Medical Group/assets/img/logo.png"><br><br><br><br><br><br><br><br><br><br><br><br><a href="/login">É necessário fazer login para acessar sua página</a></body></html>');
}
});

app.post('/Blog', (req, res) => {
  const data = new Date();
  const nome = req.session.name;
  const { titulo, postagem, } = req.body;
  const query = 'INSERT INTO Blog (nome, titulo, postagem, data ) VALUES (?, ?, ?, ?)';
  db.query(query, [nome, titulo, postagem, data ], (err, results) => {
    if (err) {
      console.error('Erro ao mandar mensagem', err);
      res.redirect('/Blog')
    } else {
      res.send('<!DOCTYPE html><html lang="en"><head><meta charset="UTF-8"><meta name="viewport" content="width=device-width, initial-scale=1.0"><link href="assets/SP-Medical Group/assets/img/logoicon.png" rel="icon"><title>SP-Medical Group</title><style>body{align-items:center;text-align:center;justify-content:center;background-color:rgb(240,240,240);}a{color:black;}.logo{margin-top:100px;}</style></head><body><img class="logo" src="assets/SP-Medical Group/assets/img/logo.png"><br><br><br><br><br><br><br><br><br><br><br><br><a href="/Blog">Obrigado pela sua postagem, volte para sua página</a></body></html>');
    }
  });
});

app.get('/editblog/:id', (req, res) => {
  const id = req.params.id;
  const selectPost = 'SELECT * FROM Blog WHERE id=?';

  db.query(selectPost, [id], (err, result) => {
      if (err) {
          console.error('Erro ao recuperar post:', err);
          throw err;
      }
      // Renderiza a página de edição de post com os dados do post recuperado
      res.render('editblog', { req: req, Blog: result[0] });
  });
});

app.post('/editblog/:postid', (req, res) => {
  const postid = req.params.postid;
  const { titulo, postagem } = req.body;

  const updatePost = 'UPDATE Blog SET titulo=?, postagem=? WHERE id=?';

  db.query(updatePost, [titulo, postagem, postid], (err, result) => {
      if (err) {
          console.error('Erro ao atualizar post:', err);
          throw err;
      }
      // Redireciona para a página de exibição do post após a atualização
      res.redirect('/Blog');
  });
});

app.get('/blog/:id', (req, res) => {
  const id = req.params.id;

  db.query('DELETE FROM Blog WHERE id=?', [id], (err, row)=> {
      console.log("Selecionei a postagem de id:", id);
      res.redirect('/Blog');
  });
});

app.get('/blogadmin/:id', (req, res) => {
  const id = req.params.id;

  db.query('DELETE FROM Blog WHERE id=?', [id], (err, row)=> {
      console.log("Selecionei a postagem de id:", id);
      res.redirect('/indexadmintablepost');
  });
});


app.get('/user/:id', (req, res) => {
  const id = req.params.id;

  db.query('DELETE FROM users WHERE id=?', [id], (err, row)=> {
      console.log("Selecionei o usuário de id:", id);
      res.redirect('/indexadmin');
  });
});

app.get('/consultasadmin/:id', (req, res) => {
  const id = req.params.id;

  db.query('DELETE FROM consultas WHERE id=?', [id], (err, row)=> {
      console.log("Selecionei a consulta de id:", id);
      res.redirect('/indexadmintableconsultas');
  });
});

app.get('/consultas/:id', (req, res) => {
  const id = req.params.id;

  db.query('DELETE FROM consultas WHERE id=?', [id], (err, row)=> {
      console.log("Selecionei a consulta de id:", id);
      res.redirect('/medicopage');
  });
});

app.listen(8321, () => {
  console.log('Servidor rodando na porta 8321');
});