import React, {Component} from 'react';
import {Link} from 'react-router-dom';
import axios from 'axios';
import swal from 'sweetalert';
import { IMaskInput } from "react-imask";

class EditarAluno extends Component 
{
    genero = {
        masculino: 'Masculino',
        feminino: 'Feminino'
      };

    state = {
        nome: '',
        telefone: '',
        e_mail: '',
        data_de_nascimento: '',
        genero: '',
        error_list: [],
    }

    handleInput = (e) => {
        this.setState({
            [e.target.name]: e.target.value
        });
    }
    
    async componentDidMount() {
        const stud_id = this.props.match.params.id;

        const res = await axios.get(`http://localhost:8000/api/alunos/${stud_id}`);

        if (res.data.status === 200) 
        {
            this.setState({
                nome: res.data.student.nome,
                telefone: res.data.student.telefone,
                e_mail: res.data.student.e_mail,
                data_de_nascimento: res.data.student.data_de_nascimento,
                genero: res.data.student.genero,
            })
        }
        else if(res.data.status === 404)
        {
            swal({
                title: "Alerta!",
                text: res.data.message,
                icon: "warning",
                buttons: "OK"
            });
            this.props.history.push('/');
        }
    }

    updateAluno = async (e) => {
        e.preventDefault();

        document.getElementById('updatebtn').disabled = true;
        document.getElementById('updatebtn').innerText = "Atualizando os dados";
        const stud_id = this.props.match.params.id;
        const res = await axios.put(`http://localhost:8000/api/alunos/${stud_id}`, this.state);

        if(res.data.status === 204)
        {
            swal({
                title: "Atualizado!",
                text: res.data.message,
                icon: "success",
                buttons: "OK"
            })

            document.getElementById('updatebtn').disabled = false;
            document.getElementById('updatebtn').innerText = "Atualizando os dados";
            this.props.history.push('/alunos');
        } 
        else if (res.data.status === 404)
        {
            swal({
                title: "Warning!",
                text: res.data.message,
                icon: "warning",
                buttons: "OK"
            });
            this.props.history.push('/alunos');
        } else 
        {
            this.setState({
                error_list: res.data.validate_err,
            })
            document.getElementById('updatebtn').disabled = false;
            document.getElementById('updatebtn').innerText = "Atualizando os dados";
        }
    }

    render() {
        return (
            <div className="container">
                <div className="row">
                    <div className="col-md-6">
                        <div className="card">
                            <div className="card-header">
                                <h2>Editar Aluno
                                    <Link to={'/alunos'} className="btn btn-danger btn-sm float-end">Fechar</Link>
                                </h2>
                            </div>
                            <div className="card-body">
                                <form onSubmit={this.updateAluno}>
                                    <div className="form-group mb-3">
                                        <label>Nome</label>
                                        <input type="text" name="nome" onChange={this.handleInput} value={this.state.nome} class="form-control"></input>
                                        <span className="text-danger">{this.state.error_list.nome}</span>
                                    </div>
                                    <div className="form-group mb-3">
                                        <label>Telefone</label>
                                        <IMaskInput mask="(000) 00000-0000" type="text" name="telefone" onChange={this.handleInput} value={this.state.telefone} class="form-control"/>
                                        <span className="text-danger">{this.state.error_list.telefone}</span>
                                    </div>
                                    <div className="form-group mb-3">
                                        <label>E-mail</label>
                                        <input type="email" name="e_mail" onChange={this.handleInput} value={this.state.e_mail} class="form-control"></input>
                                        <span className="text-danger">{this.state.error_list.e_mail}</span>
                                    </div>
                                    <div className="form-group mb-3">
                                        <label>Data de Nascimento</label>
                                        <input type="date" name="data_de_nascimento" onChange={this.handleInput} value={this.state.data_de_nascimento} class="form-control"></input>
                                        <span className="text-danger">{this.state.error_list.data_de_nascimento}</span>
                                    </div>
                                    <div className="form-group mb-3">
                                        <label>Gênero</label>
                                        <select type="text" name="genero" onChange={this.handleInput} value={this.state.genero} class="form-control">
                                        <option value="{this.state.genero}">{this.state.genero}</option>
                                           <option value="Masculino">Masculino</option>
                                           <option value="Feminino">Feminino</option>
                                           <option value="Outro">Outro</option>
                                        </select>
                                        <span className="text-danger">{this.state.error_list.genero}</span>
                                    </div>
                                    <div className="form-group mb-3">
                                        <button type="submit" id="updatebtn" className="btn btn-primary mt-4">Atualizar</button>
                                    </div>
                                </form>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        )
    }
}

export default EditarAluno