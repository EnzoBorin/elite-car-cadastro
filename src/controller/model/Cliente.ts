import { DatabaseModel } from "./DatabaseModel";

// armazenei o pool de conexões
const database = new DatabaseModel().pool;

/**
 * Classe que representa um carro.
 */
export class Carro {

    /* Atributos */
    /* Identificador do carro */
    private idCarro: number = 0;
    /* marca do carro */
    private marca: string;
    /* modelo do carro */
    private modelo: string;
    /* ano de fabrição do carro */
    private ano: number;
    /* cor do carro */
    private cor: string;

    /**
     * Construtor da classe Carro
     * 
     * @param marca Marca do carro
     * @param modelo Modelo do carro
     * @param ano Ano de fabricação do carro
     * @param cor Cor do carro
     */
    constructor(
        marca: string,
        modelo: string,
        ano: number,
        cor: string
    ) {
        this.marca = marca;
        this.modelo = modelo;
        this.ano = ano;
        this.cor = cor;
    }

    /* Métodos get e set */
    /**
     * Recupera o identificador do carro
     * @returns o identificador do carro
     */
    public getIdCarro(): number {
        return this.idCarro;
    }

    /**
     * Atribui um valor ao identificador do carro
     * @param idCarro novo identificado do carro
     */
    public setIdCarro(idCarro: number): void {
        this.idCarro = idCarro;
    }

    /**
     * Retorna a marca do carro.
     *
     * @returns {string} A marca do carro.
     */
    public getMarca(): string {
        return this.marca;
    }

    /**
     * Define a marca do carro.
     * 
     * @param marca - A marca do carro a ser definida.
     */
    public setMarca(marca: string): void {
        this.marca = marca;
    }

    /**
     * Retorna o modelo do carro.
     *
     * @returns {string} O modelo do carro.
     */
    public getModelo(): string {
        return this.modelo;
    }

    /**
     * Define o modelo do carro.
     *
     * @param modelo - O nome do modelo do carro.
     */
    public setModelo(modelo: string): void {
        this.modelo = modelo;
    }

    /**
     * Retorna o ano do carro.
     *
     * @returns O ano do carro.
     */
    public getAno(): number {
        return this.ano;
    }

    /**
     * Define o ano do carro.
     * 
     * @param ano - O ano a ser definido para o carro.
     */
    public setAno(ano: number): void {
        this.ano = ano;
    }

    /**
     * Retorna a cor do carro.
     *
     * @returns {string} A cor do carro.
     */
    public getCor(): string {
        return this.cor;
    }

    /**
     * Define a cor do carro.
     * 
     * @param cor - A nova cor do carro.
     */
    public setCor(cor: string): void {
        this.cor = cor;
    }

    /**
     * Busca e retorna uma lista de carros do banco de dados.
     * @returns Um array de objetos do tipo `Carro` em caso de sucesso ou `null` se ocorrer um erro durante a consulta.
     * 
     * - A função realiza uma consulta SQL para obter todas as informações da tabela "carro".
     * - Os dados retornados do banco de dados são usados para instanciar objetos da classe `Carro`.
     * - Cada carro é adicionado a uma lista que será retornada ao final da execução.
     * - Se houver falha na consulta ao banco, a função captura o erro, exibe uma mensagem no console e retorna `null`.
     */
    static async listagemCarros(): Promise<Array<Carro> | null> {
        // objeto para armazenar a lista de carros
        const listaDeCarros: Array<Carro> = [];

        try {
            // query de consulta ao banco de dados
            const querySelectCarro = `SELECT * FROM carro;`;

            // fazendo a consulta e guardando a resposta
            const respostaBD = await database.query(querySelectCarro);

            // usando a resposta para instanciar um objeto do tipo carro
            respostaBD.rows.forEach((linha) => {
                // instancia (cria) objeto carro
                const novoCarro = new Carro(
                    linha.marca,
                    linha.modelo,
                    linha.ano,
                    linha.cor
                );

                // atribui o ID objeto
                novoCarro.setIdCarro(linha.id_carro);

                // adiciona o objeto na lista
                listaDeCarros.push(novoCarro);
            });

            // retorna a lista de carros
            return listaDeCarros;
        } catch (error) {
            console.log('Erro ao buscar lista de carros');
            return null;
        }
    }

    /**
     * Realiza o cadastro de um carro no banco de dados.
     * 
     * Esta função recebe um objeto do tipo `Carro` e insere seus dados (marca, modelo, ano e cor)
     * na tabela `carro` do banco de dados. O método retorna um valor booleano indicando se o cadastro 
     * foi realizado com sucesso.
     * 
     * @param {Carro} carro - Objeto contendo os dados do carro que será cadastrado. O objeto `Carro`
     *                        deve conter os métodos `getMarca()`, `getModelo()`, `getAno()` e `getCor()`
     *                        que retornam os respectivos valores do carro.
     * @returns {Promise<boolean>} - Retorna `true` se o carro foi cadastrado com sucesso e `false` caso contrário.
     *                               Em caso de erro durante o processo, a função trata o erro e retorna `false`.
     * 
     * @throws {Error} - Se ocorrer algum erro durante a execução do cadastro, uma mensagem de erro é exibida
     *                   no console junto com os detalhes do erro.
     */
    static async cadastroCarro(carro: Carro): Promise<boolean> {
        try {
            // query para fazer insert de um carro no banco de dados
            const queryInsertCarro = `INSERT INTO carro (marca, modelo, ano, cor)
                                        VALUES
                                        ('${carro.getMarca()}', 
                                        '${carro.getModelo()}', 
                                        ${carro.getAno()}, 
                                        '${carro.getCor()}')
                                        RETURNING id_carro;`;

            // executa a query no banco e armazena a resposta
            const respostaBD = await database.query(queryInsertCarro);

            // verifica se a quantidade de linhas modificadas é diferente de 0
            if (respostaBD.rowCount != 0) {
                console.log(`Carro cadastrado com sucesso! ID do carro: ${respostaBD.rows[0].id_carro}`);
                // true significa que o cadastro foi feito
                return true;
            }
            // false significa que o cadastro NÃO foi feito.
            return false;

            // tratando o erro
        } catch (error) {
            // imprime outra mensagem junto com o erro
            console.log('Erro ao cadastrar o carro. Verifique os logs para mais detalhes.');
            // imprime o erro no console
            console.log(error);
            // retorno um valor falso
            return false;
        }
    }

