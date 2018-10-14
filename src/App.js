import React, { Component } from 'react';
import logo from './logo.svg';
import './App.css';
import web3 from './web3';
import crowdsale from './crowdsale.js';
import token from './token.js';
import { Progress } from 'react-sweet-progress';
import "react-sweet-progress/lib/style.css";


class App extends Component {
  state = {
    accounts: [],
    balance: '',
    message: '',
    value: '',
    weiRaised: '',
    cap: '',
    percentage: ''
    
  };

  async componentDidMount() {
    const accounts = await web3.eth.getAccounts();
    const balance = await token.methods.balanceOf(accounts[0]).call();
    const weiRaised = await crowdsale.methods.weiRaised().call();
    const cap = await crowdsale.methods.cap().call();
    const percentage = (weiRaised*100/cap).toPrecision(3);
 

    this.setState({ balance, accounts, weiRaised, cap, percentage });
  }

  onSubmit = async (event) => {
    event.preventDefault();

    this.setState({ message: 'Esperando confirmacion...'});

    await crowdsale.methods.buyTokens(this.state.accounts[0]).send({
      from: this.state.accounts[0],
      value: web3.utils.toWei(this.state.value, 'ether')
    });

    this.setState({message: 'Operacion completada !'});
  }

  render() {
    console.log(web3.version);
    
    return (
      <div className="App">
        <header className="App-header">
        <div> 
        <p>Numero de tokens que tiene: {web3.utils.fromWei(this.state.balance, 'ether')}</p>
        <p>Cantidad total de ether recaudado: {web3.utils.fromWei(this.state.weiRaised, 'ether')}</p>
        <p>Cantidad maxima de ether : {web3.utils.fromWei(this.state.cap, 'ether')}</p>
        <Progress percent={this.state.percentage}  />
        </div>

        <form onSubmit={this.onSubmit}>
          <h3>Comprar tokens</h3>
          <div>
            <label>Cantidad de ether que desea invertir: </label>
            <input 
              value={this.state.value}
              onChange={event => this.setState({ value: event.target.value })}
             /> 
          </div>
          <button>Enviar</button>
        </form>
        <h1>{this.state.message}</h1>
        </header>

      </div>

    );
  }
}

export default App;
