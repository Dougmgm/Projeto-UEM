import streamlit as st
import matplotlib.pyplot as plt
import pandas as pd
import json

# Carregar dados dos JSONs
with open('clientes.json') as f:
    clientes_data = json.load(f)

with open('produtos.json') as f:
    produtos_data = json.load(f)

# Converter JSONs em DataFrames
clientes_df = pd.DataFrame(clientes_data)
produtos_df = pd.DataFrame(produtos_data)

# Inicializar as variáveis de estado para controlar a visibilidade de cada análise
if 'mostrar_analise' not in st.session_state:
    st.session_state.mostrar_analise = None  # Nenhuma análise exibida inicialmente

# Inicializar a variável de estado para controlar a visibilidade dos botões
if 'mostrar_botoes' not in st.session_state:
    st.session_state.mostrar_botoes = False  # Botões ocultos inicialmente

# Inicializar a variável de estado para controlar a visibilidade dos botões de produto
if 'mostrar_botoes_produtos' not in st.session_state:
    st.session_state.mostrar_botoes_produtos = False  # Botões de produtos ocultos inicialmente

# Inicializar a variável de estado para a análise de produtos
if 'mostrar_analise_produtos' not in st.session_state:
    st.session_state.mostrar_analise_produtos = None  # Nenhuma análise de produtos exibida inicialmente

# Funções para exibir uma análise e ocultar as outras
def mostrar_analise(analise):
    st.session_state.mostrar_analise = analise

# Função para alternar a visibilidade dos botões
def alternar_botoes():
    st.session_state.mostrar_botoes = not st.session_state.mostrar_botoes
    if not st.session_state.mostrar_botoes:
        st.session_state.mostrar_analise = None  # Ocultar gráficos quando os botões são ocultados

# Função para alternar a visibilidade dos botões de produtos
def alternar_botoes_produtos():
    st.session_state.mostrar_botoes_produtos = not st.session_state.mostrar_botoes_produtos
    if not st.session_state.mostrar_botoes_produtos:
        st.session_state.mostrar_analise_produtos = None  # Ocultar gráficos de produtos quando os botões são ocultados

# Botão para exibir/ocultar os botões de análise
if st.button("Clientes"):
    alternar_botoes()

# Botão para exibir/ocultar os botões de produtos
if st.button("Produtos"):
    alternar_botoes_produtos()

# Condicional para mostrar/ocultar os botões de análise
if st.session_state.mostrar_botoes:
    if st.button("Mostrar Análise por Sexo"):
        mostrar_analise('sexo')

    if st.button("Mostrar Análise por Estado Civil"):
        mostrar_analise('estado_civil')

    if st.button("Mostrar Análise Temporal"):
        mostrar_analise('temporal')

# Exibir a análise conforme a escolha do usuário, se os botões estiverem visíveis
if st.session_state.mostrar_botoes and st.session_state.mostrar_analise == 'sexo':
    st.header("Distribuição por Sexo")
    sexo_counts = clientes_df['sexo'].value_counts()
    st.bar_chart(sexo_counts)

    # Visualização detalhada com Matplotlib
    fig, ax = plt.subplots()
    sexo_counts.plot(kind='bar', color=['blue', 'pink'], ax=ax)
    ax.set_title('Distribuição por Sexo')
    ax.set_xlabel('Sexo')
    ax.set_ylabel('Número de Clientes')
    st.pyplot(fig)

elif st.session_state.mostrar_botoes and st.session_state.mostrar_analise == 'estado_civil':
    st.header("Distribuição por Estado Civil")
    estado_civil_counts = clientes_df['estadoCivil'].value_counts()
    st.bar_chart(estado_civil_counts)

    # Visualização detalhada com Matplotlib
    fig, ax = plt.subplots()
    estado_civil_counts.plot(kind='bar', color='lightgreen', ax=ax)
    ax.set_title('Distribuição por Estado Civil')
    ax.set_xlabel('Estado Civil')
    ax.set_ylabel('Número de Clientes')
    st.pyplot(fig)

elif st.session_state.mostrar_botoes and st.session_state.mostrar_analise == 'temporal':
    st.header("Análise Temporal")
    clientes_df['dataCadCli'] = pd.to_datetime(clientes_df['dataCadCli'], format='%d/%m/%Y')
    cadastros_por_ano = clientes_df['dataCadCli'].dt.year.value_counts().sort_index()
    st.line_chart(cadastros_por_ano)

    # Visualização detalhada com Matplotlib
    fig, ax = plt.subplots()
    cadastros_por_ano.plot(kind='line', marker='o', ax=ax)
    ax.set_title('Número de Cadastros por Ano')
    ax.set_xlabel('Ano')
    ax.set_ylabel('Número de Cadastros')
    ax.grid(True)
    st.pyplot(fig)

# Condicional para mostrar/ocultar os botões de produtos
if st.session_state.mostrar_botoes_produtos:
    if st.button("Mostrar Análise por Preço"):
        st.session_state.mostrar_analise_produtos = 'preco'

    if st.button("Mostrar Análise por Estoque"):
        st.session_state.mostrar_analise_produtos = 'estoque'

# Exibir a análise de produtos conforme a escolha do usuário, se os botões de produtos estiverem visíveis
if st.session_state.mostrar_botoes_produtos and st.session_state.mostrar_analise_produtos == 'preco':
    st.header("Distribuição de Preços")
    # Preparar dados para o gráfico
    produtos_df_sorted = produtos_df.sort_values('descProduto')
    fig, ax = plt.subplots()
    ax.bar(produtos_df_sorted['descProduto'], produtos_df_sorted['precoProduto'], color='coral')
    ax.set_title('Distribuição de Preços dos Produtos')
    ax.set_xlabel('Produto')
    ax.set_ylabel('Preço')
    ax.tick_params(axis='x', rotation=45)
    st.pyplot(fig)

elif st.session_state.mostrar_botoes_produtos and st.session_state.mostrar_analise_produtos == 'estoque':
    st.header("Distribuição do Estoque")
    # Preparar dados para o gráfico
    produtos_df_sorted = produtos_df.sort_values('descProduto')
    fig, ax = plt.subplots()
    ax.bar(produtos_df_sorted['descProduto'], produtos_df_sorted['qtdEstoqueProd'], color='gold')
    ax.set_title('Distribuição do Estoque dos Produtos')
    ax.set_xlabel('Produto')
    ax.set_ylabel('Quantidade em Estoque')
    ax.tick_params(axis='x', rotation=45)
    st.pyplot(fig)