    import { DatabaseModel } from "./DatabaseModel";

// A classe "PedidoVenda" representa um pedido de venda no sistema.
export class PedidoVenda {
    // Atributos da classe "PedidoVenda"
    private idPedido: number = 0;  // Identificador único do pedido
    private idCarro: number;       // Identificador do carro associado ao pedido
    private idCliente: number;     // Identificador do cliente associado ao pedido
    private dataPedido: Date;      // Data do pedido de venda
    private valorPedido: number;   // Valor total do pedido

    /**
     * Construtor da classe "PedidoVenda"
     * 
     * @param idCarro - Identificador do carro associado ao pedido
     * @param idCliente - Identificador do cliente associado ao pedido
     * @param dataPedido - Data do pedido de venda
     * @param valorPedido - Valor total do pedido
     */
    constructor(idCarro: number, idCliente: number, dataPedido: Date, valorPedido: number) {
        this.idCarro = idCarro;
        this.idCliente = idCliente;
        this.dataPedido = dataPedido;
        this.valorPedido = valorPedido;
    }

    // Métodos getters e setters para acessar e modificar os atributos
    public getIdPedido(): number {
        return this.idPedido;
    }

    public setIdPedido(idPedido: number): void {
        this.idPedido = idPedido;
    }

    public getIdCarro(): number {
        return this.idCarro;
    }

    public setIdCarro(idCarro: number): void {
        this.idCarro = idCarro;
    }

    public getIdCliente(): number {
        return this.idCliente;
    }

    public setIdCliente(idCliente: number): void {
        this.idCliente = idCliente;
    }

    public getDataPedido(): Date {
        return this.dataPedido;
    }

    public setDataPedido(dataPedido: Date): void {
        this.dataPedido = dataPedido;
    }

    public getValorPedido(): number {
        return this.valorPedido;
    }

    public setValorPedido(valorPedido: number): void {
        this.valorPedido = valorPedido;
    }

    /**
     * Busca uma lista de pedidos de venda no banco de dados.
     * 
     * @returns Uma lista de objetos do tipo "PedidoVenda" ou null se ocorrer um erro.
     */
    static async listagemPedidos(): Promise<Array<PedidoVenda> | null> {
        const listaDePedidos: Array<PedidoVenda> = [];

        try {
            const querySelectPedidos = `SELECT * FROM pedido_venda;`;
            const respostaBD = await database.query(querySelectPedidos);

            respostaBD.rows.forEach((linha) => {
                // Criando um novo objeto PedidoVenda com os dados do banco
                const novoPedidoVenda = new PedidoVenda(
                    linha.id_carro,
                    linha.id_cliente,
                    new Date(linha.data_pedido), // Conversão para objeto Date
                    parseFloat(linha.valor_pedido)
                );

                // Atribui o ID do pedido ao objeto recém-criado
                novoPedidoVenda.setIdPedido(linha.id_pedido);

                // Adiciona o pedido à lista
                listaDePedidos.push(novoPedidoVenda);
            });

            return listaDePedidos;
        } catch (error) {
            console.log('Erro ao buscar lista de pedidos:', error);
            return null;
        }
    }

    /**
     * Insere um novo pedido de venda no banco de dados.
     * 
     * @returns `true` se o pedido foi inserido com sucesso, `false` caso contrário.
     */
    public async cadastrarPedido(): Promise<boolean> {
        try {
            const queryInsertPedido = `
                INSERT INTO pedido_venda (id_carro, id_cliente, data_pedido, valor_pedido)
                VALUES (${this.getIdCarro()}, ${this.getIdCliente()}, '${this.getDataPedido().toISOString()}', ${this.getValorPedido()})
                RETURNING id_pedido;
            `;

            const respostaBD = await database.query(queryInsertPedido);

            if (respostaBD.rowCount > 0) {
                this.setIdPedido(respostaBD.rows[0].id_pedido);
                console.log(`Pedido cadastrado com sucesso! ID do pedido: ${this.getIdPedido()}`);
                return true;
            }
            return false;
        } catch (error) {
            console.log('Erro ao cadastrar pedido:', error);
            return false;
        }
    }
}

// Exemplo de uso da classe PedidoVenda
(async () => {
    // Criando um novo pedido de venda
    const novoPedido = new PedidoVenda(1, 1, new Date(), 10000.50);
    
    // Cadastrando o novo pedido
    const sucesso = await novoPedido.cadastrarPedido();

    if (sucesso) {
        console.log('Pedido de venda cadastrado com sucesso.');
    }

    // Listando os pedidos cadastrados
    const pedidos = await PedidoVenda.listagemPedidos();
    if (pedidos) {
        pedidos.forEach(pedido => {
            console.log(`ID do Pedido: ${pedido.getIdPedido()}, Valor: ${pedido.getValorPedido()}`);
        });
    }
})();

}