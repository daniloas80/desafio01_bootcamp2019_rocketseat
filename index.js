const express = require('express');
const server = express();
server.use(express.json());

//const projects = ['nodejs', 'reactjs', 'react native'];
const projects = [{
        "id": "1",
        "title": "nodejs",
        "tasks": []
    },
    {
        "id": "2",
        "title": "React",
        "tasks": []
    }
];

let conta_requisicoes = 0;
//middleware global
server.use((req, res, next) => {
   
    conta_requisicoes += 1;
    console.log('Total de requições até o momento ' + conta_requisicoes);

    next();
})
//middleware local
function checkTitleProject (req, res, next) {
    if (!req.body.title) {
        return res.status(400).json({error: 'Título é obrigatório'});
    }
    return next();
}
//middleware para checar se o usuário digitou um index existente
function checkTitleInArray(req, res, next) {
    const projectId = projects[req.params.id];
    if (!projectId) {
        return res.status(400).json({error: 'Projeto não encontrado'});
    }
    req.projectId = projectId;
    return next();
}
//rora para trazer todos os projetos
server.get('/projects', (req, res) => {
    return res.json(projects);        
})
//rota para trazer um projeto específico
server.get('/projects/:id', checkTitleInArray, (req, res) => {
    //também funciona com as duas linhas comentadas abaixo
    // const { id } = req.params;
    // return res.json(projects[id]);
    return res.json(req.projectId);
})
//rota para gravar um novo projeto
server.post('/projects', checkTitleProject, (req, res) => {
    const { id, title } = req.body;
    projects.push({ 'id': id, 'title': title, 'tasks':[]});
    return res.json(projects);
   //console.log(req.body);
})
//rota para gravar uma nova tarefa para um determinado projeto
server.post('/projects/:id/tasks', checkTitleInArray, (req, res) => {
    const { id } = req.params;
    const { title } = req.body;

    projects[id].tasks.push(title);

    return res.json(projects);
})
//também posso fazer com o código abaixo para acrescentar uma tarefa a um projeto
server.put('/projects/:id/tasks', checkTitleInArray, (req, res) => {
    const { id } = req.params;
    const { title } = req.body;

    projects[id].tasks = [title];

    return res.json(projects);
})
//rota para dar um update num determinado projeto
server.put('/projects/:id', checkTitleInArray, checkTitleProject, (req, res) => {
    const { id } = req.params;
    const { title } = req.body;

    projects[id].title = title;

    return res.json(projects);
})
// rota para deletar um determinado projeto
server.delete('/projects/:id', checkTitleInArray, (req, res) => {
    const { id } = req.params;
    
    projects.splice(id, 1);
    
    return res.send();
})
server.listen(3000);