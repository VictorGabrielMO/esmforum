const bd = require('../bd/bd_utils.js');
const modelo = require('../modelo.js');

beforeEach(() => {
  bd.reconfig('./bd/esmforum-teste.db');
  // limpa dados de todas as tabelas
  bd.exec('delete from perguntas', []);
  bd.exec('delete from respostas', []);
});

test('Testando banco de dados vazio', () => {
  expect(modelo.listar_perguntas().length).toBe(0);
});

test('Testando cadastro de três perguntas', () => {
  modelo.cadastrar_pergunta('1 + 1 = ?');
  modelo.cadastrar_pergunta('2 + 2 = ?');
  modelo.cadastrar_pergunta('3 + 3 = ?');
  const perguntas = modelo.listar_perguntas(); 
  expect(perguntas.length).toBe(3);
  expect(perguntas[0].texto).toBe('1 + 1 = ?');
  expect(perguntas[1].texto).toBe('2 + 2 = ?');
  expect(perguntas[2].num_respostas).toBe(0);
  expect(perguntas[1].id_pergunta).toBe(perguntas[2].id_pergunta-1);
});

test('Testando cadastro de três respostas', () => {
  const id_pergunta = modelo.cadastrar_pergunta('P = NP?');
  modelo.cadastrar_resposta(id_pergunta, 'Não');
  modelo.cadastrar_resposta(id_pergunta, 'Parece que Não');
  modelo.cadastrar_resposta(id_pergunta, 'Sim');
  const perguntas = modelo.listar_perguntas(); 
  expect(perguntas[0].num_respostas).toBe(3);
});
test('Testando o get de duas perguntas.', () => {
  const pergunta1_input = 'O que veio primeiro: o ovo ou a galinha?';
  const pergunta2_input = 'No ceu tem pão?';
  const id_pergunta1 = modelo.cadastrar_pergunta(pergunta1_input);
  const id_pergunta2 = modelo.cadastrar_pergunta(pergunta2_input);
  const pergunta1_obj = modelo.get_pergunta(id_pergunta1);
  const pergunta2_obj = modelo.get_pergunta(id_pergunta2);
  expect(pergunta1_obj.texto).toBe(pergunta1_input);
  expect(pergunta2_obj.texto).toBe(pergunta2_input);
});

test('Testando o get de três respostas', () => {
  const pergunta_input = 'Quanto é 9 ao quadrado?';
  const id_pergunta = modelo.cadastrar_pergunta(pergunta_input);
  modelo.cadastrar_resposta(id_pergunta, '81');
  modelo.cadastrar_resposta(id_pergunta, 'Obviamente 81');
  modelo.cadastrar_resposta(id_pergunta, '72');
  const respostas = modelo.get_respostas(id_pergunta);
  expect(respostas.length).toBe(3);
  expect(respostas[0].texto).toBe('81');
  expect(respostas[1].texto).toBe('Obviamente 81');
  expect(respostas[2].texto).toBe('72');
});