class Despesa {
    constructor(ano, mes, dia, tipo, descricao, valor) {
        this.ano = ano
        this.mes = mes
        this.dia = dia
        this.tipo = tipo
        this.descricao = descricao
        this.valor = valor
    }

    validarDados() {
        for (let i in this) {
            if (this[i] === null || this[i] === undefined || this[i] === "") {
                return false
            }
        }
        return true
    }

}

class BancoDados {

    constructor() {
        let id = localStorage.getItem('id')
        if (id === null) {
            localStorage.setItem('id', 0)
        }
    }

    getId() {
        let getId = localStorage.getItem('id')
        return parseInt(getId) + 1
    }


    gravar(d) {
        let id = this.getId()
        localStorage.setItem(id, JSON.stringify(d))

        localStorage.setItem('id', id)
    }

    recuperarTodosRegistros() {
        let id = localStorage.getItem("id")

        let despesas = Array()

        //recuperar no formato JSON
        for (let i = 1; i <= id; i++) {

            let despesa = JSON.parse(localStorage.getItem(i))
            if (despesa === null) {
                continue
            }

            despesa.id = i
            despesas.push(despesa)
        }

        return despesas
    }

    pesquisarDespesa(d) {
        let todasDespesas = Array()
        let despesasFiltradas = Array()

        todasDespesas = this.recuperarTodosRegistros()

        console.log(todasDespesas)

        //ano
        if (d.ano != '') {
            despesasFiltradas = todasDespesas.filter(despesa => despesa.ano == d.ano)
        }

        //dia
        if (d.dia != '') {
            despesasFiltradas = todasDespesas.filter(despesa => despesa.dia == d.dia)
        }

        //mes
        if (d.mes != '') {
            despesasFiltradas = todasDespesas.filter(despesa => despesa.mes == d.mes)
        }

        //tipo
        if (d.tipo != '') {
            despesasFiltradas = todasDespesas.filter(despesa => despesa.tipo == d.tipo)
        }

        //descricao
        if (d.descricao != '') {
            despesasFiltradas = todasDespesas.filter(despesa => despesa.descricao == d.descricao)
        }

        //valor
        if (d.descricao != '') {
            despesasFiltradas = todasDespesas.filter(despesa => despesa.valor == d.valor)
        }

        console.log(despesasFiltradas)

        recuperarDados(despesasFiltradas)
    }

    removerDespesa(id_key) {
        localStorage.removeItem(id_key)
        recuperarDados()
    }
}

class Saldo {
    constructor() {
        this.saldo
        this.novoSaldo
        this.valorAdicionar

    }

    adicionarSaldo() {
        this.valorAdicionar = document.getElementById("valor_a_adicionar").value

        if (this.valorAdicionar === "") {
            this.valorAdicionar = 0
        } else {
            this.valorAdicionar = parseInt(document.getElementById("valor_a_adicionar").value)
        }

        let saldoExistente = parseInt(localStorage.getItem("saldo"))
        this.saldo = this.valorAdicionar + saldoExistente

        localStorage.setItem("saldo", this.saldo)

        //limpar campo onde adiciona valores
        this.valorAdicionar = document.getElementById("valor_a_adicionar").value = 0

    }

    descontarSaldo(desconto) {

        let valorDescontar

        if (desconto === "") {
            valorDescontar = 0
        } else {
            valorDescontar = desconto
        }

        let saldoExistente = parseInt(localStorage.getItem("saldo"))
        this.saldo = saldoExistente - valorDescontar

        localStorage.setItem("saldo", this.saldo)

        console.log(this.saldo)

    }

    resgatarSaldo() {
        let saldoFormatado = new Intl.NumberFormat('pt-BR', { style: 'currency', currency: 'BRL' }).format(this.saldo)
        let lado_cliente = document.getElementById("saldo")
        lado_cliente.innerHTML = saldoFormatado
    }
}



function cadastrarDespesa() {
    //capturando os valores digitados
    let ano = document.getElementById("ano")
    let mes = document.getElementById("mes")
    let dia = document.getElementById("dia")
    let tipo = document.getElementById("tipo")
    let descricao = document.getElementById("descricao")
    let valor = document.getElementById("valor")

    let despesa = new Despesa(
        ano.value,
        mes.value,
        dia.value,
        tipo.value,
        descricao.value,
        valor.value
    )

    //validando informações
    if (despesa.validarDados() === true) {
        gravarBd.gravar(despesa)
        alert("Você inseriu um novo registro com sucesso!")

        //mandar o valor a descontar do saldo total
        saldo.descontarSaldo(valor.value)
        saldo.resgatarSaldo()

        //limpar campos
        document.getElementById("dia").value = ""
        document.getElementById("mes").value = ""
        document.getElementById("ano").value = ""
        document.getElementById("tipo").value = ""
        document.getElementById("descricao").value = ""
        document.getElementById("valor").value = ""
    } else {
        alert("Não foi preenchido todos os campos obrigatórios!")
    }



}

let gravarBd = new BancoDados()

function recuperarDados(despesas = Array()) {

    if (despesas.length == 0) {
        despesas = gravarBd.recuperarTodosRegistros()
    }


    //selecionando elemento TBODY
    let tabela_cliente = document.getElementById("listaDespesas")
    tabela_cliente.innerHTML = ""
        /*
            <tr>
                <td>15/01/2021</td>
                <td>Alimentação</td>
                <td>Burger King</td>
                <td>15.99</td>
                <td></td>
            </tr>
        */

    despesas.forEach(function(d) {


        //criar linha
        let linha = tabela_cliente.insertRow()


        //criar coluna
        linha.insertCell(0).innerHTML = d.dia + "/" + d.mes + "/" + d.ano
        linha.insertCell(1).innerHTML = d.tipo
        linha.insertCell(2).innerHTML = d.descricao
        linha.insertCell(3).innerHTML = d.valor

        //botao para excluir registros
        let btn_remove = document.createElement('button')
        btn_remove.className = "btn btn-danger"
        btn_remove.innerHTML = "Remover"
        btn_remove.id = 'id_despesa_' + d.id
        btn_remove.onclick = function() {

            let registro_remover = this.id.substr(11, 15)

            gravarBd.removerDespesa(registro_remover)

            document.getElementById()

        }
        linha.insertCell(4).appendChild(btn_remove)
    });


}

function pesquisarDespesas() {

    let dia = document.getElementById("dia").value
    let mes = document.getElementById("mes").value
    let ano = document.getElementById("ano").value
    let tipo = document.getElementById("tipo").value
    let descricao = document.getElementById("descricao").value
    let valor = document.getElementById("valor").value

    let despesa = new Despesa(ano, mes, dia, tipo, descricao, valor)

    gravarBd.pesquisarDespesa(despesa)

}

//adicionando um novo saldo para o usuário

/*function mostrarInput() {
    document.getElementById("valor_a_adicionar").className = "mostrarInput"
}

function esconderInput() {
    document.getElementById("valor_a_adicionar").className = "esconderInput"

}*/

let saldo = new Saldo()

function adicionarSaldo() {
    saldo.adicionarSaldo()
    saldo.resgatarSaldo()
}

function onloadPage() {

    if (localStorage.getItem('saldo') === null) {
        localStorage.setItem('saldo', 0)
    }

    let saldo_lado_cliente = document.getElementById("saldo")
    let saldo = localStorage.getItem('saldo')

    let saldoFormatado = new Intl.NumberFormat('pt-BR', { style: 'currency', currency: 'BRL' }).format(saldo)

    saldo_lado_cliente.innerHTML = saldoFormatado

}