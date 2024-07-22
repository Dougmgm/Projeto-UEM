import streamlit as st
import matplotlib.pyplot as plt
import pandas as pd
import json

with open('clientes.json') as f:
    data = json.load(f)

# Converte JSON em DataFrame
df = pd.DataFrame(data)

# Inicializar a variável de estado para controlar a visibilidade das análises
if 'mostrar_analises' not in st.session_state:
    st.session_state.mostrar_analises = False

# Função para alternar a visibilidade das análises
def toggle_analises():
    st.session_state.mostrar_analises = not st.session_state.mostrar_analises

# Botão para alternar a visibilidade das análises
if st.button("Mostrar/Ocultar Análises"):
    toggle_analises()

# Exibir as análises se a variável de estado estiver definida como True
if st.session_state.mostrar_analises:
    # Análise Demográfica
    sexo_counts = df['sexo'].value_counts()
    estado_civil_counts = df['estadoCivil'].value_counts()

    st.header("Análise Demográfica")

    st.subheader("Distribuição por Sexo")
    st.bar_chart(sexo_counts)

    st.subheader("Distribuição por Estado Civil")
    st.bar_chart(estado_civil_counts)

    # Análise Temporal
    df['dataCadCli'] = pd.to_datetime(df['dataCadCli'], format='%d/%m/%Y')
    cadastros_por_ano = df['dataCadCli'].dt.year.value_counts().sort_index()

    st.header("Análise Temporal")
    st.subheader("Cadastros por Ano")
    st.line_chart(cadastros_por_ano)

    # Visualização usando Matplotlib
    st.header("Visualizações Detalhadas")

    fig, axes = plt.subplots(1, 2, figsize=(12, 6))

    # Distribuição por Sexo
    sexo_counts.plot(kind='bar', color=['blue', 'pink'], ax=axes[0])
    axes[0].set_title('Distribuição por Sexo')
    axes[0].set_xlabel('Sexo')
    axes[0].set_ylabel('Número de Clientes')

    # Distribuição por Estado Civil
    estado_civil_counts.plot(kind='bar', color='lightgreen', ax=axes[1])
    axes[1].set_title('Distribuição por Estado Civil')
    axes[1].set_xlabel('Estado Civil')
    axes[1].set_ylabel('Número de Clientes')

    plt.tight_layout()
    st.pyplot(fig)

    # Gráfico de Cadastros por Ano
    fig, ax = plt.subplots(figsize=(8, 4))
    cadastros_por_ano.plot(kind='line', marker='o', ax=ax)
    ax.set_title('Número de Cadastros por Ano')
    ax.set_xlabel('Ano')
    ax.set_ylabel('Número de Cadastros')
    ax.grid(True)

    st.pyplot(fig)