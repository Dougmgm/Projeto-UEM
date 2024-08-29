import streamlit as st
import matplotlib.pyplot as plt
import pandas as pd
import json

# Carregar dados do JSON
with open('clientes.json') as f:
    data = json.load(f)

# Converter JSON em DataFrame
df = pd.DataFrame(data)

# Inicializar as variáveis de estado para controlar a visibilidade de cada análise
if 'mostrar_analise' not in st.session_state:
    st.session_state.mostrar_analise = None  # Nenhuma análise exibida inicialmente

# Inicializar a variável de estado para controlar a visibilidade dos botões
if 'mostrar_botoes' not in st.session_state:
    st.session_state.mostrar_botoes = False  # Botões ocultos inicialmente

# Funções para exibir uma análise e ocultar as outras
def mostrar_analise(analise):
    st.session_state.mostrar_analise = analise

# Função para alternar a visibilidade dos botões
def alternar_botoes():
    st.session_state.mostrar_botoes = not st.session_state.mostrar_botoes
    if not st.session_state.mostrar_botoes:
        st.session_state.mostrar_analise = None  # Ocultar gráficos quando os botões são ocultados

# Botão para exibir/ocultar os botões de análise
if st.button("Clientes"):
    alternar_botoes()

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
    sexo_counts = df['sexo'].value_counts()
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
    estado_civil_counts = df['estadoCivil'].value_counts()
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
    df['dataCadCli'] = pd.to_datetime(df['dataCadCli'], format='%d/%m/%Y')
    cadastros_por_ano = df['dataCadCli'].dt.year.value_counts().sort_index()
    st.line_chart(cadastros_por_ano)

    # Visualização detalhada com Matplotlib
    fig, ax = plt.subplots()
    cadastros_por_ano.plot(kind='line', marker='o', ax=ax)
    ax.set_title('Número de Cadastros por Ano')
    ax.set_xlabel('Ano')
    ax.set_ylabel('Número de Cadastros')
    ax.grid(True)
    st.pyplot(fig)
