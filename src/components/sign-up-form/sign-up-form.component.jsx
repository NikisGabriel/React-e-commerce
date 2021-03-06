import { SignUpContainer } from "./sign-up-form.style";

//import de componentes
import Button from "../button/button.component";
import FormInput from "../form-input/form-input.component";

import { useState } from "react";

//import da função de criação utilizando form, vinda do firebase utils
import { createAuthUserWithEmailAndPassword, createUserDocumentFromAuth } from "../../utils/firebase/firebase.utils";

//importe da lista de erros
import { LIST_ERRORS } from "../../utils/firebase/list-errors";

//criando um objeto padrão dos compos do form
const defaultFormsFields = {
  name: "",
  email: "",
  password: "",
  passwordConfirm: "",
};

const SignUpForm = () => {
  // usando o objeto criado para iniciar o state 'formsFields'
  const [formsFields, setFormsFields] = useState(defaultFormsFields);
  //desestruturando objeto para facilitar a manipulação
  const { name, email, password, passwordConfirm } = formsFields;

  //função para resetar ao estado padrão os campos do form
  const resetFormsFields = () => setFormsFields(defaultFormsFields);

  //criação da função para executar sempre que ocorrer um submit, criando a autenticação do user se o processo estiver correto
  //assíncrona pois vai gravar na BD
  const handleSubmit = async (event) => {
    //previvir execuções padrões como atualização da pagina por submit
    event.preventDefault();

    //conformação de senhas iguais
    if (password !== passwordConfirm) {
      alert(LIST_ERRORS.senhasDiferente);
    }

    //prevenção contra erros ao criar user
    try {
      //chamando método importado para criar autenticação do usuário
      const response = await createAuthUserWithEmailAndPassword(email, password); // assíncrono
      //usando método para gravar na BD o user
      await createUserDocumentFromAuth({ ...response.user, displayName: name }); //- assíncrono

      // ####### utilização context #######
      // desativado para utilização do observe
      // setCurrentUser(user);

      resetFormsFields();
    } catch (error) {
      //erros
      alert(LIST_ERRORS[error.code]);
    }
  };

  //funções executada sempre que um input é alterado
  const handleChange = (event) => {
    //pegando o name e value do elemento que realizou o evento
    const { name, value } = event.target;
    //setando o valor baseado nos campos que dispararam o event
    //rest para espalhar os valores que já estavam e depois a chave que foi alterada pelo event
    //usando o operado '[]' pode-se usar uma var para indicar o 'nome' de outra
    setFormsFields({ ...formsFields, [name]: value });
  };

  //inputs recebem a função do change, o nome para possibilitar um correta edição usando o name que 'handleChange' recebe pelo event, e o value para que o valor dentro do campo esteja atrelado ao state que doi desconstruído
  return (
    <SignUpContainer>
      <h2>Não possui uma conta?</h2>
      <span>Inscreva-se com seu E-mail e senha</span>
      <form onSubmit={handleSubmit}>
        <FormInput label="Nome" type="text" required onChange={handleChange} name="name" value={name} />
        <FormInput label="E-mail" type="email" required onChange={handleChange} name="email" value={email} />
        <FormInput label="Senha" type="password" required onChange={handleChange} name="password" value={password} />
        <FormInput
          label="Confirme sua senha"
          type="password"
          required
          onChange={handleChange}
          name="passwordConfirm"
          value={passwordConfirm}
        />
        <Button type="submit">Inscreva-se</Button>
      </form>
    </SignUpContainer>
  );
};

export default SignUpForm;
